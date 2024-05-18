import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import CardProducto from './cardProducto';
//import PanelFiltrado from './panelFiltrado';
import Footer from './footer';

const backendUrl = process.env.REACT_APP_BACK_URL;
const Home = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        axios.get(`${backendUrl}/productos`)
            .then(response => {
                setProductos(response.data.productos);
            })
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });
    }, []);


<<<<<<< Updated upstream
=======
    const obtenerCorreoUsuario = (usuarioId) => {
        const usuarioEncontrado = Object.values(usuarios).find(usuario => usuario.id === usuarioId);
        return usuarioEncontrado ? usuarioEncontrado.correo : '';
    };
    
>>>>>>> Stashed changes
    return (
        <Fragment>
            <Navbar />
            <PanelFiltrado />
            <h2 style={{ backgroundColor: '#2c3359', color: '#ffffff'}}>
                Productos disponibles
            </h2>
            <div className='home-principal'>
                <div className="row">
                    {productos.map(producto => (
                        <div key={producto.id} className="col-md-4 mb-3">
                            <CardProducto
                                imagenSrc={`data:image/jpeg;base64,${producto.imagen}`}
                                nombreUsuario={producto.nombreUsuario}
                                titulo={producto.titulo}
                                descripcion={producto.descripcion}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Home;
