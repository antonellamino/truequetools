import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./cardProducto.css";

const CardProducto = ({ id, imagenSrc, nombreUsuario, titulo, descripcion }) => {
    const navigate = useNavigate();

    const verDetalles = () => {
        console.log(id);
        navigate(`/publicacion/${id}`); 
    };

    return (
        <div className="card card-style">
            <img src={imagenSrc} className="card-img-top" alt="Imagen del producto" />
            <div className="card-body">
                <h5 className="card-title">{titulo}</h5>
                <p className="card-text">{descripcion}</p>
                <p className="card-text">Publicado por: {nombreUsuario}</p>
                <button className="btn btn-primary" onClick={verDetalles}>ver detalles</button> 
            </div>
        </div>
    );
};

export default CardProducto;