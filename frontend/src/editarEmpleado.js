import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const backendUrl = process.env.REACT_APP_BACK_URL;

const EditarEmpleado = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nombre_usuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const { empleadoId } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [originalNombreUsuario, setOriginalNombreUsuario] = useState('');

    useEffect(() => {
        const fetchEmpleado = async () => {
            try {
                const response = await axios.get(`${backendUrl}/obtener-empleado/${empleadoId}`);
                const empleado = response.data.empleado;
                setNombre(empleado.nombre);
                setApellido(empleado.apellido);
                setNombreUsuario(empleado.nombre_usuario);
                setOriginalNombreUsuario(empleado.nombre_usuario);
                setContrasena(empleado.contrasena);
            } catch (error) {
                console.error('Error al obtener el empleado:', error);
            }
        };

        fetchEmpleado();
    }, [empleadoId]);

    const validateForm = async () => {
        let newErrors = {};
        let isValid = true;

        if (!nombre.trim()) {
            newErrors.nombre = 'Por favor ingrese un nombre';
            isValid = false;
        }

        if (!apellido.trim()) {
            newErrors.apellido = 'Por favor ingrese un apellido';
            isValid = false;
        }

        if (!nombre_usuario.trim()) {
            newErrors.nombre_usuario = 'Por favor ingrese un nombre de usuario';
            isValid = false;
        } else if (nombre_usuario !== originalNombreUsuario) {
            try {
                const response = await axios.get(`${backendUrl}/existe-empleado/${nombre_usuario}`);//ME TIRA ERROR PERO ANDA
                console.log('Respuesta de Axios:', response);
                if (response.data.empleado) {
                    newErrors.nombre_usuario = 'El nombre de usuario ya está en uso';
                    isValid = false;
                } else {
                    console.log('todo ok');
                }
            } catch (error) {
                console.error('Error al verificar el nombre de usuario:', error);
            }
        }

        if (!contrasena.trim()) {
            newErrors.contrasena = 'Por favor ingrese una contraseña';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateForm();

        if (!isValid) {
            return;
        }

        const datosFormulario = {
            nombre: nombre,
            apellido: apellido,
            nombre_usuario: nombre_usuario,
            contrasena: contrasena
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
                    await axios.put(`${backendUrl}/editar-empleado`, {
                        id: empleadoId,
                        datosFormulario: datosFormulario
                    });

                    Swal.fire(
                        'Guardado!',
                        'Los cambios han sido guardados exitosamente.',
                        'success'
                    ).then(() => {
                        navigate('/listaEmpleados');
                    });

                } catch (error) {
                    console.error('Error al actualizar los datos, por favor intente nuevamente', error);
                    Swal.fire(
                        'Error!',
                        'Error al actualizar los datos, por favor intente nuevamente.',
                        'error'
                    );
                }
            }
        });
    };

    const handleCancel = () => {
        navigate('/listaEmpleados');
    };

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4" style={{ color: 'white' }}>Editar empleado</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            placeholder="Ingresa el nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            
                        />
                        {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido" className="font-weight-bold">Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            id="apellido"
                            placeholder="Ingresa el apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            
                        />
                        {errors.apellido && <small className="text-danger">{errors.apellido}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre_usuario" className="font-weight-bold">Nombre de usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre_usuario"
                            placeholder="Ingresa el nombre de usuario"
                            value={nombre_usuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            
                        />
                        {errors.nombre_usuario && <small className="text-danger">{errors.nombre_usuario}</small>}
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
                                
                            />
                            <span
                                className="input-group-text"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                            </span>
                        </div>
                        {errors.contrasena && <small className="text-danger">{errors.contrasena}</small>}
                    </div>
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

export default EditarEmpleado;
