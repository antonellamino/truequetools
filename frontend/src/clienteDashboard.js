import React, { Fragment } from 'react';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const ClienteDashboard = () => {
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        navigate('/logout');
    }


    return (
        <Fragment>
            <Navbar />
<<<<<<< Updated upstream
            <button type="button" className="btn btn-info" onClick={handleCerrarSesion}>Cerrar sesion</button>
=======
            <h2 style={{ backgroundColor: '#2c3359', color: '#ffffff' }}>
                Mis productos
            </h2>
            <div className="home-principal">
                {productos.map(producto => (
                    <div key={producto.id} className="col-md-4 mb-3 d-flex justify-content-center">
                        <CardProducto
                            imagenSrc={producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : './logo_2.svg'}
                            nombreUsuario={producto.usuario_id}
                            titulo={producto.nombre}
                            descripcion={producto.descripcion}
                        />
                    </div>
                ))}
            </div>
            <div style={{ marginBottom: '500px' }}></div> {/* espacio antes del footer */}
            
>>>>>>> Stashed changes
        </Fragment>
    )
}

export default ClienteDashboard;