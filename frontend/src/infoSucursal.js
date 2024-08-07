import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const backendUrl = process.env.REACT_APP_BACK_URL;

const InfoSucursal = () => {
    const [sucursales, setSucursales] = useState([]);
    const navigate = useNavigate();
    const [showNoChangesMessage, setShowNoChangesMessage] = useState(false); // Estado para el mensaje

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const response = await axios.get(`${backendUrl}/sucursales`);
                // Filtrar sucursales activas
                const sucursalesActivas = response.data.sucursales.filter(sucursal => sucursal.esta_activa);
                setSucursales(sucursalesActivas);
            } catch (error) {
                console.error('Error al obtener sucursales:', error);
            }
        };

        fetchSucursales();
    }, []);

    const isAdmin = localStorage.getItem('rol') === '1';

    const handleEditar = async (id) => {
        try {
            const response = await axios.post(`${backendUrl}/verificar-trueques-pendientes`, { id });
            const tieneTrueques = response.data.tieneTrueques;

            if (tieneTrueques) {
                Swal.fire({
                    title: 'Trueques pendientes',
                    text: 'La sucursal tiene trueques pendientes. ¿Desea continuar con la edición?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, continuar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(`/editarSucursal/${id}`);
                    }
                });
            } else {
                navigate(`/editarSucursal/${id}`);
            }
        } catch (error) {
            console.error('Error al verificar trueques pendientes:', error);
            Swal.fire(
                'Error!',
                'Hubo un error al verificar trueques pendientes.',
                'error'
            );
        }
    };

    const handleEliminar = async (id) => {
        if (id === 1) {
            Swal.fire(
                'Error',
                'No se puede eliminar la sucursal principal.',
                'error'
            );
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    console.log(id);
                    await axios.post(`${backendUrl}/informar-sucursal-eliminada`, { id })
                    const response = await axios.post(`${backendUrl}/eliminar-sucursal`, { id });
                    console.log(response.data);
                    setSucursales(sucursales.filter(sucursal => sucursal.id !== id));
                    Swal.fire(
                        'Eliminado!',
                        'La sucursal ha sido eliminada.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error al eliminar la sucursal:', error);
                    Swal.fire(
                        'Error!',
                        error.response && error.response.data ? error.response.data.error : 'Hubo un error al eliminar la sucursal.',
                        'error'
                    );
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Mostrar mensaje de "no se registraron cambios"
                setShowNoChangesMessage(true);
                setTimeout(() => {
                    setShowNoChangesMessage(false);
                }, 3000); // Mostrar el mensaje por 3 segundos
            }
        });
    };

    return (
        <Fragment>
            <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className="container-fluid flex-grow-1">
                    <h2 className="text-white">Sucursales</h2>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th className="text-center">Nombre</th>
                                    <th className="text-center">Dirección</th>
                                    <th className="text-center">Teléfono</th>
                                    {isAdmin && <th className="text-center">Acciones</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {sucursales.length > 0 ? (
                                    sucursales.map((sucursal) => (
                                        <tr key={sucursal.id}>
                                            <td className="text-center">{sucursal.nombre}</td>
                                            <td className="text-center">{sucursal.direccion}</td>
                                            <td className="text-center">{sucursal.telefono}</td>
                                            {isAdmin && (
                                                <td className="text-center">
                                                    <button className="btn btn-info mr-2" onClick={() => handleEditar(sucursal.id)}>
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleEliminar(sucursal.id)}
                                                        disabled={sucursal.id === 1}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isAdmin ? '4' : '3'} className="text-center">
                                            No hay sucursales registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </div>
            {showNoChangesMessage && (
                    <div className="alert alert-danger" role="alert">
                        Baja rechazada.
                    </div>
            )}
        </Fragment>
    );
};

export default InfoSucursal;
