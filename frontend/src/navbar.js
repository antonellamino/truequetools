import React, { Fragment, useContext, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Header from './header';
import { AuthContext } from './AuthContext'; // Importa el contexto de autenticación
import './navbar.css';

const Navbar = () => {
    const { userId,isAuthenticated, logout } = useContext(AuthContext); // Obtiene el estado de autenticación del contexto
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadNotifications, setUnreadNotifications] = useState(5); //Número de notificaciones no leídas, puedes cambiar este valor dinámicamente

    const handleCerrarSesion = () => {
        logout(); // Cierra sesión utilizando el contexto de autenticación
        navigate('/logout'); // Redirige a la página de logout
    }


    
    const handleNotificationClick = () => {
        navigate(`/notificaciones/${userId}`); // Redirige a la página de notificaciones
    }

    const isHomePage = location.pathname === '/';
    const homeButtonStyle = isHomePage ? {} : { color: '#ccc' };   // Si es home, el color es gris

    return (
        <Fragment>
            <Header />
            <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
                <div className="container-fluid">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" exact to="/" activeClassName="active" style={homeButtonStyle}>Inicio</NavLink>
                        </li>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </ul>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                        <ul className="navbar-nav">
                            {!isAuthenticated && (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/registro" activeClassName="active">Regístrate</NavLink>
                                </li>
                            )}
                            {isAuthenticated && (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/publicarProducto" activeClassName="active">Publicar Producto</NavLink>
                                </li>
                            )}
                            {isAuthenticated && (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/ClienteDashboard" activeClassName="active">Ver mis productos</NavLink>
                                </li>
                            )}
                            {isAuthenticated && (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/truequesPendientes" activeClassName="active">Trueques Pendientes</NavLink>
                                </li>
                            )}
                            {isAuthenticated ? (
                                <li className="nav-item">
                                    <button className="nav-link btn" onClick={handleCerrarSesion}>Cerrar Sesión</button>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/iniciarSesion" activeClassName="active">Iniciar sesión</NavLink>
                                </li>
                            )}
                        </ul>
                        {isAuthenticated && (
                            <div className="d-flex align-items-center"> {/* Añade una clase d-flex y align-items-center */}
                                <button className="nav-link btn btn-link notification-button" onClick={handleNotificationClick} style={{ color: 'white' }}>
                                    <i className="fas fa-bell bell-icon"></i>
                                    {unreadNotifications > 0 && (
                                        <span className="notification-count">{unreadNotifications}</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </Fragment>
    );
};

export default Navbar;
