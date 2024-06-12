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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/iniciarSesion" element={<LoginCliente />} />
            <Route path="/registro" element={<FormularioRegistroCliente />} />
            <Route path="/publicarProducto" element={<PublicarProductoForm />} />
            <Route path="/productosCliente" element={ <ClienteDashboard />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/cardProducto" element={<CardProducto />} />
            <Route path="/iniciarSesionEmpleado" element={<LoginEmpleado />} />
            <Route path="/adminDashboard" element={ <AdminDashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/empleadoDashboard" element={<EmpleadoDashboard />} />
            <Route path="/formularioRegistroEmpleado" element={<AltaEmpleado />} />
            <Route path="/listaEmpleados" element={<ListaEmpleados />} />
            <Route path="/listaEmpleados" element={<ListaEmpleados />} />
            <Route path="/formularioSucursal" element={<AltaSucursal />} />
            <Route path='/altaEmpleado' element={<FormularioRegistroEmpleado />}/>
            <Route path='/publicacion/:id' element={<Publicacion />} />
            <Route path='/listaSucursales' element={ <ListaSucursales /> } />
            <Route path='/ConfirmarTrueque/:id' element={ <ConfirmarTrueque /> } />
            <Route path='/ventas' element={  <Ventas /> }/>
            <Route path="/altaVenta" element={<FormularioVenta/>} />
            <Route path="/notificaciones/:id" element={<Notificaciones />} /> 
            <Route path="/opciones/:sucursalId/:productoId/:usuarioId/:categoriaId/:propietarioId" element={<Opciones />} />
            <Route path="/truequesPendientes/:usuarioId" element={<TruequesPendientes/>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App;