import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const backendUrl = process.env.REACT_APP_BACK_URL;

const Formulario = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [sucursalPreferencia, setSucursalPreferencia] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [sucursales, setSucursales] = useState([]);


    //se traen las sucursales desde la bd
    useEffect(() => {
        axios.get(`${backendUrl}/sucursales`)
            .then(response => {
                setSucursales(response.data.sucursales);
            })
            .catch(error => {
                console.error('Error fetching sucursales:', error);
            });
    }, []);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const datosFormulario = {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            fecha_nacimiento: fechaNacimiento,
            sucursal_preferencia: sucursalPreferencia,
            contrasena: contrasena
        };
        
    
        axios.post(`${backendUrl}/registro`, datosFormulario)
            .then(response => {
                console.log('Datos registrados exitosamente:', response.data);
                //setear mensaje o redireccion de exito
                navigate('/');
            })
            .catch(error => {
                console.error('Error al registrar los datos:', error);
                // seteo de mje de error
            });
    };
    

    return (
        <Fragment>
            <Navbar />
                <h2 className="mb-4" style={{ backgroundColor: '#2c3359', color: '#ffffff'}}>Registrate</h2>
            <div className="container mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="apellido" className="form-label">Apellido</label>
                        <input type="text" className="form-control" id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label">Correo</label>
                        <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                        <input type="date" className="form-control" id="fechaNacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="sucursalPreferencia" className="form-label">Sucursal de preferencia</label>
                        <select className="form-select" id="sucursalPreferencia" value={sucursalPreferencia} onChange={(e) => setSucursalPreferencia(e.target.value)} required>
                            <option value="">Seleccione una sucursal</option>
                            {sucursales.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contrasena" className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">Registrarse</button>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default Formulario;
