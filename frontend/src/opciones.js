import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './opciones.css';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Opciones = () => {
    const { productoId, usuarioId, categoriaId } = useParams();
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        console.log(productoId, usuarioId, categoriaId);

        axios.get(`${backendUrl}/productos-truequear`, { params: { productoId, usuarioId, categoriaId } })
        .then(response => {
            console.log('Datos obtenidos correctamente:', response.data);
            const productosArray = response.data.productos; // Obtener el array de productos de la respuesta
            setProductos(productosArray); // Asignar el array de productos al estado
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
    }, [productoId, usuarioId, categoriaId]);

    const seleccionar = () => {
        console.log("a");
    };

    return (
        <div className="trueque-options-container">
            <h1>Opciones de Trueque</h1>
            {productos.map(producto => (
                <div key={producto.id} className="trueque-option">
                    <img 
                        src={producto.imagen_1 ? `data:image/jpeg;base64,${producto.imagen_1}` : '/logo_2.svg'}
                        alt="Imagen del producto"
                    />
                    <h5>{producto.nombre}</h5>
                    <button className="btn btn-primary" onClick={() => seleccionar(producto)}>Seleccionar</button>
                </div>
            ))}
        </div>
    );
};
export default Opciones;