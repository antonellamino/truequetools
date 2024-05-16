import React from 'react';
import "./cardProducto.css";

const cardProducto = ({ imagenSrc, nombreUsuario, titulo, descripcion }) => {
    return (
        <div className="card card-style" /*style={{ width: '18rem' }}*/ >
            {imagenSrc && <img src={imagenSrc} className="card-img-top" alt="Imagen del producto" />}
            <div className="card-body">
                <h5 className="card-title">{titulo}</h5>
                <p className="card-text">{descripcion}</p>
                <p className="card-text">Publicado por: {nombreUsuario}</p>
                <button className="btn btn-primary">Ofertar</button>
            </div>
        </div>
    );
};

export default cardProducto;

