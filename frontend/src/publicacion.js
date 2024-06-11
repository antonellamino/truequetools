import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './publicacion.css';
import { AuthContext } from './AuthContext';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from './footer';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';


const backendUrl = process.env.REACT_APP_BACK_URL;

const Publicacion = () => {
    const { id } = useParams();
    const { userId, isAuthenticated } = useContext(AuthContext);
    const [producto, setProducto] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [esCreador, setEsCreador] = useState(false);
    const [respuesta, setNuevaRespuesta] = useState('');

    const navigate = useNavigate(); // Se obtiene el hook useNavigate
   
    useEffect(() => {
        obtenerProducto(id);
        obtenerComentarios(id);
    }, [id]);

    useEffect(() => {
        if (producto && userId) {
            const result = (producto.usuario_id == userId);
            setEsCreador(result);
        }
    }, [producto, userId]);

    const obtenerProducto = (id) => {
        axios.get(`${backendUrl}/datos-producto`, { params: { id } }) 
            .then(response => {
                setProducto(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la información del producto:', error);
            });
    };

    const obtenerComentarios = (id) => {
        axios.get(`${backendUrl}/comentarios`, { params: { id } })
            .then(response => {
                setComentarios(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los comentarios:', error);
            });
    };

    const handleComentarioChange = (e) => {
        setNuevoComentario(e.target.value);
    };

    const setNotificacion = (idUsuario, comentario) => {
        const notificacionData = {
            idUser: idUsuario,
            comentario: comentario,
            link: `/publicacion/${id}`
        };
    
        axios.post(`${backendUrl}/agregar-notificacion`, notificacionData)
            .then(response => {
                console.log("Se agregó la notificación");
            })
            .catch(error => {
                console.error("Error al agregar la notificación de comentario:", error);
            });
    };
    

    const handleComentarioSubmit = (e) => {
        e.preventDefault();
        axios.post(`${backendUrl}/agregar-comentario`, {
            id_producto: id,
            id_usuario: userId, 
            comentario: nuevoComentario
        })
        .then(response => {
            setNuevoComentario('');
            obtenerComentarios(id);
            const comentario = "Tienes un nuevo comentario"
            const usuarioComentario = producto.usuario_id;
            setNotificacion(usuarioComentario, comentario);
        })
        .catch(error => {
            console.error('Error al agregar el comentario:', error);
        });
    };

    const handleResponderComentario = (comentarioId, respuesta, idComentario) => {
        const usuarioComentario = idComentario;
        axios.post(`${backendUrl}/agregar-respuesta`, {
            id_comentario: comentarioId,
            id_usuario: userId,
            respuesta: respuesta
        })
        .then(response => {
            setNuevaRespuesta('');
            obtenerComentarios(id);
            const textoNotificacion = "Tienes una nueva respuesta"
            setNotificacion(usuarioComentario, textoNotificacion);
        })
        .catch(error => {
            console.error('Error al agregar la respuesta:', error);
        });
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    //al apretar el boton, guardo los datos
    const enviarDatos = (producto) => {
        const data = {
            productoId: producto.id,
            usuarioId: userId,
            categoriaId: producto.categoria_id
        };
    
        const parametros = `${data.productoId}/${data.usuarioId}/${data.categoriaId}`;
        navigate(`/opciones/${parametros}`);
    }

    return (
        <Fragment>
            <Navbar />
            <div className="publicacion-container">
                {producto ? (
                    <div>
                        <h1>{producto.nombre}</h1>
                        {producto.imagen_1 === null ? (
                            <img src="/logo_2.svg" alt="Default Logo" />
                        ) : (
                            <>
                                {producto.imagen_2 === null ? (
                                    <img src={`data:image/jpeg;base64,${producto.imagen_1}`} alt="Imagen 1" />
                                ) : (
                                    <Slider {...settings}>
                                        {[producto.imagen_1, producto.imagen_2, producto.imagen_3, producto.imagen_4].filter(img => img !== null).map((img, index) => (
                                            <div key={index}><img src={`data:image/jpeg;base64,${img}`} alt={`Imagen ${index + 1}`} /></div>
                                        ))}
                                    </Slider>
                                )}
                            </>
                        )}
                    <p>Descripción</p>
                    <p>{producto.descripcion}</p>
                    <p>Usuario</p>
                    <p>{producto.nombre_usuario}</p>
                    <p>Categoría</p>
                    <p>{producto.nombre_categoria}</p>
                    <p>Sucursal</p> 
                    <p>{producto.nombre_sucursal}</p>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
            <div className="comentarios-container">
                <h2>Comentarios</h2>
                {comentarios.length > 0 ? (
                    comentarios.map((comentario) => (
                        <div key={comentario.id} className="comentario">
                            <p>{comentario.comentario}</p>
                            {comentario.respuesta != null ? (
                                <p>{comentario.respuesta}</p>
                            ) : (
                                <p>No hay respuesta.</p>
                            )}
                            { (esCreador) && (comentario.respuesta == null) &&(
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const respuesta = e.target.elements.respuesta.value;

                                    handleResponderComentario(comentario.id, respuesta, comentario.id_usuario);
                                    e.target.reset(); // Limpiar el formulario de respuesta después del envío
                                }}>
                                    <input type="text" name="respuesta" placeholder="Responder..." />
                                    <button type="submit">Responder</button>
                                </form>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No hay comentarios.</p>
                )}
                {!esCreador && isAuthenticated && (
                    <form onSubmit={handleComentarioSubmit}>
                        <textarea 
                            value={nuevoComentario} 
                            onChange={handleComentarioChange} 
                            placeholder="Escribe un comentario..."
                        />
                        <button type="submit">Enviar</button>
                    </form>
                )}
                {!isAuthenticated && (
                    <p>Debes iniciar sesión para comentar.</p>
                )}

                
            </div>
            {(!esCreador && isAuthenticated && (
                <button onClick={() => enviarDatos(producto)}>
                Truequear
                </button>
            ))}
        </div>
       <Footer/>
    </Fragment>
    );
};

export default Publicacion;