import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import Swal from 'sweetalert2';
import './formulario.css';

const backendUrl = process.env.REACT_APP_BACK_URL;

const EditarPerfil = () => {
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
    const clienteId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Validaciones
    const validateNombre = () => {
        if (!nombre.trim()) {
            setNombreError('Por favor ingrese un nombre');
            return false;
        }
        setNombreError('');
        return true;
    };

    const validateApellido = () => {
        if (!apellido.trim()) {
            setApellidoError('Por favor ingrese un apellido');
            return false;
        }
        setApellidoError('');
        return true;
    };

    const validateCorreo = () => {
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
    };

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
    };

    const validateContrasena = () => {
        if (!contrasena.trim()) {
            setContraseniaError('Por favor ingrese una contraseña');
            return false;
        }
        setContraseniaError('');
        return true;
    };

    const validateSucursal = () => {
        if (!sucursalPreferencia) {
            setSucursalError('Por favor seleccione una sucursal');
            return false;
        }
        setSucursalError('');
        return true;
    };

    const validateForm = () => {
        const isValidNombre = validateNombre();
        const isValidApellido = validateApellido();
        const isValidCorreo = validateCorreo();
        const isValidFecha = validateFechaNacimiento(fechaNacimiento);
        const isValidContrasena = validateContrasena();
        const isValidSucursal = validateSucursal();

        return isValidNombre && isValidApellido && isValidCorreo && isValidFecha && isValidContrasena && isValidSucursal;
    };

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

            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Se guardarán los cambios realizados.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, guardar cambios',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await axios.put(`${backendUrl}/editar-cliente`, {
                            clienteId: clienteId,
                            datosFormulario: datosFormulario
                        });
                        console.log('Datos actualizados exitosamente:', response.data);
                        Swal.fire(
                            'Actualizado!',
                            'Tu perfil ha sido actualizado exitosamente.',
                            'success'
                        ).then(() => {
                            navigate('/');
                        });
                    } catch (error) {
                        console.error('Error al actualizar los datos:', error);
                        Swal.fire(
                            'Error!',
                            'Hubo un error al actualizar el perfil.',
                            'error'
                        );
                    }
                }
            });
        }
    };

    useEffect(() => {
        const fetchDatosCliente = async () => {
            try {
                const response = await axios.get(`${backendUrl}/obtener-cliente/${clienteId}`);
                const { nombre, apellido, correo, fecha_nacimiento, sucursal_preferencia, contrasena } = response.data.cliente;
                setNombre(nombre);
                setApellido(apellido);
                setCorreo(correo);
                setFechaNacimiento(new Date(fecha_nacimiento).toISOString().split('T')[0]);
                setSucursalPreferencia(sucursal_preferencia);
                setContrasena(contrasena);
            } catch (error) {
                console.error('Error al obtener los datos del cliente:', error);
            }
        };

        const fetchSucursales = async () => {
            try {
                const response = await axios.get(`${backendUrl}/sucursales`);
                setSucursales(response.data.sucursales);
            } catch (error) {
                console.error('Error fetching sucursales:', error);
            }
        };

        fetchDatosCliente();
        fetchSucursales();
    }, [clienteId]);

    return (
        <Fragment>
            <Navbar />
            <h2 className="mb-4" style={{ backgroundColor: '#2c3359', color: '#ffffff', padding: '10px' }}>Editar Perfil</h2>
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
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="contrasena"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                            <span
                                className="input-group-text"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                            </span>
                        </div>
                        {contraseniaError && <div className="text-danger">{contraseniaError}</div>}
                    </div>

                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary" onClick={onButtonClick}>Guardar Cambios</button>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default EditarPerfil;
