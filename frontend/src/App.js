import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home';
import LoginCliente from './login-cliente';
import FormularioRegistroCliente from './formularioRegistroCliente';
import './App.css';
import PublicarProductoForm from './formularioProducto';
import ClienteDashboard from './clienteDashboard';
import Logout from './logout';
import CardProducto from './cardProducto';
import LoginEmpleado from './login-empleado';
import AdminDashboard from './adminDashboard';
import { AuthProvider } from './AuthContext';
import EmpleadoDashboard from './empleadoDashboard';
import AltaEmpleado from './formularioRegistroEmpleado';
import ListaEmpleados from './listaEmpleados';
import AltaSucursal from './formularioSucursal';
import FormularioRegistroEmpleado from './formularioRegistroEmpleado';
import Publicacion from './publicacion';
import ListaSucursales from './listaSucursales';
import Ventas from './ventas';
import Notificaciones from './notificaciones'; 
import Opciones from './opciones';
import FormularioVenta from './formularioVenta';
import TruequesPendientes from './truequesPendientes';
import ConfirmarTrueque from './ConfirmarTrueque';
import InfoSucursal from './infoSucursal';
import TruequesExitosos from './truequesExitosos';
import ProtectedRoute from './protectedRoute';
import EditarEmpleado from './editarEmpleado';
import EditarSucursal from './editarSucursal';
import EditarPerfil from './editarPerfilCliente';
import PromedioVentas from './promedioVentas';
import DetalleTrueque from './detalleTrueque';
import MiPerfil from './miPerfil'; // Asegúrate de importar correctamente el componente MiPerfil
import EditarPublicacion from './editarPublicacion';
import Navbar from './Navbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/iniciarSesion" element={<LoginCliente />} />
            <Route path="/registro" element={<FormularioRegistroCliente />} />
            <Route path="/publicarProducto" element={<PublicarProductoForm/>} />
            <Route path="/clienteDashboard" element={<ClienteDashboard />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/cardProducto" element={<CardProducto />} />
            <Route path="/iniciarSesionEmpleado" element={<LoginEmpleado />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/empleadoDashboard" element={<EmpleadoDashboard />} />
            <Route path="/formularioRegistroEmpleado" element={<AltaEmpleado />} />
            <Route path="/listaEmpleados" element={<ListaEmpleados />} />
            <Route path="/formularioSucursal" element={<AltaSucursal />} />
            <Route path="/altaEmpleado" element={<FormularioRegistroEmpleado />} />
            <Route path="/publicacion/:id" element={<Publicacion />} />
            <Route path="/listaSucursales" element={<ListaSucursales />} />
            <Route path="/ConfirmarTrueque/:id" element={<ConfirmarTrueque />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/altaVenta/:id" element={<FormularioVenta />} />
            <Route path="/notificaciones/:id" element={<Notificaciones />} />
            <Route path="/opciones/:sucursalId/:productoId/:usuarioId/:categoriaId/:propietarioId" element={<Opciones />} />
            <Route path="/truequesPendientes/:usuarioId" element={<TruequesPendientes />} />
            <Route path="/infoSucursal" element={<InfoSucursal />} />
            <Route path="/truequesExitosos" element={<TruequesExitosos />} />
            <Route path="/editarEmpleado/:empleadoId" element={<EditarEmpleado />} />
            <Route path="/editarSucursal/:sucursalId" element={<EditarSucursal />} />
            <Route path="/editarPerfil" element={<EditarPerfil />} />
            <Route path="/promedioVentas" element={<PromedioVentas />} />
            <Route path="/miPerfil" element={<MiPerfil />} />
            <Route path="/editarPublicacion/:productoId" element={<EditarPublicacion/>}/>
            <Route path="/Navbar" element={<Navbar/>}/>
            <Route path="/formularioVenta" element={<FormularioVenta/>} />
            <Route path="/promedioVentas" element={<PromedioVentas/>} />
            <Route path="/detalleTrueque/:id" element={<DetalleTrueque/>} />
            </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
