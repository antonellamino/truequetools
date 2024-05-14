import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACK_URL;

const PanelFiltrado = ({ onFiltrar }) => {
    const [sucursales, setSucursales] = useState([]);
    const [categorias, setCategorias] = useState([]);

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

    const handleFiltrar = (filtro) => {
        onFiltrar(filtro);
    };

    return (
        <div className="card" style={{ backgroundColor: '#0a96a6' }}>
            <div className="card-header">
                <h5 className="card-title">Filtrar</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="sucursalSelect" className="form-label">Filtrar por Sucursal:</label>
                    <select className="form-select" id="sucursalSelect" onChange={(e) => handleFiltrar({ tipo: 'sucursal', valor: e.target.value })}>
                        <option value="">Todas las sucursales</option>
                        {sucursales.map(sucursal => (
                            <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="categoriaSelect" className="form-label">Filtrar por categoría:</label>
                    <select className="form-select" id="categoriaSelect" onChange={(e) => handleFiltrar({ tipo: 'categoria', valor: e.target.value })}>
                        <option value="">Todas las categorías</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="productosPromocionadosCheck" onChange={(e) => handleFiltrar({ tipo: 'promocionados', valor: e.target.checked })} />
                    <label className="form-check-label" htmlFor="productosPromocionadosCheck">Filtrar productos promocionados</label>
                </div>
            </div>
        </div>
    );
};

export default PanelFiltrado;
