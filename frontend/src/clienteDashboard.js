import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import CardProducto from './cardProducto';
import { useAuth  } from './AuthContext';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ClienteDashboard = () => {
    const { isAuthenticated, userId } = useAuth ();
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        if (isAuthenticated && userId) {
            axios.get(`${backendUrl}/productos-usuario`, {
                params: { usuarioId: userId }
            })
            .then(response => {
                setProductos(response.data.productos);
            })
            .catch(error => {
                console.error('Error al obtener productos del usuario:', error);
            });
        }
    }, [isAuthenticated, usuarioId]);

    return(
        <Fragment>
            <Navbar />
            <h2 style={{ backgroundColor: '#2c3359', color: '#ffffff'}}>
                Mis productos
            </h2>
            <div className="productos-grid">
                {productos.map(producto => (
                    <CardProducto
                        key={producto.id}
                        imagenSrc={producto.imagen ? `data:image/png;base64,${producto.imagen}` : null}
                        nombreUsuario={producto.usuario_id}
                        titulo={producto.nombre}
                        descripcion={producto.descripcion}
                    />
                ))}
            </div>
        </Fragment>
    )
}

export default ClienteDashboard;
