import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './notificaciones.css';

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        // Simula la llamada a la API para obtener las notificaciones
        const fetchNotificaciones = async () => {
            const data = [
                { id: 1, mensaje: 'Tienes una nueva oferta de trueque.', leida: false, link: '/oferta-trueque' },
                { id: 2, mensaje: 'Tu producto ha sido vendido.', leida: false, link: null },
                { id: 3, mensaje: 'Tienes un nuevo mensaje.', leida: false, link: null },
                { id: 4, mensaje: 'Se ha actualizado tu perfil.', leida: true, link: null },
                { id: 5, mensaje: 'Tienes una nueva solicitud de amistad de AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.', leida: false, link: '/solicitud-amistad' },
                { id: 6, mensaje: 'Tu pedido ha sido enviado.', leida: false, link: '/pedido-enviado' },
                { id: 7, mensaje: 'Tienes una nueva tarea asignada.', leida: true, link: '/nueva-tarea' },
                { id: 8, mensaje: 'Tu factura está lista para descargar.', leida: true, link: '/factura-lista' },
                { id: 9, mensaje: 'Se ha publicado un nuevo artículo en el blog.', leida: true, link: '/nuevo-articulo' },
                { id: 10, mensaje: 'Hoy es el último día para completar la encuesta.', leida: true, link: '/encuesta' },

            ];
            setNotificaciones(data);
        };

        fetchNotificaciones();
    }, []);

    return (
        <div className="container mt-4">
            <h1>Notificaciones</h1>
            <ul className="list-group">
                {notificaciones.map(notificacion => (
                    <li key={notificacion.id} className={`list-group-item ${notificacion.leida ? 'notification-read' : 'notification-unread'} ${notificacion.link ? 'has-link' : ''}`}>
                        {notificacion.link ? (
                            <NavLink to={notificacion.link || '#'} className={`notification-link ${notificacion.leida ? 'notification-read' : 'notification-unread'}`}>
                                <button className={`notification-button ${notificacion.leida ? 'notification-read' : 'notification-unread'}`} disabled={!notificacion.link}>
                                    {notificacion.mensaje}
                                </button>
                            </NavLink>
                        ) : (
                            <span className={`notification-message ${notificacion.leida ? 'notification-read' : 'notification-unread'}`}>
                                {notificacion.mensaje}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notificaciones;
