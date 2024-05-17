import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import { useAuth } from './AuthContext';

const backendUrl = process.env.REACT_APP_BACK_URL;

const PublicarProductoForm = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoriaData, setCategoriaData] = useState({ categorias: [], categoriaSeleccionada: '' });
    //const [fotos, setFotos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [sucursalPreferencia, setSucursalPreferencia] = useState('');
    const { userId } = useAuth();

    useEffect(() => {
        axios.get(`${backendUrl}/sucursales`)
            .then(response => {
                setSucursales(response.data.sucursales);
            })
            .catch(error => {
                console.error('Error fetching sucursales:', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`${backendUrl}/categorias`)
            .then(response => {
                const categoriasArray = Array.isArray(response.data.categorias) ? response.data.categorias : [];
                setCategoriaData(prevCategoriaData => ({ ...prevCategoriaData, categorias: categoriasArray }));
            })
            .catch(error => {
                console.error('Error fetching categorias:', error);
            });
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        // enviar los datos del producto al backend
       
        const datosFormulario = {
            nombre : nombre,
            descripcion : descripcion,
            sucursalPreferencia: sucursalPreferencia,
            foto: fotos,
            categoria: categoriaData,
            usuario_id: userId
        }

    axios.post(`${backendUrl}/publicarProducto`, datosFormulario)
        .then(response => {
            console.log('Producto publicado exitosamente', response.data);
        })
        .catch(error => {
            console.error('Error al registrar los datos:', error);
            // seteo de mje de error
        });
    }

return (
    <Fragment>
        <Navbar />
            <h2 className="mb-4" style={{ backgroundColor: '#2c3359', color: '#ffffff'}}>Publicar Producto</h2>
        <div className="container mt-5">
            <form onSubmit={handleSubmit} enctype="multipart/form-data">
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea className="form-control" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">Categoría</label>
                    <select className="form-select" id="categoria" value={categoriaData.categoriaSeleccionada} onChange={(e) => setCategoriaData({ ...categoriaData, categoriaSeleccionada: e.target.value })} required>
                        <option value="">Selecciona una categoría</option>
                        {categoriaData.categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                        ))}
                    </select>
                </div>
                {/* <div className="mb-3">
                        <label htmlFor="fotos" className="form-label">Fotos</label>
                        <input type="file" className="form-control" id="fotos" onChange={(e) => setFotos(e.target.files)} multiple />
                    </div> */}
                <div className="mb-3">  
                        <label htmlFor="fotos" className="form-label">Fotos</label>
                        <input type="file" name="foto" className="form-control" id="fotos" onChange={(e) => setFotos(e.target.files)} multiple />
                </div> 
                <div className="mb-3">
                    <label htmlFor="sucursalPreferencia" className="form-label">Sucursal de preferencia</label>
                    <select className="form-select" id="sucursalPreferencia" value={sucursalPreferencia} onChange={(e) => setSucursalPreferencia(e.target.value)} required>
                        <option value="">Seleccione una sucursal</option>
                        {sucursales.map(sucursal => (
                            <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Publicar Producto</button>
            </form>
        </div>
    </Fragment>
);
};

export default PublicarProductoForm;
