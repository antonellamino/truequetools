import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import CardProducto from './cardProducto';
import PanelFiltrado from './panelFiltrado';
import Footer from './footer';
import _ from 'lodash'; //sacar lodash

const backendUrl = process.env.REACT_APP_BACK_URL;


const Home = () => {
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);


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
    } , [] );


    const obtenerCorreoUsuario = (usuarioId) => {
        const usuarioEncontrado = Object.values(usuarios).find(usuario => usuario.id === usuarioId);
        return usuarioEncontrado ? usuarioEncontrado.correo : '';
    };
    
    
    
    

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
                                    nombreUsuario={obtenerCorreoUsuario(producto.usuario_id)}
                                    titulo={producto.nombre}
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
