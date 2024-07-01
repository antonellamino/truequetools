import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './notificaciones.css';
import Navbar from './Navbar';
import axios from 'axios';
import { useAuth } from './AuthContext';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Notificaciones = () => {
    const { userId } = useAuth();
    const [notificaciones, setNotificaciones] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${backendUrl}/notificaciones`, { params: { userId } })
            .then(response => {
                const data = response.data.notificaciones;
                const sortedNotificaciones = data.sort((a, b) => b.id - a.id);
                setNotificaciones(sortedNotificaciones);
            })
            .catch(error => {
                console.error('Error al obtener las notificaciones:', error);
            });
    }, [userId]);

    useEffect(() => {
        console.log('Notificaciones obtenidas:', notificaciones);
    }, [notificaciones]);

    const handleNotificationClick = async (notificacion) => {
        try {
            await axios.put(`${backendUrl}/notificaciones/leer`, { id: notificacion.id });
            console.log('Notificación marcada como leída correctamente.');
            setNotificaciones(prevNotificaciones =>
                prevNotificaciones.map(n =>
                    n.id === notificacion.id ? { ...n, leido: true } : n
                )
            );
            if (notificacion.link) {
                navigate(notificacion.link);
            }
        } catch (error) {
            console.error('Error al marcar la notificación como leída:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1 style={{ color: 'black' }}>Notificaciones</h1>
                {notificaciones.length === 0 ? (
                    <p style={{ color: 'white' }}>No tienes notificaciones.</p>
                ) : (
                    <ul className="list-group">
                        {notificaciones.map(notificacion => (
                            <li 
                                key={notificacion.id} 
                                className={`list-group-item ${notificacion.leido ? 'notification-read' : 'notification-unread'}`}
                                style={{ color: notificacion.leido ? 'gray' : 'white' }}
                            >
                                <button
                                    className={`notification-button ${notificacion.leido ? 'btn-read' : 'btn-unread'}`}
                                    style={{ color: notificacion.leido ? 'gray' : 'white' }}
                                    onClick={() => handleNotificationClick(notificacion)}
                                >
                                    {notificacion.mensaje}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notificaciones;
