import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


// navigate(`/opciones/${data}`); 
const Opciones = () => {
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const usuarioId = searchParams.get('usuarioId');
    const categoriaId = searchParams.get('categoriaId');

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        //si tengo un usuario y una categoria que buscar
        console.log("aaaaaaaaa")
        console.log(usuarioId)
        console.log(categoriaId)
        if (usuarioId && categoriaId) {
            //consulta al back para traerme los productos
            axios.get(`http://localhost:5000/productos-truequear`, {
                params: { usuarioId, categoriaId }
            })
            .then(response => {
                setProductos(response.data.productos);
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
        }
    }, [usuarioId, categoriaId]);

    /*
    useEffect(() => {
        axios.get(`${backendUrl}/productos`)
            .then(response => {
                setProductos(response.data.productos);
                const userIds = response.data.productos.map(producto => producto.usuario_id);
                obtenerUsuarios(userIds);
            })
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });
    } , [] );
    */

    return (
        <div>
            <h1>Opciones de Trueque para la Categoría: {categoriaId}</h1>
            {productos.map((producto, index) => (
                <div key={index}>
                    <h2>{producto.nombre}</h2>
                    <img src={`data:image/jpeg;base64,${producto.imagen_1}`} alt={`Imagen de ${producto.nombre}`} />
                    {/* Añadir más detalles de cada producto según necesites */}
                </div>
            ))}
        </div>
    );
};

export default Opciones;