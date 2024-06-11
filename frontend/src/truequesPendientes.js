import React, { useState, useEffect, useContext, Fragment } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns'; // Importa las funciones setHours y setMinutes desde date-fns
import Footer from './footer';
import Navbar from './navbar';

const backendUrl = process.env.REACT_APP_BACK_URL;

const TruequesPendientes = () => {
    const { userId } = useContext(AuthContext);
    const [trueques, setTrueques] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [horarioConfirmado, setHorarioConfirmado] = useState(false); // Estado para controlar si el horario ha sido confirmado

    useEffect(() => {
        obtenerTrueques(userId);
    }, [userId]);

    const obtenerTrueques = (userId) => {
        axios.get(`${backendUrl}/mis_trueques`, { params: { usuario_id: userId } })
            .then(response => {
                setTrueques(response.data.trueques);
                console.log("DEBE MOSTRARSE")

            })
            .catch(error => {
                console.error('Error al obtener los trueques pendientes:', error);
                setError('Error al obtener los trueques pendientes');
            });
    };

    const handleDateChange = (date, trueque) => {
        setSelectedDate(date);
        console.log("Fecha seleccionada:", date);
    };

    const confirmarFecha = (trueque) => {
        // Aquí puedes enviar la fecha seleccionada y el ID del trueque al backend para confirmar la fecha y hora
        const formattedDate = selectedDate.toISOString().slice(0, 19).replace('T', ' ');
        axios.post(`${backendUrl}/elegir_horario`, { fecha: formattedDate, idTrueque: trueque.id })
            .then(response => {
                // Manejar la respuesta si es necesario
                console.log("Respuesta del servidor:", response.data);
                // Puedes actualizar los datos en la interfaz o realizar otras acciones si es necesario
                setHorarioConfirmado(true); // Establecer que el horario ha sido confirmado
            })
            .catch(error => {
                // Manejar errores si la solicitud falla
                console.error('Error al enviar la fecha seleccionada:', error);
            });
    };


    const aceptarTrueque = (trueque) => {
        axios.post(`${backendUrl}/aceptar_trueque`, { idTrueque: trueque.id })
            .then(response => {
                obtenerTrueques(userId); // Actualiza la lista de trueques después de aceptar
            })
            .catch(error => {
                console.error('Error al aceptar el trueque:', error);
            });
    };

    const rechazarTrueque = (trueque) => {
        axios.post(`${backendUrl}/rechazar_trueque`, { idTrueque: trueque.id })
            .then(response => {
                obtenerTrueques(userId); // Actualiza la lista de trueques después de rechazar
            })
            .catch(error => {
                console.error('Error al rechazar el trueque:', error);
            });
    };


    return (
        <Fragment>
            <Navbar />
            <div>
                <h2 style={{ backgroundColor: '#2c3359', color: '#ffffff' }}>
                    Trueques Pendientes
                </h2>
                {trueques.length > 0 ? (
                    <ul>
                        {trueques.map((trueque) => (
                            <li key={trueque.id}>
                                Trueque entre {trueque.propietario.nombre} y {trueque.ofertante.nombre}
                                <div>
                                    {trueque.propietario.id === userId ? (
                                        <div>
                                            <h2>Selecciona Fecha y Hora</h2>
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => handleDateChange(date, trueque)}
                                                showTimeSelect
                                                minTime={setHours(setMinutes(new Date(), 0), 8)}
                                                maxTime={setHours(setMinutes(new Date(), 0), 20)}
                                                dateFormat="Pp"
                                                placeholderText="Elige una fecha y hora"
                                                filterDate={date => date.getDay() !== 0}
                                                locale={es}
                                                disabled={horarioConfirmado[trueque.id]} 
                                            />
                                            {!horarioConfirmado[trueque.id] ? (
                                                <button onClick={() => confirmarFecha(trueque)}>Confirmar Fecha y Hora</button>
                                            ) : (
                                                <p>Horario confirmado, esperando respuesta.</p>
                                            )}
                                        </div>
                                    ) : (
                                        trueque.fecha != null ? (
                                        <div>
                                            <button onClick={() => aceptarTrueque(trueque)}>Aceptar</button>
                                            <button onClick={() => rechazarTrueque(trueque)}>Rechazar</button>
                                        </div>
                                        ) : (
                                            <p>Esperando confirmación de fecha</p>
                                        )
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tienes trueques pendientes.</p>
                )}
            </div>
            <Footer />
        </Fragment>
    );
};

export default TruequesPendientes;