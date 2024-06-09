import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './publicacion.css';
import { AuthContext } from './AuthContext';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Publicacion = () => {
    const { id } = useParams();
    const { userId, isAuthenticated } = useContext(AuthContext);
    const [producto, setProducto] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [esCreador, setEsCreador] = useState(false);

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
        })
        .catch(error => {
            console.error('Error al agregar el comentario:', error);
        });
    };

    const handleResponderComentario = (comentarioId, respuesta) => {
        axios.post(`${backendUrl}/agregar-respuesta`, {
            id_comentario: comentarioId,
            id_usuario: userId,
            respuesta: respuesta
        })
        .then(response => {
            console.log(`Respuesta agregada al comentario ${comentarioId}: ${respuesta}`);
            obtenerComentarios(id);  // Actualizar los comentarios para incluir la nueva respuesta
        })
        .catch(error => {
            console.error('Error al agregar la respuesta:', error);
        });
    };

    console.log(esCreador);

    return (
        <div className="publicacion-container">
            {producto ? (
                <div>
                    <h1>{producto.nombre}</h1>
                    <img src={producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : './logo_2.svg'} alt={producto.nombre} />
                    <p>Descripcion</p>
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
                            {esCreador && (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const respuesta = e.target.elements.respuesta.value;
                                    handleResponderComentario(comentario.id, respuesta);
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
        </div>
    );
};

export default Publicacion;