import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useAuth } from './AuthContext';

// Importa el archivo CSS
import './miPerfil.css';

const backendUrl = process.env.REACT_APP_BACK_URL;

const MiPerfil = () => {
    const [usuario, setUsuario] = useState(null); 
    const navigate = useNavigate();
    const { userId } = useAuth(); // Obtén el ID del usuario desde el contexto de autenticación

    useEffect(() => {
        if (userId) {
            cargarDatosUsuario();
        }
    }, [userId]); // Se ejecuta cuando userId cambia

    // Función para cargar los datos del usuario
    const cargarDatosUsuario = async () => {
        try {
            const response = await axios.get(`${backendUrl}/usuarioActual/${userId}`); // Endpoint para obtener perfil de usuario
          
            if (response.status === 200) {
                setUsuario(response.data.usuario); // Actualiza el estado con los datos del usuario
            } else {
                console.error('Error al cargar los datos del usuario:', response.data.error);
            }
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
            // Aquí puedes manejar errores según tu lógica de la aplicación
        }
    };

    const irAEditarPerfil = () => {
        navigate('/editarPerfil'); // Navega hacia la página de edición de perfil
    };

    if (!usuario) {
        return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtienen los datos
    }

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <div className="perfil-container">
                    <div className="perfil-header">
                        <h2>Mi Perfil</h2>
                    </div>
                    <div className="perfil-datos card">
                        <div className="card-body">
                            <div className="dato">
                                <span className="label">Nombre:</span>
                                <span className="valor">{usuario.nombre}</span>
                            </div>
                            <div className="dato">
                                <span className="label">Apellido:</span>
                                <span className="valor">{usuario.apellido}</span>
                            </div>
                            <div className="dato">
                                <span className="label">Correo:</span>
                                <span className="valor">{usuario.correo}</span>
                            </div>
                            <div className="dato">
                                <span className="label">Fecha nacimiento:</span>
                                <span className="valor">{new Date(usuario.fecha_nacimiento).toLocaleDateString()}</span>
                            </div>
                            <button onClick={irAEditarPerfil} className="btn btn-primary mt-3">Editar Perfil</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
    
};

export default MiPerfil;

