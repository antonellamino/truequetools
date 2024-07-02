import React, { Fragment, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Header from './header';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './navbar.css';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Navbar = ({ actualizarProductosFiltrados }) => {
    const { userId, isAuthenticated, logout, rol } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            axios.get(`${backendUrl}/notificaciones/no-leidas`, { params: { userId } })
                .then(response => {
                    const count = response.data.count;
                    setUnreadNotifications(count);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al obtener la cantidad de notificaciones no leídas:', error);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [userId, isAuthenticated]);

    const handleCerrarSesion = () => {
        logout();
    }

    const handleNotificationClick = () => {
        navigate(`/notificaciones/${userId}`);
    }

    const handleTruequeClick = () => {
        navigate(`/truequesPendientes/${userId}`);
    }

    const isHomePage = location.pathname === '/';
    const homeButtonStyle = isHomePage ? {} : { color: '#ccc' };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            await axios.get(`${backendUrl}/productos-filtrados`, { params: { nombre: searchQuery } })
                .then(response => {
                    console.log("Productos encontrados:", response.data.productos); // Verifica los productos devueltos por el servidor
                    const productosValidos = response.data.productos.filter(producto => !producto.estado);

                    console.log("Productos válidos:", productosValidos); // Verifica los productos válidos después del filtrado

                    actualizarProductosFiltrados(productosValidos); // Actualiza el estado local de los productos filtrados
                })
                .catch(error => {
                    console.error('Error al buscar productos:', error);
                });
        } catch (error) {
            console.error('Error al buscar productos:', error);
        }
    };

    if (isLoading) {
        return null; // O puedes mostrar un componente de carga aquí
    }

    return (
        <Fragment>
            <Header />
            <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/" style={homeButtonStyle}>Inicio</NavLink>
                            </li>
                            {isAuthenticated && rol === 3 && (
                                <li className="nav-item">
                                    <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/miPerfil" style={homeButtonStyle}>Mi perfil</NavLink>
                                </li>
                            )}
                            {isAuthenticated && rol === 1 && (
                                <li className="nav-item">
                                    <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/infoSucursal" style={homeButtonStyle}>Lista de sucursales</NavLink>
                                </li>
                            )}
                            {isAuthenticated && rol === 1 && (
                                <li className="nav-item">
                                    <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/adminDashboard">Panel de control</NavLink>
                                </li>
                            )}
                            {isAuthenticated && rol === 2 && (
                                <li className="nav-item">
                                    <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/empleadoDashboard">Panel de control</NavLink>
                                </li>
                            )}
                            {!isAuthenticated && (
                                <li className="nav-item">
                                    <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/registro">Regístrate</NavLink>
                                </li>
                            )}
                            {isAuthenticated && rol === 3 && (
                                <>
                                    <li className="nav-item">
                                        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/publicarProducto">Publicar producto</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/clienteDashboard">Ver mis productos</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn" onClick={handleTruequeClick}>Mis trueques</button>
                                    </li>

                                </>
                            )}
                            {isAuthenticated ? (
                                <li className="nav-item">
                                    <button className="nav-link btn" onClick={handleCerrarSesion}>Cerrar sesión</button>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/iniciarSesion">Iniciar sesión</NavLink>
                                </li>
                            )}
                        </ul>

                        <div className="d-flex align-items-center">

                            {isAuthenticated && rol === 3 &&(
                                <button className="nav-link btn btn-link notification-button" onClick={handleNotificationClick} style={{ color: 'white' }}>
                                    <i className="fas fa-bell bell-icon"></i>
                                    {unreadNotifications > 0 && (
                                        <span className="notification-count">{unreadNotifications}</span>
                                    )}
                                </button>
                            )}

                            {isHomePage && (
                                <form className="d-flex search-form" onSubmit={handleSearch}>
                                    <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                    <button className="btn btn-outline-light" type="submit">Buscar</button>
                                </form>
                            )}

                        </div>
                    </div>
                </div>
            </nav>
        </Fragment>
    );
};

export default Navbar;