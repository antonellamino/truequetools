import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACK_URL; // URL del backend obtenida de las variables de entorno

const DetalleTrueque = () => {
    const [detalleTrueque, setDetalleTrueque] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        console.log(id);
        const fetchDetalleTrueque = async () => {
            try {
                const response = await axios.get(`${backendUrl}/detalle_trueque`, { params: { id: id }});
                console.log(response.data);
                setDetalleTrueque(response.data);
            } catch (error) {
                console.error("Error al obtener el detalle del trueque:", error);
            }
        };

        if (id) {
            fetchDetalleTrueque();
        }
    }, [id]);

    return (
        <div className="container mt-4">
            <h3>Detalle del Trueque</h3>
            {detalleTrueque.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Nombre Venta</th>
                                <th>Precio</th>
                                <th>Email Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalleTrueque.map((venta, index) => (
                                <tr key={index}>
                                    <td>{venta.articulo}</td>
                                    <td>{venta.valor}</td>
                                    <td>{venta.email_usuario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="alert alert-info mt-3" role="alert">
                    No se encontraron ventas para este trueque.
                </div>
            )}
        </div>
    );
};

export default DetalleTrueque;