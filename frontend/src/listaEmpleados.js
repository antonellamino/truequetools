import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ListaEmpleados = () => {
    const [empleados, setEmpleados] = useState([]);

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

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-white">Empleados</h2>
                {empleados.length === 0 ? (
                    <p>No se registran empleados.</p>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Nombre de Usuario</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {empleados.map(empleado => (
                                            <tr key={empleado.id}>
                                                <td>{empleado.nombre}</td>
                                                <td>{empleado.apellido}</td>
                                                <td>{empleado.nombre_usuario}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default ListaEmpleados;
