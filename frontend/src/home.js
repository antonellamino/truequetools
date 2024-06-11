import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import CardProducto from './cardProducto';
import PanelFiltrado from './panelFiltrado';
import Footer from './footer';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Home = () => {
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [busquedaHecha, setBusquedaHecha] = useState(false);

    const obtenerUsuarios = (userIds) => {
        axios.post(`${backendUrl}/usuarios`, { userIds })
            .then(response => {
                setUsuarios(response.data.usuarios);
            })
            .catch(error => {
                console.error('Error al obtener la información de los usuarios:', error);
            });
    };

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
    }, []);

    const actualizarProductosFiltrados = (productosFiltrados) => {
        setProductosFiltrados(productosFiltrados);
        setBusquedaHecha(true);
    };
    const obtenerCorreoUsuario = (usuarioId) => {
        const usuarioEncontrado = Object.values(usuarios).find(usuario => usuario.id === usuarioId);
        return usuarioEncontrado ? usuarioEncontrado.correo : '';
    };
    return (
        <Fragment>
            <Navbar actualizarProductosFiltrados={actualizarProductosFiltrados} />
            <PanelFiltrado actualizarProductosFiltrados={actualizarProductosFiltrados} />
            <h2 style={{ backgroundColor: '#2c3359', color: '#ffffff' }}>
                Productos disponibles
            </h2>
            <div className='home-principal'>

                {busquedaHecha && productosFiltrados.length === 0 && (
                    <div className="d-flex justify-content-center align-items-center" style={{ color: 'white', textAlign: 'center', width: '100%', background: '#2c3359', height: '80px', marginBottom: '80px' }}>
                        <h3>No hay productos que coincidan con tu busqueda.</h3>
                    </div>
                )}
                {productosFiltrados.length > 0 ? (
                    <div className="row">
                        {productosFiltrados.map(producto => (
                            <div key={producto.id} className="col-md-4 mb-3 d-flex justify-content-center">
                                <CardProducto
                                    imagenSrc={producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : './logo_2.svg'}
                                    nombreUsuario={obtenerCorreoUsuario(producto.usuario_id)}
                                    titulo={producto.nombre}
                                    descripcion={producto.descripcion}
                                />
                            </div>
                        ))}
                    </div>
                ) : productos.length > 0 ? (
                    <div className="row">
                        {productos.map(producto => (
                            <div key={producto.id} className="col-md-4 mb-3 justify-content-center">
                                <CardProducto
                                    id={producto.id}
                                    imagenSrc={producto.imagen_1 ? `data:image/jpeg;base64,${producto.imagen_1}` : './logo_2.svg'}
                                    nombreUsuario={obtenerCorreoUsuario(producto.usuario_id)}
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
            <Footer />
        </Fragment>
    );
};

export default Home;