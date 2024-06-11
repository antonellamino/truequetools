import React, { useState, useEffect, useContext, Fragment } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';
import Footer from './footer';
import Navbar from './navbar';
import './truequesPendientes.css';

const backendUrl = process.env.REACT_APP_BACK_URL;

const TruequesPendientes = () => {
    const { userId } = useContext(AuthContext);
    const [trueques, setTrueques] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDates, setSelectedDates] = useState({});
    const [horarioConfirmado, setHorarioConfirmado] = useState({}); // Estado para controlar la confirmación para cada trueque

    useEffect(() => {
        obtenerTrueques(userId);
    }, [userId]);

    const obtenerTrueques = (userId) => {
        axios.get(`${backendUrl}/mis_trueques`, { params: { usuario_id: userId } })
            .then(response => {
                setTrueques(response.data.trueques);
            })
            .catch(error => {
                console.error('Error al obtener los trueques pendientes:', error);
                setError('Error al obtener los trueques pendientes');
            });
    };

    const handleDateChange = (date, trueque) => {
        setSelectedDates(prevState => ({
            ...prevState,
            [trueque.id]: date
        }));
    };

    const confirmarFecha = (trueque) => {
        const formattedDate = selectedDates[trueque.id].toISOString().slice(0, 19).replace('T', ' ');
        axios.post(`${backendUrl}/elegir_horario`, { fecha: formattedDate, idTrueque: trueque.id })
            .then(response => {
                setHorarioConfirmado(prevState => ({
                    ...prevState,
                    [trueque.id]: true
                }));
            })
            .catch(error => {
                console.error('Error al enviar la fecha seleccionada:', error);
            });
    };

    const aceptarTrueque = (trueque) => {
        axios.post(`${backendUrl}/aceptar_trueque`, { idTrueque: trueque.id })
            .then(response => {
                console.log("se acepto el trueque");
                obtenerTrueques(userId); // Actualiza la lista de trueques después de aceptar
            })
            .catch(error => {
                console.error('Error al aceptar el trueque:', error);
            });
    };

    const rechazarTrueque = (trueque) => {
        axios.post(`${backendUrl}/rechazar_trueque`, { idTrueque: trueque.id })
            .then(response => {
                console.log("se rechazo");
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
                                {/* aca tendria que ir la foto de ambos productos */}
                                <div>

                                <img src={trueque.imagenPropietario ? `data:image/jpeg;base64,${trueque.imagenPropietario}` : '/logo_2.svg'}
                                alt="Imagen del producto propietario"
                                ></img>

                                <img src={trueque.imagenOfertante ? `data:image/jpeg;base64,${trueque.imagenOfertante}` : '/logo_2.svg'}
                                alt="Imagen del producto ofertante"
                                ></img>
                                
                                </div>

                                <div>
                                    {trueque.propietario.id === userId ? (
                                        <div>
                                            <h2>Selecciona Fecha y Hora</h2>
                                            {!horarioConfirmado[trueque.id] ? (
                                                <div>
                                                    <DatePicker
                                                        selected={selectedDates[trueque.id]}
                                                        onChange={(date) => handleDateChange(date, trueque)}
                                                        showTimeSelect
                                                        minTime={setHours(setMinutes(new Date(), 0), 8)}
                                                        maxTime={setHours(setMinutes(new Date(), 0), 20)}
                                                        dateFormat="Pp"
                                                        placeholderText="Elige una fecha y hora"
                                                        filterDate={date => date.getDay() !== 0}
                                                        locale={es}
                                                    />
                                                    <button onClick={() => confirmarFecha(trueque)}>Confirmar Fecha y Hora</button>
                                                </div>
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