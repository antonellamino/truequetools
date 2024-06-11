import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ConfirmarTrueque = () => {
    const { id } = useParams(); // Corrección aquí para desestructurar el id de useParams
    const [trueques, setTrueques] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrueques = async () => {
            try {
                const response = await axios.get(`${backendUrl}/trueques_Sucursal`, { params: { idSucursal: id } });
                if (Array.isArray(response.data.trueques)) {
                    setTrueques(response.data.trueques);
                } else {
                    console.error('Datos recibidos no son un arreglo:', response.data);
                }
            } catch (error) {
                console.error('Error al obtener los trueques de la sucursal:', error);
                setError('Error al obtener los trueques de la sucursal');
            }
        };

        fetchTrueques();
    }, [id]);

    const confirmar = async (idTrueque) => {
        try {
            const response = await axios.post(`${backendUrl}/confirmar_trueque`, { idTrueque });
            console.log('Trueque confirmado:', response.data);

            // Actualiza el estado para marcar el trueque como confirmado
            setTrueques(prevTrueques => 
                prevTrueques.map(trueque => 
                    trueque.id === idTrueque ? { ...trueque, confirmado: true } : trueque
                )
            );
        } catch (error) {
            console.error('Error al confirmar el trueque:', error);
            setError('Error al confirmar el trueque');
        }
    };

    return (
        <div>
            <h2>Trueques</h2>
            {error && <p>{error}</p>}
            {trueques.length > 0 ? (
                <ul>
                    {trueques.map((trueque, index) => (
                        <li key={index}>
                            {trueque.nombre}
                            {!trueque.confirmado && (
                                <button onClick={() => confirmar(trueque.id)}>Confirmar</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay trueques disponibles.</p>
            )}
        </div>
    );
};

export default ConfirmarTrueque;