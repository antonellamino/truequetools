import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const backendUrl = process.env.REACT_APP_BACK_URL;

const EditarSucursal = () => {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const { sucursalId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSucursal = async () => {
            try {
                console.log(sucursalId);
                const response = await axios.get(`${backendUrl}/obtener-sucursal/${sucursalId}`);
                const sucursal = response.data.sucursal;
                setNombre(sucursal.nombre);
                setDireccion(sucursal.direccion);
                setTelefono(sucursal.telefono);
            } catch (error) {
                console.error('Error al obtener el empleado:', error);
            }
        };

        fetchSucursal();
    }, [sucursalId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datosFormulario = {
            nombre: nombre,
            direccion: direccion,
            telefono: telefono
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se guardarán los cambios realizados.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar cambios',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(`${backendUrl}/editar-sucursal`, {
                        sucursalId: sucursalId,
                        datosFormulario: datosFormulario
                    });
    
                    Swal.fire(
                        'Guardado!',
                        'Los cambios han sido guardados exitosamente.',
                        'success'
                    ).then(() => {
                        navigate('/infoSucursal');
                    });

                } catch (error) {
                    console.error('Error al editar los datos:', error);
                    if (error.response && error.response.data && error.response.data.error) {
                    }
    
                    Swal.fire(
                        'Error!',
                        'Hubo un error al guardar los cambios.',
                        'error'
                    );
                }
            }
        });
    };;


    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4" style={{ color: 'white' }}>Editar sucursal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            placeholder="Ingresa el nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido" className="font-weight-bold">Direccion</label>
                        <input
                            type="text"
                            className="form-control"
                            id="direccion"
                            placeholder="Ingresa la direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre_usuario" className="font-weight-bold">Telefono</label>
                        <input
                            type="text"
                            className="form-control"
                            id="telefono"
                            placeholder="Ingresa el telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar cambios</button>
                </form>
            </div>
        </Fragment>
    );
};

export default EditarSucursal;
