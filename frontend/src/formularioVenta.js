import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const FormularioVenta = () => {
    const { id } = useParams();
    const [articulo, setArticulo] = useState('');
    const [valor, setValor] = useState('');
    const [email, setEmailUsuario] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [articuloError, setArticuloError] = useState('');
    const [fechaError, setFechaError] = useState('');
    const [valorError, setValorError] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateArticulo = () => {
        if (!articulo) {
            setArticuloError('Por favor ingresa un artículo');
            return false;
        }
        setArticuloError('');
        return true;
    };

    const validateFecha = () => {
        if (!fechaError) {
            setFechaError('Por favor ingresa una fecha');
            return false;
        }

        const today = new Date();
        const selectedDate = new Date(fechaError);

        if (selectedDate > today) {
            setFechaError('La fecha no puede ser en el futuro');
            return false;
        }

        setFechaError('');
        return true;
    };

    const validateValor = () => {
        if (!valor) {
            setValorError('Por favor ingresa un precio');
            return false;
        }
        setValorError('');
        return true;
    };

    const validateEmail = () => {
        if (!email) {
            setEmailError('Por favor ingresa un email');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fechaActual = new Date();
        const year = fechaActual.getFullYear();
        const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Meses en JavaScript van de 0 a 11
        const day = fechaActual.getDate().toString().padStart(2, '0');
        const fechaVenta = `${year}-${month}-${day}`; // Formato YYYY-MM-DD

        const datosFormulario = {
            articulo: articulo,
            fecha_venta: fechaVenta,
            valor: valor,
            email_usuario: "",
            id_trueque: id
        };

        try {
            const response = await axios.post(`${backendUrl}/agregar-venta`, datosFormulario);
            setMensaje(response.data.message || 'Venta registrada exitosamente');
            setMensajeError('');
            setArticulo('');
            setValor('');
            setEmailUsuario('');
        } catch (error) {
            console.error('Error al registrar los datos:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setMensajeError(error.response.data.error);
            } else {
                setMensajeError('Error al registrar los datos');
            }
        }
    };

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4" style={{ color: 'white' }}>Registrar venta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="articulo">Artículo</label>
                        <input
                            type="text"
                            className="form-control"
                            id="articulo"
                            placeholder="Ingresa el artículo"
                            value={articulo}
                            onChange={(e) => setArticulo(e.target.value)}
                            
                        />
                        {articuloError && <div className="alert alert-danger mt-2">{articuloError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="valor">Precio</label>
                        <input
                            type="text"
                            className="form-control"
                            id="valor"
                            placeholder="Ingresa el precio"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            
                        />
                        {valorError && <div className="alert alert-danger mt-2">{valorError}</div>}
                    </div>
                    {mensaje && <div className="alert alert-success mt-2">{mensaje}</div>}
                    {mensajeError && <div className="alert alert-danger mt-2">{mensajeError}</div>}
                    <button type="submit" className="btn btn-primary">Crear venta</button>
                </form>
            </div>
        </Fragment>
    );
}

export default FormularioVenta;