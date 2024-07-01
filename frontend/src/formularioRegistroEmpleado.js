import React, { Fragment, useState } from 'react';
//import NavAdmin from './navAdmin';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const AltaEmpleado = () => {
    const [nombre, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [apellido, setApellido] = useState('');
    const [nombre_usuario, setNombreUsuario] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const datosFormulario = {
            nombre: nombre,
            apellido: apellido,
            contrasena: contrasena,
            nombre_usuario: nombre_usuario
        };

        try {
            const response = await axios.post(`${backendUrl}/registrar-empleado`, datosFormulario);
            setMensaje(response.data.message || 'Empleado registrado exitosamente');
            setMensajeError('');
            setNombre('');
            setApellido('');
            setNombreUsuario('');
            setContrasena('');
        } catch (error) {
            console.error('Error al registrar los datos:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setMensajeError(error.response.data.error);
            } else {
                setMensajeError('Error al registrar los datos');
            }
            setMensaje('');
        }
    };

    const handleCancel = () => {
        navigate('/adminDashboard');
    };

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4" style={{ color: 'white' }}>Alta Empleado</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            placeholder="Ingresa el nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido">Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            id="apellido"
                            placeholder="Ingresa el apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre_usuario">nombre de usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre_usuario"
                            placeholder="Ingresa el nombre de usuario"
                            value={nombre_usuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contrasena">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="contrasena"
                            placeholder="Ingresa la contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>
                    {mensaje && <div className="alert alert-success mt-2">{mensaje}</div>}
                    {mensajeError && <div className="alert alert-danger mt-2">{mensajeError}</div>}
                    <div className="mb-3">
                        <div className="row">
                            <div className="col">
                                <button type="submit" className="btn btn-primary w-100" >Guardar Cambios</button>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default AltaEmpleado;