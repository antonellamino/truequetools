import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ListaEmpleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const response = await axios.get(`${backendUrl}/empleados`);
                if (Array.isArray(response.data.usuarios)) {
                    setEmpleados(response.data.usuarios);
                } else {
                    console.error('Datos recibidos no son un arreglo:', response.data);
                }
            } catch (error) {
                console.error('Error al obtener empleados:', error);
            }
        };

        fetchEmpleados();
    }, []);

    const eliminarEmpleado = async (empleadoId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.post(`${backendUrl}/eliminar-empleado`, { id: empleadoId });
                    console.log(res.data);

                    setEmpleados(empleados.filter(empleado => empleado.id !== empleadoId));
                    Swal.fire(
                        'Eliminado!',
                        'El empleado ha sido eliminado.',
                        'success'
                    );
                } catch (err) {
                    console.error(err);
                    Swal.fire(
                        'Error!',
                        'Error al intentar eliminar el empleado, por favor inténtalo nuevamente.',
                        'error'
                    );
                }
            }
        });
    };

    const editarEmpleado = (empleadoId) => {
        navigate(`/editarEmpleado/${empleadoId}`);
    };

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-white">Empleados</h2>
                {empleados.length === 0 ? (
                    <p>No se registran empleados.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Nombre de Usuario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {empleados.map(empleado => (
                                    <tr key={empleado.id}>
                                        <td>{empleado.nombre}</td>
                                        <td>{empleado.apellido}</td>
                                        <td>{empleado.nombre_usuario}</td>
                                        <td>
                                            <button
                                                className="btn btn-info mr-2"
                                                onClick={() => editarEmpleado(empleado.id)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => eliminarEmpleado(empleado.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default ListaEmpleados;
