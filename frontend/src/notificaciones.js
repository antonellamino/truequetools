import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './notificaciones.css';
import Navbar from './navbar';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Notificaciones = () => {
    const { userId } = useContext(AuthContext);
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        axios.get(`${backendUrl}/notificaciones`, { params: { userId } })
        .then(response => {
            const data = response.data.notificaciones;
            const sortedNotificaciones = data.sort((a, b) => b.id - a.id);
            setNotificaciones(sortedNotificaciones);

            axios.put(`${backendUrl}/notificaciones/leer`, { userId })
            .then(() => {
                console.log('Notificaciones marcadas como leídas correctamente.');
            })
            .catch(error => {
                console.error('Error al marcar las notificaciones como leídas:', error);
            });
        })
        .catch(error => {
            console.error('Error al obtener las notificaciones:', error);
        });
    }, [userId]);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1>Notificaciones</h1>
                <ul className="list-group">
                    {notificaciones.map(notificacion => (
                        <li 
                            key={notificacion.id} 
                            className={`list-group-item ${notificacion.leida ? 'notification-read' : 'notification-unread'}`}
                        >
                            {notificacion.link ? (
                                <NavLink to={notificacion.link || '#'}>
                                    <button 
                                        className={`notification-button ${notificacion.leida ? 'notification-read' : 'notification-unread'}`}
                                    >
                                        {notificacion.mensaje}
                                    </button>
                                </NavLink>
                            ) : (
                                <button
                                    className={`notification-button ${notificacion.leida ? 'notification-read' : 'notification-unread'} disabled`}
                                    disabled
                                >
                                    {notificacion.mensaje}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Notificaciones;
