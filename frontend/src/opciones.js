import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './opciones.css';
import { Fragment } from 'react';
import Navbar from './navbar';

const backendUrl = process.env.REACT_APP_BACK_URL;


// navigate(`/opciones/${data}`); 
const Opciones = () => {
    //el productoId es del propietario, el usuario Id soy yo,
    const { productoId, usuarioId, categoriaId, propietarioId } = useParams();
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        
        console.log(productoId, usuarioId, categoriaId, propietarioId);

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


    const seleccionar = (producto) => {
        
        const notificacion = {
            //aca le envio mi usuario, no el de propietario
            id_usuario : propietarioId,
            mensaje : `Nuevo interés en el producto: ${productoId}`,
            leido : false,
            link : `/truequesPendientes`
        }

        axios.post(`${backendUrl}/enviar-notificacion`, notificacion)
        .then(response => {
            console.log('Notificación enviada correctamente');
        })
        .catch(error => {
            console.error('Error al enviar la notificación:', error);
        });

        //tengo que hacer un post de mi id, mi producto, el id del propietario, y el id del producto del propietario
        const datosTrueque = {
            id_propietario : propietarioId,
            id_ofertante : usuarioId,
            id_producto_propietario : productoId,
            //el id del producto seleccionado es el producto del usuario ofertante
            id_producto_ofertante : producto.id,
            fecha : new Date().toISOString().slice(0, 10) // Formato AAAA-MM-DD
        };
    
        axios.post(`${backendUrl}/guardar-trueque`, datosTrueque)
        .then(response => {
            console.log('Trueque registrado correctamente');
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
        </Fragment>
    );
};
export default Opciones;