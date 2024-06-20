import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
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
        try {
            const response = await axios.delete(`${backendUrl}/eliminar-sucursal/${id}`);
            console.log(response.data);
            setSucursales(sucursales.filter(sucursal => sucursal.id !== id));
            alert('Sucursal eliminada exitosamente.');
        } catch (error) {
            console.error('Error al eliminar sucursal:', error);
            alert('Hubo un error al eliminar la sucursal.');
        }
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
                                <th>Telefono</th>
                                {isAdmin && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sucursales.map(sucursal => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
};

export default InfoSucursal;