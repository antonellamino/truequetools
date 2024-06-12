import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';

const backendUrl = process.env.REACT_APP_BACK_URL;

const FormularioVenta = () => {
    const [articulo, setArticulo] = useState('');
    const [fecha, setFecha] = useState('');
    const [valor, setValor] = useState('');
    const [email, setEmailUsuario] = useState('');

    const [mensaje, setMensaje] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datosFormulario = {
            articulo: articulo,
            fecha_venta: fecha,
            valor: valor,
            email_usuario: email
        };

        try {
            const response = await axios.post(`${backendUrl}/agregar-venta`, datosFormulario);
            setMensaje(response.data.message || 'Venta registrada exitosamente');
            setMensajeError('');
            setArticulo('');
            setFecha('');
            setValor('');
            setEmailUsuario('');
        } catch (error) {
            console.error('Error al registrar los datos:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setMensajeError(error.response.data.error);
            } else {
                setMensajeError('Error al registrar los datos');
            }
            setMensaje('');
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
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha">Fecha</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fecha_venta"
                            placeholder="Ingresa la fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
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
                            required
                        />
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
                            required
                        />
                    </div>
                    {mensaje && <div className="alert alert-success mt-2">{mensaje}</div>}
                    {mensajeError && <div className="alert alert-danger mt-2">{mensajeError}</div>}
                    <button type="submit" className="btn btn-primary">Registrar venta</button>
                </form>
            </div>
        </Fragment>
    );
}

export default FormularioVenta;
