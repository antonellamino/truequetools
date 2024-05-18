import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import CardProducto from './cardProducto';
import { useAuth  } from './AuthContext';
import Footer from './footer';

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
    }, [isAuthenticated, userId]);

    return(
        <Fragment>
            <Navbar />
            <h2 style={{ backgroundColor: '#2c3359', color: '#ffffff'}}>
                Mis productos
            </h2>
            <div className="productos-grid">
                {productos.length > 0 ? (
                    productos.map(producto => (
                        <CardProducto
                            key={producto.id}
                            imagenSrc={producto.imagen ? `data:image/png;base64,${producto.imagen}` : null}
                            nombreUsuario={producto.usuario_id}
                            titulo={producto.nombre}
                            descripcion={producto.descripcion}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', width: '100%', marginTop: '20px' }}>
                        <h3>No hay productos publicados.</h3>
                    </div>
                )}
            </div>
            
            <div style={{ marginBottom: '500px' }}> </div>
            <Footer/>
        </Fragment>
    )
}
export default ClienteDashboard;
