import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import CardProducto from './cardProducto';
import { useAuth } from './AuthContext';
import Footer from './Footer';
import  { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ClienteDashboard = () => {
    const { isAuthenticated, userId } = useAuth();
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();
    const rol = localStorage.getItem('rol');


    const obtenerUsuarios = (userIds) => {
        axios.post(`${backendUrl}/usuarios`, { userIds })
            .then(response => {
                setUsuarios(response.data.usuarios);
            })
            .catch(error => {
                console.error('Error al obtener la informacion de los usuarios:', error);
            });
    };

    const obtenerCorreoUsuario = (usuarioId) => {
        const usuarioEncontrado = Object.values(usuarios).find(usuario => usuario.id === usuarioId);
        return usuarioEncontrado ? usuarioEncontrado.correo : '';
    };

    useEffect(() => {
        console.log(!isAuthenticated, rol);
        if(!isAuthenticated || rol !== '3'){
            navigate('/403');
        }
        
        if (isAuthenticated && userId) {
            axios.get(`${backendUrl}/productos-usuario`, {
                params: { usuarioId: userId }
            })
                .then(response => {
                    const productosValidos = response.data.productos.filter(producto => !producto.estado);
                    setProductos(productosValidos);
                    console.log(response.data.productos);
                })
                .catch(error => {
                    console.error('Error al obtener productos del usuario:', error);
                });
        }
    }, [isAuthenticated, userId]);


    return (
        <Fragment>
            <Navbar />
            <h2 style={{ backgroundColor: '#2c3359', color: '#ffffff' }}>
                Mis productos
            </h2>
            <div className='home-principal'>
                {productos.length > 0 ? (
                    <div className="row">
                        {productos.map(producto => (
                            <div key={producto.id} className="col-md-4 mb-3 d-flex justify-content-center">
                                <CardProducto
                                    id={producto.id}
                                    imagenSrc={producto.imagen_1 ? `data:image/jpeg;base64,${producto.imagen_1}` : './logo_2.svg'}
                                    nombreUsuario={'ti'}
                                    titulo={producto.nombre}
                                    descripcion={producto.descripcion}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', width: '100%', marginTop: '20px' }}>
                        <h3>No hay productos disponibles en este momento.</h3>
                    </div>
                )}
            </div>
            <div style={{ marginBottom: '100px' }}></div> {/* espacio antes del footer */}
            <Footer />
        </Fragment>
    )
}

export default ClienteDashboard;