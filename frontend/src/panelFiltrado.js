import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACK_URL;

const PanelFiltrado = ({ actualizarProductosFiltrados }) => {
    const [sucursales, setSucursales] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtros, setFiltros] = useState({
        sucursal_elegida: '',
        categoria_id: '',
        //promocionados: false
    });

    useEffect(() => {
        axios.get(`${backendUrl}/sucursales`)
            .then(response => {
                setSucursales(response.data.sucursales);
            })
            .catch(error => {
                console.error('Error al obtener las sucursales:', error);
            });

        axios.get(`${backendUrl}/categorias`)
            .then(response => {
                setCategorias(response.data.categorias);
            })
            .catch(error => {
                console.error('Error al obtener las categorias:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFiltros({
            ...filtros,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFiltrar = async() => {
        try {
            const response = await axios.get(`${backendUrl}/productos-filtrados`, { params: filtros });
            console.log(filtros);
            actualizarProductosFiltrados(response.data.productos);
            console.log(response.data.productos);
        } catch (error) {
            console.error('Errorrrrrr:', error);
        }
    };

    return (
        <div className="card rounded-0" style={{ backgroundColor: '#0a96a6' }}>
            <div className="card-header">
                <h5 className="card-title">Filtrar</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="sucursalSelect" className="form-label">Filtrar por Sucursal:</label>
                    <select
                        className="form-select"
                        id="sucursalSelect"
                        name="sucursal_elegida"
                        value={filtros.sucursal_elegida}
                        onChange={handleChange}
                    >
                        <option value="">Todas las sucursales</option>
                        {sucursales.map(sucursal => (
                            <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="categoriaSelect" className="form-label">Filtrar por Categoría:</label>
                    <select
                        className="form-select"
                        id="categoriaSelect"
                        name="categoria_id"
                        value={filtros.categoria_id}
                        onChange={handleChange}
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                        ))}
                    </select>
                </div>
                {/* <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="productosPromocionadosCheck"
                        name="promocionados"
                        //checked={filtros.promocionados}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="productosPromocionadosCheck">Filtrar productos promocionados</label>
                </div> */}
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary w-50" onClick={handleFiltrar}>Filtrar</button>
                </div>
            </div>
        </div>
    );
};

export default PanelFiltrado;