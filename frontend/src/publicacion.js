import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './publicacion.css';
import { AuthContext } from './AuthContext';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from './Footer';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './SweetAlert2.css'

const backendUrl = process.env.REACT_APP_BACK_URL;

const Publicacion = () => {
    const { id } = useParams();
    const { isAuthenticated, rol } = useContext(AuthContext);
    const [producto, setProducto] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [esCreador, setEsCreador] = useState(false);
    const [respuesta, setNuevaRespuesta] = useState('');
    const [errorMensaje, setErrorMensaje] = useState(''); // Nuevo estado para mensaje de error
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [mensajeErrorEdicion, setMensajeErrorEdicion] = useState(''); // Estado para el mensaje de error de edición
    const [mensajeErrorEliminacion, setMensajeErrorEliminacion] = useState('');
    const [showNoChangesMessage, setShowNoChangesMessage] = useState(false); // Estado para el mensaje
    const [showNoChangesMessageBaja, setShowNoChangesMessageBaja] = useState(false);
    
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
        .then(async response => {
           
            setNuevoComentario('');
            
          
            try {
   
                const notificacion = {
                    id_usuario: producto.usuario_id, // Aquí obtienes directamente el ID del usuario propietario del producto
                    mensaje: `Han comentado tu producto ${producto.nombre}`,
                    leido: false,
                    link: `/publicacion/${id}`
                };
                
                // Enviar la notificación al usuario propietario del producto
                await axios.post(`${backendUrl}/enviar-notificacion`, notificacion);
                
                // Luego puedes hacer lo que sea necesario después de enviar la notificación
                obtenerComentarios(id); // Esto obtiene los comentarios nuevamente después de agregar uno nuevo
            } catch (error) {
                console.error('Error al obtener datos del producto o enviar la notificación:', error);
            }
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

    const handleResponderComentario = async (usuarioId,comentarioId, respuesta) => {
        try {
            const respuestaTruncada = respuesta.substring(0, 50); // Limitar a 50 caracteres
            
            // Agregar respuesta al comentario
            await axios.post(`${backendUrl}/agregar-respuesta`, {
                id_comentario: comentarioId,
                id_usuario: userId,
                respuesta: respuestaTruncada
            });
            
            console.log(`Respuesta agregada al comentario ${comentarioId}: ${respuestaTruncada}`);
            setNuevaRespuesta('');
            obtenerComentarios(id);
            
            // Obtener el propietario del comentario
    
            // Crear la notificación
            const notificacion = {
                id_usuario: usuarioId,
                mensaje: `Respondieron tu comentario en el producto ${producto.nombre}`,
                leido: false,
                link: `/publicacion/${id}`
            };
    
            // Enviar la notificación
            await axios.post(`${backendUrl}/enviar-notificacion`, notificacion);
            
            console.log('Notificación enviada correctamente');
        } catch (error) {
            console.error('Error:', error);
        }
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
    };

    const eliminarComentario = (comentarioId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.post(`${backendUrl}/eliminar-comentario`, { id_comentario: comentarioId });
                    console.log("el back de eliminar producto me dijo:", res.data);
                    obtenerComentarios(id);
                    Swal.fire({
                        title: 'Eliminado!',
                        text: 'El comentario ha sido eliminado.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false


                    });
                } catch (err) {
                    console.error(err);
                    Swal.fire(
                        'Error!',
                        'Error al intentar eliminar la publicación, por favor inténtalo nuevamente.',
                        'error'
                    );
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Mostrar mensaje de "no se registraron cambios"
                setShowNoChangesMessage(true);
                setTimeout(() => {
                    setShowNoChangesMessage(false);
                }, 3000); // Mostrar el mensaje por 3 segundos
            }
        });
    };

    const eliminarRespuesta = (comentarioId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.post(`${backendUrl}/eliminar-respuesta`, { id_comentario: comentarioId });
                    console.log("el back de eliminar producto me dijo:", res.data);
                    obtenerComentarios(id);
                    Swal.fire({
                        title: 'Eliminado!',
                        text: 'La respuesta ha sido eliminada.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } catch (err) {
                    console.error(err);
                    Swal.fire(
                        'Error!',
                        'Error al intentar eliminar la publicación, por favor inténtalo nuevamente.',
                        'error'
                    );
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Mostrar mensaje de "no se registraron cambios"
                setShowNoChangesMessage(true);
                setTimeout(() => {
                    setShowNoChangesMessage(false);
                }, 3000); // Mostrar el mensaje por 3 segundos
            }
        });
    };

    useEffect(() => {
        if (errorMensaje) {
            const timer = setTimeout(() => {
                setErrorMensaje('');
            }, 3000); // Desaparece después de 3 segundos
            return () => clearTimeout(timer);
        }
    }, [errorMensaje]);

          
    const verificarTruequesPendientes = async (productoId) => {
        try {
            const response = await axios.get(`${backendUrl}/verificar-trueques-producto/${productoId}`);
            return response.data.puedeEditar;
        } catch (error) {
            console.error('Error al verificar los trueques del producto:', error);
            return false;
        }
    };

    const handleEditarPublicacion = async () => {
        const puedeEditar = await verificarTruequesPendientes(id);
        if (puedeEditar) {
            navigate(`/editarPublicacion/${producto.id}`);
        } else {
            setMensajeErrorEdicion('No puedes editar la publicación. Tiene trueques pendientes.');
        }
    };

    const handleEliminarPublicacion = async () => {
        const puedeEliminar = await verificarTruequesPendientes(id);
        if( puedeEliminar ){
            eliminarPublicacion(id);
        }else{
            setMensajeErrorEliminacion('No puedes eliminar esta publicación. Tiene trueques pendientes');
        }
    }

    const eliminarPublicacion = async (id_producto) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.post(`${backendUrl}/eliminar-producto`, { id: id_producto });
                    console.log("el back de eliminar producto me dijo:", res.data);
    
                    navigate('/clienteDashboard');
                
                    Swal.fire({
                        title: 'Eliminado!',
                        text:'La publicación ha sido eliminada.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } catch (err) {
                    console.error(err);
                    Swal.fire(
                        'Error!',
                        'Error al intentar eliminar la publicación, por favor inténtalo nuevamente.',
                        'error'
                    );
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Mostrar mensaje de "no se registraron cambios"
                setShowNoChangesMessageBaja(true);
                setTimeout(() => {
                    setShowNoChangesMessageBaja(false);
                }, 3000); // Mostrar el mensaje por 3 segundos
            }
        });
    };

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
                        <p>Categoría</p>
                        <p>{producto.nombre_categoria}</p>
                        <p>Sucursal</p>
                        <p>{producto.nombre_sucursal}</p>
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
                <div className="comentarios-container">
                    <h2 style={{ backgroundColor: '#2c3359', color: '#ffffff',  padding: '10px' }}>Comentarios</h2>
                    {showNoChangesMessage && (
                        <div className="alert alert-danger" role="alert">
                            No se registraron cambios.
                        </div>
                    )}

                    {comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                            <div key={comentario.id} className="comentario">
                                <p>{comentario.comentario}</p>
                                {comentario.respuesta != null ? (
                                    <div>
                                        <p>{comentario.respuesta}</p>
                                        {esCreador && userId == producto.usuario_id && (<button className="boton_trueque" onClick={() => eliminarRespuesta(comentario.id)}>Eliminar Respuesta</button>)}
                                    </div>
                                ) : (
                                    <div>
                                        <p>No hay respuesta.</p>
                                        {!esCreador && userId == comentario.id_usuario && (<button className="boton_trueque" onClick={() => eliminarComentario(comentario.id)}>Eliminar Comentario</button>)}
                                    </div>
                                )}
                                {(esCreador) && (comentario.respuesta == null) && (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const respuesta = e.target.elements.respuesta.value.trim(); // Eliminar espacios en blanco al principio y al final
                                        if (respuesta !== "") { // Validar que la respuesta no esté vacía
                                            handleResponderComentario(comentario.id_usuario,comentario.id, respuesta.substring(0, 50)); // Limitar a 50 caracteres
                                            setErrorMensaje(''); // Limpiar mensaje de error
                                            e.target.reset(); // Limpiar el formulario de respuesta después del envío
                                        } else {
                                            setErrorMensaje('No puedes enviar una respuesta vacía.');
                                        }
                                    }}>
                                        <input type="text" name="respuesta" placeholder="Responder..." />
                                        <button type="submit" className="btn btn-custom-short btn-custom-primary-short">Responder</button>
                                        {errorMensaje && <p style={{ color: 'red' }}>{errorMensaje}</p>} {/* Mostrar mensaje de error */}
                                    </form>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No hay comentarios.</p>
                    )}
                    {!esCreador && isAuthenticated && (
                        <form className="caja_comentario" onSubmit={(e) => {
                            e.preventDefault();
                            const comentario = nuevoComentario.trim(); // Eliminar espacios en blanco al principio y al final
                            if (comentario !== "") { // Validar que el comentario no esté vacío
                                handleComentarioSubmit();
                            } else {
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
                {esCreador && (
                   <>
                   <button className="btn btn-primary mt-3" onClick={handleEditarPublicacion}>Editar Publicación</button>
                   {mensajeErrorEdicion && <p style={{ color: 'red' }}>{mensajeErrorEdicion}</p>} 
               </>)}

               {esCreador && (
                   <>
                  <button style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }} className="btn btn-primary mt-3" onClick={handleEliminarPublicacion}>Eliminar Publicación</button>
                     {mensajeErrorEliminacion && <p style={{ color: 'red' }}>{mensajeErrorEliminacion}</p>} 
               </>)}


                {!esCreador && isAuthenticated && rol !== 1 && (
                    <button type="submit" className="boton_trueque" onClick={() => enviarDatos(producto)}>
                        Truequear
                    </button>
                )}

                {showNoChangesMessageBaja && (
                    <div className="alert alert-danger" role="alert">
                        Baja rechazada.
                    </div>
                )}
            </div>
            <Footer />
        </Fragment>
    );
};

export default Publicacion;