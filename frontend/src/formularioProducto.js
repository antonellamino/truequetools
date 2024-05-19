import React, { Fragment, useState, useEffect } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import { useAuth } from './AuthContext';

const backendUrl = process.env.REACT_APP_BACK_URL;

const PublicarProductoForm = () => {
    const { userId } = useAuth();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoriaData, setCategoriaData] = useState({ categorias: [], categoriaSeleccionada: '' });
    const [fotos, setFotos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [sucursalPreferencia, setSucursalPreferencia] = useState('');
    const [errores, setErrores] = useState({ nombre: '', descripcion: '', categoria: '' });
    const [enviado, setEnviado] = useState('');
    
    const resetearForm = () => {
        setNombre('');
        setDescripcion('');
        setFotos([]);
        setSucursalPreferencia('');
        setErrores({ nombre: '', descripcion: '', categoria: '' });
    };

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

    const validateForm = () => {
        const errores = {};
        if (!nombre.trim()) errores.nombre = 'Por favor ingresa el nombre del producto';
        if (!descripcion.trim()) errores.descripcion = 'Por favor ingresa la descripción del producto';
        if (!categoriaData.categoriaSeleccionada) errores.categoria = 'Por favor selecciona una categoría';
        setErrores(errores);
        return Object.keys(errores).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        if (!validateForm()) return;
        
        let formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('sucursal_preferencia', sucursalPreferencia);
        formData.append('categoria', categoriaData.categoriaSeleccionada);
        formData.append('usuario_id', userId); 
        
        for (let i = 0; i < fotos.length; i++) {
            formData.append('foto', fotos[i]);
        }

        axios.post(`${backendUrl}/publicarProducto`, formData)
            .then(response => {
                console.log('Producto publicado exitosamente', response.data);
                const enviado = 'Se publico el producto';
                setEnviado(enviado);
                setTimeout(() => {
                    const enviado = '';
                    setEnviado(enviado);   
                }, 5000)
                e.target.reset();
                resetearForm();
            })
            .catch(error => {
                console.error('Error al registrar los datos:', error);
            });
    };

    return (
        <Fragment>
            <Navbar />
            <h2 className="mb-4" style={{ backgroundColor: '#2c3359', color: '#ffffff'}}>Publicar Producto</h2>
            <div className="containermt-5">
                <form onSubmit={handleSubmit}>
                    <div className="inputContainer">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="nombre" value={nombre} placeholder="Ingresa nombre del producto" onChange={(e) => setNombre(e.target.value)}/>
                        <label className="errorLabel">{errores.nombre}</label>
                    </div>
                    <div className="inputContainer">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>    
                        <textarea className="form-control" id="descripcion" value={descripcion} placeholder="Ingresa descripción del producto" onChange={(e) => setDescripcion(e.target.value)} />
                        <label className="errorLabel">{errores.descripcion}</label>
                    </div>
                    <div className="inputContainer">
                        <label htmlFor="categoria" className="form-label">Categoría</label>
                        <select className="form-select" id="categoria" value={categoriaData.categoriaSeleccionada} onChange={(e) => setCategoriaData({ ...categoriaData, categoriaSeleccionada: e.target.value })} >
                            <option value="">Selecciona una categoría</option>
                            {categoriaData.categorias.map(categoria => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        <label className="errorLabel">{errores.categoria}</label>
                    </div>
                    <div className="inputContainer">  
                        <label htmlFor="fotos" className="form-label">Fotos</label>
                        <input type="file" name="foto" className="form-control" id="fotos" onChange={(e) => setFotos(e.target.files)} />
                    </div> 
                    <div className="inputContainer">
                        <label htmlFor="sucursalPreferencia" className="form-label">Sucursal de preferencia</label>
                        <select className="form-select" id="sucursalPreferencia" value={sucursalPreferencia} onChange={(e) => setSucursalPreferencia(e.target.value)} >
                            <option value="">Seleccione una sucursal</option>
                            {sucursales.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Publicar Producto</button>
                </form>
                <label className="correctLabel">{enviado}</label>
            </div>
        </Fragment>
    );
};

export default PublicarProductoForm;