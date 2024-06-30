import React, { useState, Fragment } from "react";
import axios from "axios";
import Navbar from "./Navbar"; // Ajusta la ruta de importación según sea necesario

const backendUrl = process.env.REACT_APP_BACK_URL; // URL del backend obtenida de las variables de entorno

const PromedioVentas = () => {
    const [trueques, setTrueques] = useState([]); // Estado para almacenar los trueques obtenidos
    const [fechaInicio, setFechaInicio] = useState(""); // Estado para la fecha de inicio
    const [fechaFin, setFechaFin] = useState(""); // Estado para la fecha de fin
    const [mostrarMensaje, setMostrarMensaje] = useState(false); // Estado para mostrar el mensaje de falta de trueques
    const [botonHabilitado, setBotonHabilitado] = useState(false); // Estado para habilitar el botón de búsqueda

    // Manejador para cambios en la fecha de inicio
    const handleFechaInicioChange = (event) => {
        setFechaInicio(event.target.value);
        // Si fechaFin está definida y la nueva fecha de inicio es posterior a fechaFin, actualizar fechaFin
        if (fechaFin && new Date(event.target.value) > new Date(fechaFin)) {
            setFechaFin(event.target.value);
        }
        // Habilitar el botón si ambas fechas están definidas
        setBotonHabilitado(event.target.value !== "" && fechaFin !== "");
    };

    // Manejador para cambios en la fecha de fin
    const handleFechaFinChange = (event) => {
        setFechaFin(event.target.value);
        // Habilitar el botón si ambas fechas están definidas
        setBotonHabilitado(fechaInicio !== "" && event.target.value !== "");
    };
    
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return new Date(dateString).toLocaleDateString("es-ES", options);
    };


    // Función para obtener los trueques desde el backend
    const fetchTrueques = async () => {
        try {
            const response = await axios.get(`${backendUrl}/promedio-ventas`, {
                params: {
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin, // Usa fechaFinActual en lugar de fechaFin
                },
            });
            console.log(response.data);
            setTrueques(response.data);
            setMostrarMensaje(response.data.length === 0);
        } catch (error) {
            console.error("Error al obtener trueques:", error); // Manejar errores de la petición
        }
    };

    return (
        <Fragment>
            <Navbar /> {/* Componente de navegación */}
            <div className="container mt-5">
                <h2 className="text-white">Estadisticas ventas</h2>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <form>
                            <div className="form-group">
                                <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                                {/* Input para seleccionar la fecha de inicio */}
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fechaInicio"
                                    value={fechaInicio}
                                    onChange={handleFechaInicioChange}
                                />
                            </div>
                            {/* Mostrar el input de fecha fin solo si fechaInicio está definido */}
                            {fechaInicio && (
                                <div className="form-group">
                                    <label htmlFor="fechaFin">Fecha de Fin:</label>
                                    {/* Input para seleccionar la fecha de fin */}
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaFin"
                                        value={fechaFin}
                                        onChange={handleFechaFinChange}
                                        min={fechaInicio} // Establecer fecha mínima como fechaInicio
                                    />
                                </div>
                            )}
                            {/* Botón para ejecutar la búsqueda de trueques */}
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={fetchTrueques} // Llamar a fetchTrueques al hacer clic
                                disabled={!botonHabilitado} // Deshabilitar el botón si no están definidas ambas fechas
                            >
                                Buscar
                            </button>
                        </form>
                        {/* Mostrar tabla si hay trueques encontrados */}
                        {trueques.length > 0 && !mostrarMensaje && (
                            <div className="table-responsive mt-4">
                                <table className="table table-striped">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>ID Trueque</th>
                                            <th>Fecha</th>
                                            <th>Total Ventas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Iterar sobre los trueques y mostrar en la tabla */}
                                        {trueques.map((trueque, index) => (
                                            <tr key={index}>
                                                <td>{trueque.id_trueque}</td>
                                                <td>{formatDate(trueque.fecha_trueque)}</td>
                                                <td>{trueque.total_valor_ventas}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {/* Mostrar mensaje de alerta si no se encontraron trueques */}
                        {mostrarMensaje && (
                            <div className="alert alert-info mt-3" role="alert">
                                No se encontraron trueques en el rango de fechas especificado.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default PromedioVentas;