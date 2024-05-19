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
            <div className='home-principal'>
            <div className="row">
                {productos.map(producto => (
                    <div key={producto.id} className="col-md-4 mb-3 d-flex justify-content-center">
                        <CardProducto
                            imagenSrc={producto.imagen ? 'data:image/jpeg;base64,${producto.imagen}' : './logo_2.svg'}
                            nombreUsuario={producto.usuario_id}
                            titulo={producto.nombre}
                            descripcion={producto.descripcion}
                        />
                    </div>
                ))}
            </div>
            </div>
            <div style={{ marginBottom: '500px' }}></div> {/* espacio antes del footer */}
            <Footer />
        </Fragment>
    )
}
export default ClienteDashboard;
