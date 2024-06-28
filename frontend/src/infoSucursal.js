import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const InfoSucursal = () => {
    const [sucursales, setSucursales] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const response = await axios.get(`${backendUrl}/sucursales`);
                setSucursales(response.data.sucursales);
            } catch (error) {
                console.error('Error al obtener sucursales:', error);
            }
        };

        fetchSucursales();
    }, []);

    const isAdmin = localStorage.getItem('rol') === '1';

    const handleEditar = (id) => {
        navigate(`/editarSucursal/${id}`);
    };

    const handleEliminar = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    console.log('falta implementacion'); //falta implementar, despues lo sigo
                    const response = await axios.post(`${backendUrl}/eliminar-sucursal`, { id : id });
                    console.log(response.data);

                    setSucursales(sucursales.filter(sucursal => sucursal.id !== id));
                    Swal.fire(
                        'Eliminado!',
                        'La sucursal ha sido eliminada.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error al eliminar la sucursal:', error);
                    Swal.fire(
                        'Error!',
                        error.response && error.response.data ? error.response.data.error : 'Hubo un error al eliminar la sucursal.',
                        'error'
                    );
                }
            }
        });
    };

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-white">Sucursales</h2>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Nombre</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                {isAdmin && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sucursales.length > 0 ? (
                                sucursales.map(sucursal => (
                                    <tr key={sucursal.id}>
                                        <td>{sucursal.nombre}</td>
                                        <td>{sucursal.direccion}</td>
                                        <td>{sucursal.telefono}</td>
                                        {isAdmin && (
                                            <td>
                                                <button className="btn btn-info mr-2" onClick={() => handleEditar(sucursal.id)}>Editar</button>
                                                <button className="btn btn-danger" onClick={() => handleEliminar(sucursal.id)}>Eliminar</button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isAdmin ? "4" : "3"} className="text-center">No hay sucursales registradas</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
};

export default InfoSucursal;