import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { Link } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const FormularioVenta = ({ sucursal }) => {
    const [articulo, setArticulo] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioUnidad, setPrecioUnidad] = useState('');
    const [total, setTotal] = useState('');
    const [email, setEmailUsuario] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [articuloError, setArticuloError] = useState('');
    const [cantidadError, setCantidadError] = useState('');
    const [precioUnidadError, setPrecioUnidadError] = useState('');
    const [totalError, setTotalError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [sucursales, setSucursales] = useState([]);

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const response = await axios.get(`${backendUrl}/sucursales`);
                setSucursales(response.data.sucursales);
            } catch (error) {
                console.error('Error al obtener las sucursales:', error);
            }
        };
        fetchSucursales();
    }, []);

    useEffect(() => {
        const calculateTotal = () => {
            const calculatedTotal = (parseFloat(cantidad) * parseFloat(precioUnidad)).toFixed(2);
            setTotal(isNaN(calculatedTotal) ? '' : calculatedTotal);
        };
        calculateTotal();
    }, [cantidad, precioUnidad]);

    const validateArticulo = () => {
        if (!articulo) {
            setArticuloError('Por favor ingresa un artículo');
            return false;
        }
        setArticuloError('');
        return true;
    };

    const validateCantidad = () => {
        if (!cantidad || isNaN(cantidad) || parseInt(cantidad) <= 0) {
            setCantidadError('Por favor ingresa una cantidad válida');
            return false;
        }
        setCantidadError('');
        return true;
    };

    const validatePrecioUnidad = () => {
        if (!precioUnidad || isNaN(precioUnidad) || parseFloat(precioUnidad) <= 0) {
            setPrecioUnidadError('Por favor ingresa un precio por unidad válido');
            return false;
        }
        setPrecioUnidadError('');
        return true;
    };

    const validateTotal = () => {
        if (!total || isNaN(total) || parseFloat(total) <= 0) {
            setTotalError('El total no es válido');
            return false;
        }
        setTotalError('');
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

        if (!validateArticulo() || !validateCantidad() || !validatePrecioUnidad() || !validateTotal() || !validateEmail()) {
            return;
        }

        const fechaActual = new Date();
        const year = fechaActual.getFullYear();
        const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const day = fechaActual.getDate().toString().padStart(2, '0');
        const fechaVenta = `${year}-${month}-${day}`;

        const datosFormulario = {
            articulo: articulo,
            cantidad: cantidad,
            precio_unidad: precioUnidad,
            total: total,
            fecha_venta: fechaVenta,
            email_usuario: email,
            sucursal: sucursal
        };

        try {
            const response = await axios.post(`${backendUrl}/agregar-venta`, datosFormulario);
            setMensaje(response.data.message || 'Venta registrada exitosamente');
            setMensajeError('');
            setArticulo('');
            setCantidad('');
            setPrecioUnidad('');
            setTotal('');
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
                        <label htmlFor="cantidad">Cantidad</label>
                        <input
                            type="number"
                            className="form-control"
                            id="cantidad"
                            placeholder="Ingresa la cantidad"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />
                        {cantidadError && <div className="alert alert-danger mt-2">{cantidadError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="precio_unidad">Precio por unidad</label>
                        <input
                            type="text"
                            className="form-control"
                            id="precio_unidad"
                            placeholder="Ingresa el precio por unidad"
                            value={precioUnidad}
                            onChange={(e) => setPrecioUnidad(e.target.value)}
                        />
                        {precioUnidadError && <div className="alert alert-danger mt-2">{precioUnidadError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="total">Total</label>
                        <input
                            type="text"
                            className="form-control"
                            id="total"
                            placeholder="Total calculado"
                            value={total}
                            readOnly
                        />
                        {totalError && <div className="alert alert-danger mt-2">{totalError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email del usuario al que se le realizó la venta</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email_usuario"
                            placeholder="Ingresa el email"
                            value={email}
                            onChange={(e) => setEmailUsuario(e.target.value)}
                        />
                        {emailError && <div className="alert alert-danger mt-2">{emailError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="sucursal">Sucursal</label>
                        <select className="form-control" id="sucursal" value={sucursal}>
                            {sucursales.map((suc) => (
                                <option key={suc.id} value={suc.id}>{suc.nombre}</option>
                            ))}
                        </select>
                    </div>
                    {mensaje && <div className="alert alert-success mt-2">{mensaje}</div>}
                    {mensajeError && <div className="alert alert-danger mt-2">{mensajeError}</div>}
                    <button type="submit" className="btn btn-primary">Crear venta</button>
                    <div className="mt-3">
                        <Link to="/" className="btn btn-secondary w-100">Volver</Link>
                        {/* no se adonde tendria que volver, despues lo veo */}
                    </div>
                </form>
            </div>
        </Fragment>
    );
}

export default FormularioVenta;
