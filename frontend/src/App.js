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
import ProtectedRoute from './protectedRoute';
import FormularioRegistroEmpleado from './formularioRegistroEmpleado';
import Publicacion from './publicacion';
import ListaSucursales from './listaSucursales';
import Ventas from './ventas';
import Notificaciones from './notificaciones'; 
import Opciones from './opciones';
import FormularioVenta from './formularioVenta';
import TruequesPendientes from './truequesPendientes';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/iniciarSesion" element={<LoginCliente />} />
            <Route path="/registro" element={<FormularioRegistroCliente />} />
            <Route path="/publicarProducto" element={<ProtectedRoute requiredRole={3}><PublicarProductoForm /></ProtectedRoute>}/>
            <Route path="/clienteDashboard" element={ <ProtectedRoute requiredRole={3}><ClienteDashboard /></ProtectedRoute>} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/cardProducto" element={<CardProducto />} />
            <Route path="/iniciarSesionEmpleado" element={<LoginEmpleado />} />
            <Route path="/adminDashboard" element={ <ProtectedRoute requiredRole={1}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/home" element={<Home />} />
            <Route path="/empleadoDashboard" element={<EmpleadoDashboard />} />
            <Route path="/formularioRegistroEmpleado" element={<AltaEmpleado />} />
            <Route path="/listaEmpleados" element={<ListaEmpleados />} />
            <Route path="/listaEmpleados" element={<ProtectedRoute requiredRole={1}><ListaEmpleados /></ProtectedRoute>} />
            <Route path="/formularioSucursal" element={<ProtectedRoute requiredRole={1}><AltaSucursal /></ProtectedRoute>} />
            <Route path='/altaEmpleado' element={<ProtectedRoute requiredRole={1}><FormularioRegistroEmpleado /></ProtectedRoute>} />
            <Route path='/publicacion/:id' element={<Publicacion />} />
            <Route path='/listaSucursales' element={ <ListaSucursales /> } />
            <Route path='/ventas' element={  <Ventas /> }/>
            <Route path="/notificaciones/:id" element={<Notificaciones />} /> 
            <Route path="/opciones/:productoId/:usuarioId/:categoriaId/:propietarioId" element={<Opciones />} />
            <Route path="/registrarVenta" element={<FormularioVenta/>} />
          <Route path="/truequesPendientes/:usuarioId" element={<TruequesPendientes/>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App;
