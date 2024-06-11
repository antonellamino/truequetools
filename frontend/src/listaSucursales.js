import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
//import NavAdmin from './navAdmin';
import Navbar from './navbar';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ListaSucursales = () => {
    const [sucursales, setsucursales] = useState([]);

    useEffect(() => {
        const fetchsucursales = async () => {
            try {
                const response = await axios.get(`${backendUrl}/sucursales`);
                if (Array.isArray(response.data.sucursales)) {
                    setsucursales(response.data.sucursales);
                } else {
                    console.error('Datos recibidos no son un arreglo:', response.data);
                }
            } catch (error) {
                console.error('Error al obtener sucursales:', error);
            }
        };

        fetchsucursales();
    }, []);

    const ListaTruequesPendientes = (sucursalID) => {
        navigate(`/ventas${sucursalID}`);
    }

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
                    </tr>
                </thead>
                <tbody>
                    {sucursales.map(sucursal => (
                        <tr key={sucursal.id}>
                            <td>{sucursal.nombre}</td>
                            <td>{sucursal.direccion}</td>
                            <td>{sucursal.telefono}</td>
                            <button onClick={ListaTruequesPendientes(sucursal.id)}>Trueques por confirmar</button>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
</Fragment>

    );
}

export default ListaSucursales;
