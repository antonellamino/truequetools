import React, { useState, useEffect, Fragment } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';
import Footer from './footer';
import Navbar from './navbar';
import './truequesPendientes.css'; // Importamos el archivo CSS

const backendUrl = process.env.REACT_APP_BACK_URL;

const TruequesPendientes = () => {
    const { userId } = useAuth();
    const [trueques, setTrueques] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDates, setSelectedDates] = useState({});
    const [horarioConfirmado, setHorarioConfirmado] = useState({});
    const [truequeMensajes, setTruequeMensajes] = useState({});
    const [errorMensaje, setErrorMensaje] = useState({});
     //aaaa

    useEffect(() => {
        obtenerTrueques(userId);
        //me guardo los mensajes, en caso de ya haberlos "instanciado", no me da la posibilidad de volver a hacerlo, logrando guardar el "estado"
        cargarMensajesDesdeLocalStorage();
        cargarHorariosDesdeLocalStorage();
    }, [userId]);

    const cargarMensajesDesdeLocalStorage = () => {
        const mensajesGuardados = localStorage.getItem('truequeMensajes');
        if (mensajesGuardados) {
            setTruequeMensajes(JSON.parse(mensajesGuardados));
        }
    };

    const guardarMensajesEnLocalStorage = (mensajes) => {
        localStorage.setItem('truequeMensajes', JSON.stringify(mensajes));
    };

    const cargarHorariosDesdeLocalStorage = () => {
        const horariosGuardados = localStorage.getItem('horarioConfirmado');
        if (horariosGuardados) {
            setHorarioConfirmado(JSON.parse(horariosGuardados));
        }
    };

    const guardarHorariosEnLocalStorage = (horarios) => {
        localStorage.setItem('horarioConfirmado', JSON.stringify(horarios));
    };


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
        //si hay mensaje,erro es null
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
        
        const formattedDate = selectedDates[trueque.id].toISOString().slice(0, 19).replace('T', ' ');
        axios.post(`${backendUrl}/elegir_horario`, { fecha: formattedDate, idTrueque: trueque.id })
            .then(response => {
                const nuevosHorarios = {
                    ...horarioConfirmado,
                    [trueque.id]: true
                };
                setHorarioConfirmado(nuevosHorarios);
                guardarHorariosEnLocalStorage(nuevosHorarios);
               
            })
            .catch(error => {
                console.error('Error al enviar la fecha seleccionada:', error);
            });
    };



    //el propietario lograra ver la respuesta del
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
                //cambie aca
                const nuevosMensajes = {
                    ...truequeMensajes,
                    [trueque.id]: 'Trueque aceptado'
                };
                setTruequeMensajes(nuevosMensajes);
                guardarMensajesEnLocalStorage(nuevosMensajes);
                actualizarTrueque(trueque.id, response.data.estado);
           
                //aa

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
                //aa
                const nuevosMensajes = {
                    ...truequeMensajes,
                    [trueque.id]: 'Trueque cancelado'
                };
                setTruequeMensajes(nuevosMensajes);
                guardarMensajesEnLocalStorage(nuevosMensajes);
                actualizarTrueque(trueque.id, response.data.estado);
           
                //aaa

                obtenerTrueques(userId); // Actualiza la lista de trueques después de rechazar
            })
            .catch(error => {
                console.error('Error al rechazar el trueque:', error);
            });
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
                                    <img src={trueque.imagenPropietario ? `data:image/jpeg;base64,${trueque.imagenPropietario}` : '/logo_2.svg'}
                                        alt="Imagen del producto propietario"
                                        className="trueque-image" />
                                    <img src="/Flecha_008.png"
                                        alt="Flecha"
                                        className="trueque-flecha" />
                                    <img src={trueque.imagenOfertante ? `data:image/jpeg;base64,${trueque.imagenOfertante}` : '/logo_2.svg'}
                                        alt="Imagen del producto ofertante"
                                        className="trueque-image" />
                                </div>
                                <div className="trueque-actions">
                                    {trueque.propietario.id === userId ? (
                                        <div className="trueque-fecha-hora">
                                            {!horarioConfirmado[trueque.id] && trueque.estado !== 'espera' ? (
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
                                                trueque.estado === 'espera' && horarioConfirmado[trueque.id] && truequeMensajes[trueque.id] === 'Trueque aceptado' ? (
                                                    <p>Trueque confirmado por ambas partes.</p>
                                                ) : (
                                                    trueque.estado === 'espera' && horarioConfirmado[trueque.id] && truequeMensajes[trueque.id] === 'Trueque cancelado' ? (
                                                        <p>Trueque rechazado por ofertante.</p>
                                                    ) : (  
                                                        !truequeMensajes[trueque.id]  ? (
                                                            <p>Horario confirmado, esperando respuesta.</p>
                                                        ) : null
                                                    )
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        //si no soy propietario y ya eligio el propietario la fecha
                                        trueque.fecha !== null ? (
                                            <div className="trueque-respuesta">
                                                
                                                {truequeMensajes[trueque.id] ? (
                                                    <p>{truequeMensajes[trueque.id]}</p>

                                                ) : (
                                                    <div>
                                                        <button className="accept-button" onClick={() => aceptarTrueque(trueque)}>Aceptar</button>
                                                        <button className="reject-button" onClick={() => rechazarTrueque(trueque)}>Rechazar</button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            trueque.estado !== 'espera' ? (
                                            <p>Esperando confirmación de fecha</p>
                                            ) : null
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