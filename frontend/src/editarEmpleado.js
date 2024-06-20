import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const backendUrl = process.env.REACT_APP_BACK_URL;

const EditarEmpleado = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nombre_usuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const { empleadoId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmpleado = async () => {
            try {
                console.log(empleadoId);
                const response = await axios.get(`${backendUrl}/obtener-empleado/${empleadoId}`);
                const empleado = response.data.empleado;
                setNombre(empleado.nombre);
                setApellido(empleado.apellido);
                setNombreUsuario(empleado.nombre_usuario);
                setContrasena(empleado.contrasena);
            } catch (error) {
                console.error('Error al obtener el empleado:', error);
            }
        };

        fetchEmpleado();
    }, [empleadoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    const response = await axios.put(`${backendUrl}/editar-empleado`, {
                        empleadoId: empleadoId,
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
                    console.error('Error al editar los datos:', error);
                    if (error.response && error.response.data && error.response.data.error) {
                    }
    
                    Swal.fire(
                        'Error!',
                        'Hubo un error al guardar los cambios.',
                        'error'
                    );
                }
            }
        });
    };;


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
                            required
                        />
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
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre_usuario" className="font-weight-bold">Nombre de Usuario</label>
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
                        <label htmlFor="contrasena" className="font-weight-bold">Contraseña</label>
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
                    <button type="submit" className="btn btn-primary">Guardar cambios</button>
                </form>
            </div>
        </Fragment>
    );
};

export default EditarEmpleado;
