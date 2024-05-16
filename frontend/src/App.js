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
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App