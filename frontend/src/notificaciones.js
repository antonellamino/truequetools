import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './notificaciones.css';
import axios from 'axios'; // Importa axios para realizar solicitudes HTTP
import { AuthContext } from './AuthContext';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Notificaciones = () => {
    const { userId } = useContext(AuthContext);
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {

        console.log(userId);
        axios.get(`${backendUrl}/notificaciones`, { params: { userId } }) 
        .then(response => {
            const data = response.data.notificaciones;
            const sortedNotificaciones = data.sort((a, b) => b.id - a.id);
            setNotificaciones(sortedNotificaciones);
        })
        .catch(error => {
            console.error('Error al obtener las notificaciones:', error);
        });
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