import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

const backendUrl = process.env.REACT_APP_BACK_URL; 

const TruequesPendientes = () => {
    const { usuarioId } = useParams(); // Obtener el ID del usuario desde la URL
    const [trueques, setTrueques] = useState([]);
    const [error, setError] = useState(null);
    
    
    useEffect(() => {
        console.log("usuarioId:", usuarioId);  // Esto te mostrará el valor actual de usuarioId
   
        if( usuarioId ){
            obtenerTrueques(usuarioId);
            // Aquí puedes cargar datos basados en el `usuarioId` si es necesario
        }
        else{
            console.log("userId no esta definido");
        }
    }, [usuarioId]);

    const obtenerTrueques = (usuarioId) => {
        axios.get(`${backendUrl}/mis_trueques`, { params: { usuarioId } })
            .then(response => {
                setTrueques(response.data.trueques);
            })
            .catch(error => {
                console.error('Error al obtener los trueques pendientes:', error); //404
                setError('Error al obtener los trueques pendientes');
            });
    }



    if (!trueques.length && !error) return <div>Cargando trueques...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Trueques Pendientes</h1>
            {trueques.length > 0 ? (
                <ul>
                    {trueques.map((trueque) => (
                        <li key={trueque.id}>
                            Trueque entre {trueque.propietario.nombre} y {trueque.ofertante.nombre}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes trueques pendientes.</p>
            )}
        </div>
    );
};

export default TruequesPendientes;




