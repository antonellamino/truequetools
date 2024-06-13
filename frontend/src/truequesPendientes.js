import React, { useState, useEffect, useContext, Fragment } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';
import Footer from './footer';
import Navbar from './navbar';
import './truequesPendientes.css'; // Importamos el archivo CSS
import { format } from 'date-fns';

const backendUrl = process.env.REACT_APP_BACK_URL;

const TruequesPendientes = () => {
    const [trueques, setTrueques] = useState([]);
    const [setMensaje, mensaje] = useState(null);
    const [selectedDates, setSelectedDates] = useState({});
    const [horarioConfirmado, setHorarioConfirmado] = useState({});
    const [truequeMensajes, setTruequeMensajes] = useState({});
    const [errorMensaje, setErrorMensaje] = useState({});
    
    const idUsuario = localStorage.getItem('userId');

    useEffect(() => {
        obtenerTrueques(idUsuario); 
    }, [idUsuario]);

    const obtenerTrueques = (idUsuario) => {
        axios.get(`${backendUrl}/mis_trueques`, { params: { usuario_id: idUsuario } })
            .then(response => {
                setTrueques(response.data.trueques);
            })
            .catch(error => {
                console.error('Error al obtener los trueques pendientes:', error);
            });
    };

    const handleDateChange = (date, trueque) => {
        setSelectedDates(prevState => ({
            ...prevState,
            [trueque.id]: date
        }));
        setErrorMensaje(prevState => ({
            ...prevState,
            [trueque.id]: null
        }));
    };
   
    const confirmarFecha = (trueque) => {
        const selectedDate = selectedDates[trueque.id];
    
        if (!selectedDate) {
            setErrorMensaje(prevState => ({
                ...prevState,
                [trueque.id]: 'Por favor, selecciona una fecha y hora antes de confirmar.'
            }));
            return;
        }
        
        const formattedDate = selectedDate.toISOString().slice(0, 19).replace('T', ' ');
        // Formatear la fecha y hora seleccionada en formato ISO 8601
    
        // Enviar la fecha y hora formateada al backend
        axios.post(`${backendUrl}/elegir_horario`, { fechaHora:  formattedDate, idTrueque: trueque.id })
            .then(response => {
                // Manejar la respuesta del backend según sea necesario
                const nuevosHorarios = {
                    ...horarioConfirmado,
                    [trueque.id]: true
                };
                setHorarioConfirmado(nuevosHorarios);
                // Recargar la página después de confirmar la fecha y hora
                window.location.reload();
            })
            .catch(error => {
                console.error('Error al enviar la fecha y hora seleccionadas:', error);
            });
    };

    const actualizarTrueque = (truequeId, estado) => {
        setTrueques(prevState =>
            prevState.map(trueque =>
                trueque.id === truequeId ? { ...trueque, estado } : trueque
            )
        );
    };

    const aceptarTrueque = (trueque) => {
        axios.post(`${backendUrl}/aceptar_trueque`, { idTrueque: trueque.id })
            .then(response => {
                console.log("se acepto el trueque");
                const nuevosMensajes = {
                    ...truequeMensajes,
                    [trueque.id]: 'Trueque aceptado'
                };
                setTruequeMensajes(nuevosMensajes);
                actualizarTrueque(trueque.id, response.data.estado);
                obtenerTrueques(idUsuario); 
            })
            .catch(error => {
                console.error('Error al aceptar el trueque:', error);
            });
    };

    const rechazarTrueque = (trueque) => {
        axios.post(`${backendUrl}/rechazar_trueque`, { idTrueque: trueque.id })
            .then(response => {
                console.log("se rechazo");
                const nuevosMensajes = {
                    ...truequeMensajes,
                    [trueque.id]: 'Trueque cancelado'
                };
                setTruequeMensajes(nuevosMensajes);
                actualizarTrueque(trueque.id, response.data.estado);
                obtenerTrueques(idUsuario); // Actualiza la lista de trueques después de rechazar
            })
            .catch(error => {
                console.error('Error al rechazar el trueque:', error);
            });
    };

    const formatDate = (dateString) => {
        // Convertir la cadena de fecha a un objeto Date
        const date = new Date(dateString);
    
        // Restar 3 horas al tiempo en milisegundos para ajustar a GMT-3
        date.setHours(date.getHours() - 3);
    
        // Formatear la fecha y hora en el formato deseado
        return format(date, 'dd MMMM yyyy HH:mm', { locale: es });
    };

    return (
        <Fragment>
            <Navbar />
            <div className="trueques-pendientes-container">
                <h2 className="header">Trueques Pendientes</h2>
                {trueques.length > 0 ? (
                    <ul className="trueques-list">
                        {trueques.map((trueque) => (
                            <li key={trueque.id} className="trueque-item">
                                <div className="trueque-header">
                                    Trueque entre {trueque.propietario.nombre} y {trueque.ofertante.nombre}
                                </div>
                                <div className="trueque-images">
                                    <img
                                        src={trueque.imagenPropietario ? `data:image/jpeg;base64,${trueque.imagenPropietario}` : '/logo_2.svg'}
                                        alt="Imagen del producto propietario"
                                        className="trueque-image"
                                    />
                                    <img
                                        src="/Flecha_008.png"
                                        alt="Flecha"
                                        className="trueque-flecha"
                                    />
                                    <img
                                        src={trueque.imagenOfertante ? `data:image/jpeg;base64,${trueque.imagenOfertante}` : '/logo_2.svg'}
                                        alt="Imagen del producto ofertante"
                                        className="trueque-image"
                                    />
                                </div>
                                <div className="trueque-actions">
                                    {trueque.id_propietario == idUsuario ? (
                                        <div className="trueque-fecha-hora">
                                            {trueque.fecha === null && trueque.estado=="creado" ? (
                                                <div>
                                                    <h3>Selecciona Fecha y Hora</h3>
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
                                                        className="date-picker"
                                                    />
                                                    <button className="confirm-button" onClick={() => confirmarFecha(trueque)}>Confirmar Fecha y Hora</button>
                                                    {errorMensaje[trueque.id] && <p className="error-message">{errorMensaje[trueque.id]}</p>}
                                                </div>
                                            ) : (
                                                <div>
                                                    {trueque.estado === 'esperando_confirmacion' ? (
                                                        <p>Esperando confirmación de horario</p>
                                                    ) : trueque.estado === 'cancelado' ? (
                                                        <p>Trueque cancelado</p>
                                                    ) : (
                                                        <p>Trueque aprobado para el día {formatDate(trueque.fecha)}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="trueque-respuesta">
                                            {trueque.fecha === null ? (
                                                <p>Esperando fecha</p>
                                            ) : (
                                                <div>
                                                    {trueque.estado === "esperando_confirmacion" ? (
                                                        <div>
                                                            <button className="accept-button" onClick={() => aceptarTrueque(trueque)}>Aceptar</button>
                                                            <button className="reject-button" onClick={() => rechazarTrueque(trueque)}>Rechazar</button>
                                                            <p>{mensaje}</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {trueque.estado === 'cancelado' ? (
                                                                <p>Trueque cancelado</p>
                                                            ) : (
                                                                <p>Trueque aprobado para el día {formatDate(trueque.fecha)}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
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