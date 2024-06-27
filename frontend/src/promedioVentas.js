import React, { useState, Fragment } from "react";
import axios from "axios";
import Navbar from "./navbar";

const backendUrl = process.env.REACT_APP_BACK_URL;

const PromedioVentas = () => {
    const [trueques, setTrueques] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(""); // Estado para la fecha de inicio
    const [fechaFin, setFechaFin] = useState("");       // Estado para la fecha de fin

    const handleFechaInicioChange = (event) => {
        setFechaInicio(event.target.value);
    };

    const handleFechaFinChange = (event) => {
        setFechaFin(event.target.value);
    };

    const fetchTrueques = async () => {
        let fechaFinActual = fechaFin;
        if (!fechaFin) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
            const dd = String(today.getDate()).padStart(2, '0');
            fechaFinActual = `${yyyy}-${mm}-${dd}`;
            setFechaFin(fechaFinActual);
        }
        try {
            const response = await axios.get(`${backendUrl}/promedio-ventas`, {
                params: {
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFinActual // Usa fechaFinActual en lugar de fechaFin
                }
            });
            setTrueques(response.data); 
        } catch (error) {
            console.error("Error al obtener trueques:", error);
        }
    };

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-white">Promedio ventas</h2>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <form>
                            <div className="form-group">
                                <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                                <input type="date" className="form-control" id="fechaInicio" value={fechaInicio} onChange={handleFechaInicioChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fechaFin">Fecha de Fin:</label>
                                <input type="date" className="form-control" id="fechaFin" value={fechaFin} onChange={handleFechaFinChange} />
                            </div>
                            <button type="button" className="btn btn-primary" onClick={fetchTrueques}>Buscar</button>
                        </form>
                        {trueques.length === 0 && (
                            <div className="alert alert-info mt-3" role="alert">
                                No se encontraron trueques en el rango de fechas especificado.
                            </div>
                        )}
                        {trueques.map((trueque, index) => (
                            <div className="card mt-3" key={index}>
                                <div className="card-body">
                                    <h5 className="card-title">Trueque: {trueque.nombre_trueque}</h5>
                                    <p className="card-text">Sucursal: {trueque.nombre_sucursal}</p>
                                    {trueque.ventas.length === 0 ? (
                                        <p className="card-text">No hay ventas asociadas.</p>
                                    ) : (
                                        <Fragment>
                                            <h6>Ventas asociadas:</h6>
                                            {trueque.ventas.map((venta, idx) => (
                                                <div key={idx}>
                                                    <p>Propietario: {venta.propietario}</p>
                                                    <p>Información de la venta: {venta.informacion}</p>
                                                </div>
                                            ))}
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default PromedioVentas;