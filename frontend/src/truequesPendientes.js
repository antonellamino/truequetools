import React, { useState, useEffect, useContext, Fragment } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';
import Footer from './Footer';
import Navbar from './Navbar';
import './truequesPendientes.css';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';


const backendUrl = process.env.REACT_APP_BACK_URL;

const TruequesPendientes = () => {
    const [trueques, setTrueques] = useState([]);
    const [mensaje, setMensaje] = useState(null);
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

    const confirmarFecha = async (trueque) => {
        const selectedDate = selectedDates[trueque.id];
    
        if (!selectedDate) {
            setErrorMensaje(prevState => ({
                ...prevState,
                [trueque.id]: 'Por favor, selecciona una fecha y hora antes de confirmar.'
            }));
            return;
        }
    
        const formattedDate = selectedDate.toISOString().slice(0, 19).replace('T', ' ');
    
        try {
            const response = await axios.post(`${backendUrl}/elegir_horario`, { fechaHora: formattedDate, idTrueque: trueque.id });
            // Manejar la respuesta del backend según sea necesario
            const nuevosHorarios = {
                ...horarioConfirmado,
                [trueque.id]: true
            };
    
            console.log("nuevo horario ");
            console.log(nuevosHorarios);
    
            setHorarioConfirmado(nuevosHorarios);
            setMensaje(formattedDate);
    
            // Obtener el nombre del producto ofertante
            const productoResponse = await axios.get(`${backendUrl}/producto_especifico/${trueque.id_producto_ofertante}`);
            const nombreProducto = productoResponse.data.nombre; // Suponiendo que el backend devuelve el nombre del producto
            let notificacion = {
                id_usuario: trueque.id_ofertante, // Notificar al ofertante
                mensaje: `Han propuesto un horario para el trueque con el producto ${nombreProducto}`, // Nombre del producto propietario
                leido: false,
                link: `/truequesPendientes/${trueque.id_ofertante}`
            };
    
            // Esperar a que se envíe la notificación antes de recargar la página
            await axios.post(`${backendUrl}/enviar-notificacion`, notificacion);
    
            // Recargar la página después de confirmar la fecha y hora
            window.location.reload();
        } catch (error) {
            console.error('Error al enviar la fecha y hora seleccionadas:', error);
        }
    };
    
    

    const actualizarTrueque = (truequeId, estado) => {
        setTrueques(prevState =>
            prevState.map(trueque =>
                trueque.id === truequeId ? { ...trueque, estado } : trueque
            )
        );
    };

    const aceptarTrueque = async (trueque) => {
        try {
            const response = await axios.post(`${backendUrl}/aceptar_trueque`, { idTrueque: trueque.id });
            console.log("Se aceptó el trueque");
    
            const nuevosMensajes = {
                ...truequeMensajes,
                [trueque.id]: 'Trueque aceptado'
            };
            setTruequeMensajes(nuevosMensajes);
            actualizarTrueque(trueque.id, response.data.estado);
            obtenerTrueques(idUsuario);
    
            // Obtener el nombre del producto ofertante
            const productoResponse = await axios.get(`${backendUrl}/producto_especifico/${trueque.id_producto_propietario}`);
            const nombreProducto = productoResponse.data.nombre; // Suponiendo que el backend devuelve el nombre del producto
    
            let notificacion = {
                id_usuario: trueque.id_propietario, // Notificar al propietario
                mensaje: `Han aceptado tu propuesta de horario ${nombreProducto}`, // Nombre del producto ofertante
                leido: false,
                link: `/truequesPendientes/${trueque.id_propietario}`
            };
    
            await axios.post(`${backendUrl}/enviar-notificacion`, notificacion);
        } catch (error) {
            console.error('Error al aceptar el trueque:', error);
    
            // Mostrar un mensaje de error genérico al usuario
            setErrorMensaje(prevState => ({ ...prevState, [trueque.id]: 'Error al aceptar el trueque' }));
        }
    };
    
    

    const rechazarTrueque = async (trueque) => {
        try {
            const response = await axios.post(`${backendUrl}/rechazar_trueque`, { idTrueque: trueque.id });
            
            const nuevosMensajes = {
                ...truequeMensajes,
                [trueque.id]: 'Trueque cancelado'
            };
            setTruequeMensajes(nuevosMensajes);
            actualizarTrueque(trueque.id, response.data.estado);
            obtenerTrueques(idUsuario); // Actualiza la lista de trueques después de rechazar
    
            // Determinar la notificación según el idUsuario
            let notificacion;
            if (idUsuario === trueque.id_ofertante) {  // Si soy el ofertante
                const productoResponse = await axios.get(`${backendUrl}/producto_especifico/${trueque.id_producto_propietario}`);
                const nombreProducto = productoResponse.data.nombre;
    
                notificacion = {
                    id_usuario: trueque.id_propietario, // Notificar al propietario
                    mensaje: `Han rechazado tu propuesta de horario para truequear ${nombreProducto}`, // Nombre del producto ofertante
                    leido: false,
                    link: `/truequesPendientes/${trueque.id_propietario}`
                };
            } else {
                const productoResponse = await axios.get(`${backendUrl}/producto_especifico/${trueque.id_producto_ofertante}`);
                const nombreProducto = productoResponse.data.nombre; // Suponiendo que el backend devuelve el nombre del producto
    
                notificacion = {
                    id_usuario: trueque.id_ofertante, // Notificar al ofertante
                    mensaje: `Han rechazado tu propuesta de trueque: ${nombreProducto}`, // Nombre del producto propietario
                    leido: false,
                    link: `/truequesPendientes/${trueque.id_ofertante}`
                };
            }
    
            await axios.post(`${backendUrl}/enviar-notificacion`, notificacion);
        } catch (error) {
            console.error('Error al rechazar el trueque:', error);
    
            // Mostrar un mensaje de error genérico al usuario
            setErrorMensaje(prevState => ({ ...prevState, [trueque.id]: 'Error al rechazar el trueque' }));
        }
    };    

    const cancelarTrueque = async (trueque) => {
        // Mostrar alerta de confirmación
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción cancelará el trueque. ¿Estás seguro de continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cancelar trueque',
            cancelButtonText: 'Cancelar'
        });
    
        // Si el usuario confirma la acción
        if (confirmacion.isConfirmed) {
            try {
                const response = await axios.post(`${backendUrl}/cancelar_trueque`, { idTrueque: trueque.id });
    
                const nuevosMensajes = {
                    ...truequeMensajes,
                    [trueque.id]: 'trueque cancelado'
                };
                setTruequeMensajes(nuevosMensajes);
                actualizarTrueque(trueque.id, response.data.estado);
                obtenerTrueques(idUsuario); // Actualiza la lista de trueques después de cancelar
    
                Swal.fire({
                    title: 'Cancelado',
                    text: 'El trueque ha sido cancelado.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                // Limpiar el mensaje de error si la cancelación es exitosa
                setErrorMensaje(prevState => ({ ...prevState, [trueque.id]: '' }));
    
                // Enviar notificación
                let notificacion;
                if (idUsuario === trueque.id_ofertante) {  // Si soy el ofertante
                    notificacion = {
                        id_usuario: trueque.id_propietario, // Notificar al propietario
                        mensaje: `Han cancelado un trueque`,
                        leido: false,
                        link: `/truequesPendientes/${trueque.id_propietario}`
                    };
                } else {
                    notificacion = {
                        id_usuario: trueque.id_ofertante, // Notificar al ofertante
                        mensaje: `Han cancelado un trueque`,
                        leido: false,
                        link: `/truequesPendientes/${trueque.id_ofertante}`
                    };
                }
    
                await axios.post(`${backendUrl}/enviar-notificacion`, notificacion);
    
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    const errorMessage = error.response.data.error;
                    console.error('Error al cancelar el trueque:', errorMessage);
    
                    // Mostrar el mensaje de error al usuario
                    setErrorMensaje(prevState => ({ ...prevState, [trueque.id]: errorMessage }));
                } else {
                    console.error('Error desconocido al cancelar el trueque:', error);
    
                    // Mostrar un mensaje de error genérico al usuario
                    setErrorMensaje(prevState => ({ ...prevState, [trueque.id]: 'Error desconocido al cancelar el trueque' }));
                }
            }
        }else {
            // Mostrar mensaje de que el trueque no ha sido cancelado
            Swal.fire({
                title: 'El trueque no ha sido cancelado.',
                icon: 'info',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy HH:mm', { locale: es });
    };

    return (
        <Fragment>
            <Navbar />
            <div className="trueques-pendientes-container">
                <h2 className="header">Mis trueques</h2>
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
                                            {trueque.fecha === null && trueque.estado !== 'cancelado' && !horarioConfirmado[trueque.id] ? (
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
                                                    <button className="reject-button" onClick={() => rechazarTrueque(trueque)}>Rechazar</button>
                                                    {errorMensaje[trueque.id] && <p className="error-message">{errorMensaje[trueque.id]}</p>}
                                                </div>
                                            ) : (
                                                <div>
                                                    {trueque.estado === 'completado' ? (
                                                        <p>Trueque completado</p>
                                                    ) : trueque.estado === 'esperando_confirmacion' ? (
                                                        <p>Esperando confirmación de horario</p>
                                                    ) : trueque.estado === 'cancelado' ? (
                                                        <p>Trueque cancelado</p>
                                                    ) : (
                                                        <div>
                                                            <p>Trueque aprobado para el día {formatDate(trueque.fecha)}</p>
                                                            <button onClick={() => cancelarTrueque(trueque)}>Cancelar Trueque</button>
                                                            {errorMensaje[trueque.id] && <p className="error-message">{errorMensaje[trueque.id]}</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="trueque-respuesta">
                                            {trueque.fecha === null && trueque.estado !== 'cancelado' ? (
                                                <p>Esperando fecha</p>
                                            ) : (
                                                <div>
                                                    {trueque.estado === "esperando_confirmacion" ? (
                                                        <div>
                                                            <button className="accept-button" onClick={() => aceptarTrueque(trueque)}>Aceptar</button>
                                                            <button className="reject-button" onClick={() => rechazarTrueque(trueque)}>Rechazar</button>
                                                            <p>Horario propuesto para el día {formatDate(trueque.fecha)}</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {trueque.estado === 'completado' ? (
                                                                <p>Trueque completado</p>
                                                            ) : trueque.estado === 'esperando_confirmacion' ? (
                                                                <p>Esperando confirmación de horario</p>
                                                            ) : trueque.estado === 'cancelado' ? (
                                                                <p>Trueque cancelado</p>
                                                            ) : (
                                                                <div>
                                                                    <p>Trueque aprobado para el día {formatDate(trueque.fecha)}</p>
                                                                    <button onClick={() => cancelarTrueque(trueque)}>Cancelar Trueque</button>
                                                                    {errorMensaje[trueque.id] && <p className="error-message">{errorMensaje[trueque.id]}</p>}
                                                                </div>
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

            {/* <div className="mt-3">
                <Link to="/listaSucursales" className="btn btn-secondary w-100">Volver</Link>
            </div> */}
            <Footer />
        </Fragment>
    );
};

export default TruequesPendientes;