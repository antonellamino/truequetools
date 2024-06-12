import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './opciones.css';
import { Fragment } from 'react';
import Navbar from './navbar';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Opciones = () => {
    const { sucursalId, productoId, usuarioId, categoriaId, propietarioId } = useParams();
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState('');

    console.log(sucursalId);

    useEffect(() => {
        
        console.log("categoria: ",categoriaId);

        axios.get(`${backendUrl}/productos_truequear`, { params: { productoId, usuarioId, categoriaId } })
        .then(response => {
            console.log('Datos obtenidos correctamente:', response.data);
            const productosArray = response.data.productos; // Obtener el array de productos de la respuesta
            setProductos(productosArray); // Asignar el array de productos al estado
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
    }, [productoId, usuarioId, categoriaId]);
    

    const seleccionar = (producto) => {
        setMensaje('Trueque solicitado, esperando confirmación de horario');

        const notificacion = {
            id_usuario : propietarioId,
            mensaje : `Nuevo interés en el producto: ${productoId}`,
            leido : false,
            link : `/truequesPendientes/${propietarioId}`
        }

        axios.post(`${backendUrl}/enviar-notificacion`, notificacion)
        .then(response => {
            console.log('Notificación enviada correctamente');
        })
        .catch(error => {
            console.error('Error al enviar la notificación:', error);
        });
        console.log(sucursalId);
        const datosTrueque = {
            id_propietario : propietarioId,
            id_ofertante : usuarioId,
            id_producto_propietario : productoId,
            id_producto_ofertante : producto.id,
            id_sucursal : sucursalId
        };
    
        axios.post(`${backendUrl}/guardar-trueque`, datosTrueque)
        .then(response => {
            console.log('Trueque registrado correctamente');
            // Actualizar el estado para marcar el producto como seleccionado
            setProductos(prevProductos => prevProductos.map(p => {
                if (p.id === producto.id) {
                    return { ...p, seleccionado: true };
                }
                return p;
            }));
        })
        .catch(error => {
            console.error('Error al guardar el trueque:', error);
        });
    };

    return (
        <Fragment>
            <Navbar />
            <div className="trueque-options-container">
                <h1>Opciones de Trueque</h1>
                {productos.length === 0 ? (
                    <p>No tienes productos para intercambiar</p>
                ) : (
                    productos.map(producto => (
                        <div key={producto.id} className="trueque-option">
                            <img 
                                src={producto.imagen_1 ? `data:image/jpeg;base64,${producto.imagen_1}` : '/logo_2.svg'}
                                alt="Imagen del producto"
                            />
                            <h5>{producto.nombre}</h5>
                            {producto.seleccionado ? (
                                <p>{mensaje}</p>
                            ) : (
                                <button className="boton_seleccionar" onClick={() => seleccionar(producto)}>Seleccionar</button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </Fragment>
    );
};

export default Opciones;