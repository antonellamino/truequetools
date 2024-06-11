import React, { Fragment, useState } from "react";
import axios from "axios";
import Navbar from "./navbar";

const backendUrl = process.env.REACT_APP_BACK_URL;

const AgregarEmpleado = () => {
    const [contrasena, setContrasena] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nombre_usuario, setNombreUsuario] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const datosEmpleado = {
            nombre: nombre,
            apellido: apellido,
            nombre_usuario: nombre_usuario,
            contrasena: contrasena,
            rol_id: 2
        };

        axios.post(`${backendUrl}/agregarEmpleado`, datosEmpleado)
            .then(response => {
                console.log('Empleado dado de alta exitosamente', response.data);
            })
            .catch(error => {
                console.error('Error al registrar el usuario:', error);
                // seteo de mje de error
            });
    };

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre empleado</label>
                                <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Apellido empleado</label>
                                <input type="text" className="form-control" id="nombre" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre usuario</label>
                                <input type="text" className="form-control" id="nombre" value={nombre_usuario} onChange={(e) => setNombreUsuario(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Contraseña</label>
                                <input type="password" className="form-control" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Agregar empleado</button>
                        </form>
                    </div>
                </div>
            </div>
            
        </Fragment>
    );
};

export default AgregarEmpleado;