import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const AltaSucursal = () => {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datosFormulario = {
            nombre: nombre,
            direccion: direccion,
            telefono: telefono
        };

        try {
            const response = await axios.post(`${backendUrl}/agregar-sucursal`, datosFormulario);
            setMensaje(response.data.message || 'Sucursal registrada exitosamente');
            setMensajeError('');
            setNombre('');
            setDireccion('');
            setTelefono('');
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
                <h2 className="mb-4" style={{ color: 'white' }}>Alta Sucursal</h2>
                {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}
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
                        <label htmlFor="direccion">Direccion</label>
                        <input
                            type="text"
                            className="form-control"
                            id="direccion"
                            placeholder="Ingresa la dirección"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            type="text"
                            className="form-control"
                            id="telefono"
                            placeholder="Ingresa el teléfono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <div className="row">
                            <div className="col">
                                <button type="submit" className="btn btn-primary w-100" >Crear sucursal</button>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                    {mensaje && <div className="alert alert-success mt-2">{mensaje}</div>}
                </form>
            </div>
        </Fragment>
    );
}

export default AltaSucursal;