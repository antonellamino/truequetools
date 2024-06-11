import React from 'react';
import { useLocation } from 'react-router-dom';

const Opciones = () => {
    const location = useLocation();

    // Función para parsear los parámetros de la URL
    const searchParams = new URLSearchParams(location.search);
    const categoria = searchParams.get('categoria');

    return (
        <div>
            <h1>Opciones de Trueque para la Categoría: {categoria}</h1>
            {/* Más lógica y JSX según sea necesario */}
        </div>
    );
};

export default Opciones;