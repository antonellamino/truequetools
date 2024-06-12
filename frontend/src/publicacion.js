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
    const { userId, isAuthenticated, rol } = useContext(AuthContext);
    //esto es lo que me ingresan
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
        setNuevoComentario(e.target.value.substring(0, 50)); // Limitar a 50 caracteres
    };

    const handleComentarioSubmit = (e) => {
        axios.post(`${backendUrl}/agregar-comentario`, {
            id_producto: id,
            id_usuario: userId, 
            comentario: nuevoComentario
        })
        .then(response => {
            setNuevoComentario('');
            obtenerComentarios(id);
        })
        .catch(error => {
            console.error('Error al agregar el comentario:', error);
        });
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const handleResponderComentario = (comentarioId, respuesta) => {
        const respuestaTruncada = respuesta.substring(0, 50); // Limitar a 50 caracteres
        axios.post(`${backendUrl}/agregar-respuesta`, {
            id_comentario: comentarioId,
            id_usuario: userId,
            respuesta: respuestaTruncada
        })
        .then(response => {
            console.log(`Respuesta agregada al comentario ${comentarioId}: ${respuestaTruncada}`);
            setNuevaRespuesta('');
            obtenerComentarios(id);
        })
        .catch(error => {
            console.error('Error al agregar la respuesta:', error);
        });
    };

    const enviarDatos = (producto) => {
        const data = {
            productoId: producto.id,
            usuarioId: userId,
            categoriaId: producto.categoria_id,
            sucursalId: producto.sucursal_elegida,
            propietarioId: producto.usuario_id
        };
        
        const parametros = `${data.sucursalId}/${data.productoId}/${data.usuarioId}/${data.categoriaId}/${data.propietarioId}`;
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
                                        const respuesta = e.target.elements.respuesta.value.trim(); // Eliminar espacios en blanco al principio y al final
                                        if (respuesta !== "") { // Validar que la respuesta no esté vacía
                                            handleResponderComentario(comentario.id, respuesta.substring(0, 50)); // Limitar a 50 caracteres
                                            e.target.reset(); // Limpiar el formulario de respuesta después del envío
                                        }
                                    }}>
                                        <input type="text" name="respuesta" placeholder="Responder..." />
                                        <button type="submit" className="btn btn-custom-short btn-custom-primary-short">Responder</button>
                                    </form>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No hay comentarios.</p>
                    )}
                    {!esCreador && isAuthenticated &&  (
                        <form className="caja_comentario" onSubmit={(e) => {
                            e.preventDefault();
                            const comentario = nuevoComentario.trim(); // Eliminar espacios en blanco al principio y al final
                            if (comentario !== "") { // Validar que el comentario no esté vacío
                                handleComentarioSubmit();
                            }else{
                                <p>No puedes enviar un mensaje vacío.</p>
                            }
                        }}>
                            <textarea 
                            value={nuevoComentario} 
                            onChange={handleComentarioChange} 
                            placeholder="Escribe un comentario..."
                            maxLength={50} // Limitar a 50 caracteres
                        />
                        {nuevoComentario.length === 50 && <p>Has alcanzado el límite de 50 caracteres.</p>}
                        <button type="submit" className=" btn-custom-short btn-custom-primary-short">Enviar</button>
                        </form>
                    )}
                    {!isAuthenticated && (
                        <p>Debes iniciar sesión para comentar.</p>
                    )}
                </div>
                {!esCreador && isAuthenticated && rol !== 1 && (
                    <button type="submit" className="boton_trueque" onClick={() => enviarDatos(producto)}>
                        Truequear
                    </button>
                )}
            </div>
            <Footer/>
        </Fragment>
    );
};

export default Publicacion;