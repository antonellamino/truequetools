import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ListaSucursales = () => {
    const [sucursales, setSucursales] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const response = await axios.get(`${backendUrl}/full-sucursales`);
                setSucursales(response.data.sucursales);
            } catch (error) {
                console.error('Error al obtener sucursales:', error);
            }
        };

        fetchSucursales();
    }, []);

    const listaTruequesPendientes = (sucursalID) => {
        navigate(`/confirmarTrueque/${sucursalID}`);
    };

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-white">Trueques pendientes por sucursal</h2>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Nombre</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sucursales.length > 0 ? (
                                sucursales.map(sucursal => (
                                    <tr key={sucursal.id}>
                                        <td>{sucursal.nombre}</td>
                                        <td>{sucursal.direccion}</td>
                                        <td>{sucursal.telefono}</td>
                                        <td>
                                            <button onClick={() => listaTruequesPendientes(sucursal.id)}>
                                                Trueques por confirmar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No hay sucursales disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
};

export default ListaSucursales;