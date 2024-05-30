import React, { Fragment, useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Header from './header';
import { AuthContext } from './AuthContext'; // Importa el contexto de autenticación

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext); // Obtiene el estado de autenticación del contexto
    const navigate = useNavigate();
    const location = useLocation();

    const handleCerrarSesion = () => {
        logout(); // Cierra sesión utilizando el contexto de autenticación
        navigate('/logout'); // Redirige a la página de logout
    }

    const isHomePage = location.pathname === '/';
    const homeButtonStyle = isHomePage ? {} : { color: '#ccc' };   //si es home el color es gris

    return (
        <Fragment>
            <Header />
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
                            <form className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" />
                                <button className="btn btn-outline-light" type="submit">Buscar</button>
                            </form>
                        
                    </div>
                </div>
            </nav>
        </Fragment>
    );
};

export default Navbar;