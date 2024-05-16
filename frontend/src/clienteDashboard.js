import React, { Fragment } from 'react';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const ClienteDashboard = () => {
<<<<<<< Updated upstream
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        navigate('/logout');
    }

=======
    const { isAuthenticated, userId } = useAuth ();
    const [productos, setProductos] = useState([]);
    
    // revisar

    const [usuarios, setUsuarios] = useState([]);

    const obtenerUsuarios = (userIds) => {
        axios.post(`${backendUrl}/usuarios`, { userIds })
            .then(response => {
                setUsuarios(response.data.usuarios);
            })
            .catch(error => {
                console.error('Error al obtener la información de los usuarios:', error);
            });
    };

    const obtenerCorreoUsuario = (usuarioId) => {
        const usuarioEncontrado = Object.values(usuarios).find(usuario => usuario.id === usuarioId);
        return usuarioEncontrado ? usuarioEncontrado.correo : '';
    };

    // revisar
    
    useEffect(() => {
        if (isAuthenticated && userId) {
            axios.get(`${backendUrl}/productos-usuario`, {
                params: { usuarioId: userId }
            })
            .then(response => {
                setProductos(response.data.productos);
            })
            .catch(error => {
                console.error('Error al obtener productos del usuario:', error);
            });
        }
    }, [isAuthenticated, userId]);
>>>>>>> Stashed changes

    return(
        <Fragment>
            <Navbar />
<<<<<<< Updated upstream
            <button type="button" className="btn btn-info" onClick={handleCerrarSesion}>Cerrar sesion</button>
=======
            <h2 style={{ backgroundColor: '#2c3359', color: '#ffffff'}}>
                Mis productos
            </h2>
            <div className="productos-grid">
                {productos.map(producto => (
                    <CardProducto
                        key={producto.id}
                        imagenSrc={producto.imagen ? `data:image/png;base64,${producto.imagen}` : null}
                        nombreUsuario={obtenerCorreoUsuario(producto.usuario_id)}
                        titulo={producto.nombre}
                        descripcion={producto.descripcion}
                    />
                ))}
            </div>
>>>>>>> Stashed changes
        </Fragment>
    )
}

export default ClienteDashboard;