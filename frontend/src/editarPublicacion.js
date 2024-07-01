import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import Footer from './Footer';

const backendUrl = process.env.REACT_APP_BACK_URL;

const EditarPublicacion = () => {
    const { productoId } = useParams();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria_id, setCategoriaId] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [nombreError, setNombreError] = useState('');
    const [descripcionError, setDescripcionError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await axios.get(`${backendUrl}/obtener-producto/${productoId}`);
                const producto = response.data.producto;

                setNombre(producto.nombre);
                setDescripcion(producto.descripcion);
                setCategoriaId(producto.categoriaId);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`${backendUrl}/categorias`);
                setCategorias(response.data.categorias);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };

        fetchProducto();
        fetchCategorias();
    }, [productoId]);

    const validateNombre = () => {
        if (!nombre.trim()) {
            setNombreError('Por favor ingrese un nombre');
            return false;
        }
        setNombreError('');
        return true;
    };

    const validateDescripcion = () => {
        if (!descripcion.trim()) {
            setDescripcionError('Por favor ingrese una descripción');
            return false;
        }
        setDescripcionError('');
        return true;
    };

    const validateForm = () => {
        const isValidNombre = validateNombre();
        const isValidDescripcion = validateDescripcion();

        return isValidNombre && isValidDescripcion;
    };

    const mostrarConfirmacion = () => {
        return Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres guardar los cambios en la publicación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar cambios',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                guardarCambios();
            }
        });
    };

    const guardarCambios = async () => {
        if (validateForm()) {
            try {
                const datosFormulario = {
                    nombre,
                    descripcion,
                    categoria_id,
                };

                const response = await axios.put(`${backendUrl}/editar-producto`, {
                    productoId,
                    datosFormulario,
                });

                if (response.status === 200) {
                    Swal.fire(
                        'Actualizado!',
                        'La publicación ha sido actualizada exitosamente.',
                        'success'
                    ).then(() => {
                        navigate(`/publicacion/${productoId}`);
                    });
                }
            } catch (error) {
                console.error('Error al actualizar la publicación:', error);
                Swal.fire(
                    'Error!',
                    'Hubo un error al actualizar la publicación.',
                    'error'
                );
            }
        }
    };

    return (
        <Fragment>
            <Navbar />
            <h2 className="mb-4" style={{ backgroundColor: '#2c3359', color: '#ffffff', padding: '10px' }}>Editar Publicación</h2>
            <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-control" />
                {nombreError && <span className="text-danger">{nombreError}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="form-control" />
                {descripcionError && <span className="text-danger">{descripcionError}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="categoria">Categoría</label>
                <select id="categoria" value={categoria_id} onChange={(e) => setCategoriaId(e.target.value)} className="form-control">
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={mostrarConfirmacion} className="btn btn-primary">Guardar Cambios</button>
            <Footer />
        </Fragment>
    );
};

export default EditarPublicacion;


