import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Header from './header'; 

const Navbar = () => {
    return (
        <Fragment>
            <Header />
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/" activeClassName="active">Inicio</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/registro" activeClassName="active">Registrate</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/publicarProducto" activeClassName="active">Publicar Producto</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/iniciarSesion" activeClassName="active">Iniciar sesion</NavLink>
                            </li>
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
