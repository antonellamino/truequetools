import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home';
import LoginCliente from './login-cliente';
import Formulario from './formularioRegistro';
import './App.css';
import PublicarProductoForm from './formularioProducto';
import ClienteDashboard from './clienteDashboard';
import Logout from './logout';
import AgregarEmpleado from './agregarEmpleado';
import CardProducto from './cardProducto';
import LoginEmpleado from './login-empleado';
import AdminDashboard from './adminDashboard';
import { AuthProvider } from './AuthContext';
import EmpleadoDashboard from './empleadoDashboard';
import Publicacion from './publicacion';
import Notificaciones from './notificaciones'; 
import Opciones from './opciones';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/iniciarSesion" element={<LoginCliente />} />
          <Route path="/registro" element={<Formulario />} />
          <Route path="/publicarProducto" element={<PublicarProductoForm />} />
          <Route path="/clienteDashboard" element={<ClienteDashboard />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/agregarEmpleado" element={<AgregarEmpleado />} />
          <Route path="/cardProducto" element={<CardProducto />} />
          <Route path="/iniciarSesionEmpleado" element={<LoginEmpleado />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/empleadoDashboard" element={<EmpleadoDashboard />} />
          <Route path='/publicacion/:id' element={<Publicacion />} />
          <Route path="/notificaciones/:id" element={<Notificaciones />} /> 
          <Route path="/opciones/:productoId/:usuarioId/:categoriaId" element={<Opciones />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App;
