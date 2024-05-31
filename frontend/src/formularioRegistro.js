import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import './formulario.css';  // Make sure to import the CSS file here


const backendUrl = process.env.REACT_APP_BACK_URL;

const Formulario = () => {
    const [nombre, setNombre] = useState('');
    const [nombreError, setNombreError] = useState('');
    const [apellido, setApellido] = useState('');
    const [apellidoError, setApellidoError] = useState('');
    const [correo, setCorreo] = useState('');
    const [correoError, setCorreoError] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [fechaError, setFechaError] = useState('');
    const [sucursalPreferencia, setSucursalPreferencia] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [contraseniaError, setContraseniaError] = useState('');
    const [sucursales, setSucursales] = useState([]);
    const [sucursalError, setSucursalError] = useState('');
    const navigate = useNavigate();



    // validaciones
    const validateNombre = () => { //ver min de caracteres
        if (!nombre.trim()) {
            setNombreError('Por favor ingrese un nombre');
            return false;
        }
        setNombreError('');
        return true;
    };

    const validateApellido = () => { //ver min de caracteres
        if (!apellido.trim()) {
            setApellidoError('Por favor ingrese un apellido');
            return false;
        }
        setApellidoError('');
        return true;
    }

    const validateCorreo = () => { //ver maximo de caracteres
        if (!correo.trim()) {
            setCorreoError('Por favor ingrese un correo');
            return false;
        }
        if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(correo)) {
            setCorreoError('Por favor ingrese un correo válido');
            return false;
        }
        setCorreoError('');
        return true;
    }

    const validateFechaNacimiento = (fecha) => {
        if (!fecha) {
            setFechaError('Por favor seleccione una fecha de nacimiento');
            return false;
        }
    
        const fechaNacimiento = new Date(fecha);
        const fechaActual = new Date();
        const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

        if (fechaNacimiento > fechaActual) {
            setFechaError('La fecha de nacimiento no puede ser en el futuro');
            return false;
        }
    
        if (edad < 18) {
            setFechaError('Debes tener al menos 18 años para registrarte');
            return false;
        }
    
        
        setFechaError('');
        return true;
    }
    
    const validateContrasena = () => {
        if (!contrasena.trim()) {
            setContraseniaError('Por favor ingrese una contraseña');
            return false;
        }
        /*
        if (contrasena.length < 6 || contrasena.length > 6) {
            setContraseniaError('La contraseña debe tener 6 caracteres');
            return false;
        }
        */
        setContraseniaError('');
        return true;
    }

    const validateSucursal = () => {
        if (!sucursalPreferencia) {
            setSucursalError('Por favor seleccione una sucursal');
            return false;
        }
        setSucursalError('');
        return true;
    }

    const validateForm = () => {

        const isValidNombre = validateNombre();
        const isValidApellido = validateApellido();
        const isValidCorreo = validateCorreo();
        const isValidFecha = validateFechaNacimiento(fechaNacimiento);
        const isValidContrasena = validateContrasena();
        const isValidSucursal = validateSucursal();

        return isValidNombre && isValidApellido && isValidCorreo && isValidFecha && isValidContrasena && isValidSucursal;
    }

    const onButtonClick = async () => {

        if (validateForm()) {
            const datosFormulario = {
                nombre,
                apellido,
                correo,
                fecha_nacimiento: fechaNacimiento,
                sucursal_preferencia: sucursalPreferencia,
                contrasena
            };

            axios.post(`${backendUrl}/registro-cliente`, datosFormulario)
                .then(response => {
                    console.log('Datos registrados exitosamente:', response.data);
                    navigate('/iniciarSesion');
                })
                .catch(error => {
                    console.error('Error al registrar los datos:', error);
                    setCorreoError('El correo ingresado ya existe');
                });
        }
    }

    useEffect(() => {
        axios.get(`${backendUrl}/sucursales`)
            .then(response => {
                setSucursales(response.data.sucursales);
            })
            .catch(error => {
                console.error('Error fetching sucursales:', error);
            });
    }, []);

    return (
        <Fragment>
            <Navbar />
            <h2 className="mb-4" style={{ backgroundColor: '#2c3359', color: '#ffffff' }}>Regístrate</h2>
            <div className="container mt-5">
                <div>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        {nombreError && <div className="text-danger">{nombreError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="apellido" className="form-label">Apellido</label>
                        <input type="text" className="form-control" id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                        {apellidoError && <div className="text-danger">{apellidoError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label">Correo</label>
                        <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                        {correoError && <div className="text-danger">{correoError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                        <input type="date" className="form-control" id="fechaNacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                        {fechaError && <div className="text-danger">{fechaError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="sucursalPreferencia" className="form-label">Sucursal de preferencia</label>
                        <select className="form-select" id="sucursalPreferencia" value={sucursalPreferencia} onChange={(e) => setSucursalPreferencia(e.target.value)} required>
                            <option value="">Seleccione una sucursal</option>
                            {sucursales.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                            ))}
                        </select>
                        {sucursalError && <div className="text-danger">{sucursalError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contrasena" className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                        {contraseniaError && <div className="text-danger">{contraseniaError}</div>}
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary" onClick={onButtonClick} >Registrarse</button>
                    </div>
                </div>
            </div>
            <Footer/>
        </Fragment>
    );
};

export default Formulario;
