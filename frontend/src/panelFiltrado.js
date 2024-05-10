import React from 'react';

const PanelFiltrado = ({ onFiltrar }) => {
    const handleFiltrar = (filtro) => {
        onFiltrar(filtro);
    };

    return (
        <div className="card" style={{backgroundColor:'#0a96a6'}}>
            <div className="card-header">
                <h5 className="card-title">Filtrar</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="sucursalSelect" className="form-label">Filtrar por Sucursal:</label>
                    <select className="form-select" id="sucursalSelect" onChange={(e) => handleFiltrar({ tipo: 'sucursal', valor: e.target.value })}>
                        <option value="">Todas las sucursales</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="categoriaSelect" className="form-label">Filtrar por categoria:</label>
                    <select className="form-select" id="categoriaSelect" onChange={(e) => handleFiltrar({ tipo: 'categoria', valor: e.target.value })}>
                        <option value="">Todas las categorias</option>
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

