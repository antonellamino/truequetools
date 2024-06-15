import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Navbar
from "./navbar";

const backendUrl = process.env.REACT_APP_BACK_URL;

const TruequesExitosos = () => {
    const [trueques, setTrueques] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(""); // Estado para la fecha de inicio
    const [fechaFin, setFechaFin] = useState("");       // Estado para la fecha de fin

    const handleFechaInicioChange = (event) => {
        setFechaInicio(event.target.value);
    };

    const handleFechaFinChange = (event) => {
        setFechaFin(event.target.value);
    };

    useEffect(() => {
        const fetchTrueques = async () => {
            try {
                const response = await axios.get(`${backendUrl}/cantidad-trueques`, {
                    params: {
                        fechaInicio: fechaInicio,
                        fechaFin: fechaFin
                    }
                });
                setTrueques(response.data); 
            } catch (error) {
                console.error("Error al obtener trueques:", error);
            }
        };

        if (fechaInicio !== "" && fechaFin !== "") {
            fetchTrueques();
        }
    }, [fechaInicio, fechaFin]); 

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-white">Trueques exitosos</h2>
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
                        </form>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Sucursal</th>
                                        <th>Cantidad</th>
                                        {fechaInicio && (<th>fechas: {fechaInicio} hasta {fechaFin}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {trueques.map(trueque => (
                                        <tr key={trueque.id}>
                                            <td>{trueque.nombre_sucursal}</td>
                                            <td>{trueque.cantidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default TruequesExitosos;    