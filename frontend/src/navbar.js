import React, { Fragment,useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Header from './header';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './navbar.css';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Navbar = ({ actualizarProductosFiltrados }) => {
    const { userId,isAuthenticated, logout, rol } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadNotifications, setUnreadNotifications] = useState(0); //Número de notificaciones no leídas, puedes cambiar este valor dinámicamente

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            // Realiza la solicitud HTTP para obtener la cantidad de notificaciones no leídas
            axios.get(`${backendUrl}/notificaciones/no-leidas`, { params: { userId } })
                .then(response => {
                    const count = response.data.count; // Obtiene la cantidad de notificaciones no leídas
                    setUnreadNotifications(count);
                })
                .catch(error => {
                    console.error('Error al obtener la cantidad de notificaciones no leídas:', error);
                });
        }
    }, [userId, isAuthenticated]);


    const handleCerrarSesion = () => {
        logout();
    }

    const handleNotificationClick = () => {
        navigate(`/notificaciones/${userId}`); // Redirige a la página de notificaciones
    }

    const handleTruequeClick = () => {
        navigate(`/truequesPendientes/${userId}`);
    }

    const isHomePage = location.pathname === '/';
    const homeButtonStyle = isHomePage ? {} : { color: '#ccc' };


    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${backendUrl}/productos-filtrados`, { params: { nombre: searchQuery } });
            actualizarProductosFiltrados(response.data.productos);
        } catch (error) {
            console.error('Error al buscar productos:', error);
        }
    };

    return (
        <Fragment>
            <Header />
            <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
                <div className="container-fluid">


                    <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink className="nav-link" exact to="/" activeClassName="active" style={homeButtonStyle}>Inicio</NavLink>
                            </li>
                            {isAuthenticated && rol === 1 && (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/adminDashboard" activeClassName="active">Panel de control</NavLink>
                                </li>
                            )}
                            {!isAuthenticated && (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/registro" activeClassName="active">Regístrate</NavLink>
                                </li>
                            )}
                            {isAuthenticated && rol === 3 && (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/publicarProducto" activeClassName="active">Publicar producto</NavLink>
                                </li>
                            )}
                            {isAuthenticated && rol === 3 && (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/clienteDashboard" activeClassName="active">Ver mis productos</NavLink>
                                </li>
                            )}
                            {isAuthenticated && rol === 3 &&(
                                <li className="nav-item">
                                <button className="nav-link btn" onClick={handleTruequeClick}> Trueques Pendientes </button>
                                </li>
                            )}
                            {isAuthenticated ? (
                                <li className="nav-item">
                                    <button className="nav-link btn" onClick={handleCerrarSesion}>Cerrar sesión</button>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/iniciarSesion" activeClassName="active">Iniciar sesión</NavLink>
                                </li>
                            )}
                        </ul>
                        {isAuthenticated && (
                            <div className="d-flex align-items-center">
                                <button className="nav-link btn btn-link notification-button" onClick={handleNotificationClick} style={{ color: 'white' }}>
                                    <i className="fas fa-bell bell-icon"></i>
                                    {unreadNotifications > 0 && (
                                        <span className="notification-count">{unreadNotifications}</span>
                                    )}
                                </button>
                            </div>
                        )}
                        <form className="d-flex" onSubmit={handleSearch}>
                            <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <button className="btn btn-outline-light" type="submit">Buscar</button>
                        </form>
                    </div>
                </div>
            </nav>
        </Fragment>
    );
};

export default Navbar;
