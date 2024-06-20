import React, { Fragment, useState } from 'react';
import axios from 'axios'; 
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const backendUrl = process.env.REACT_APP_BACK_URL;

const LoginEmpleado = () => {
    const [nombre_usuario, setNombreUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [nombre_usuarioError, setnombre_usuarioError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validatenombre_usuario = () => {
        if (!nombre_usuario) {
            setnombre_usuarioError('Por favor ingresa un nombre de usuario');
            return false;
        }
        setnombre_usuarioError('');
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('Por favor ingresa una contraseña');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const navigate = useNavigate();
    const { login } = useAuth(); 

    const onButtonClick = async () => {
        const isnombre_usuarioValid = validatenombre_usuario();
        const isPasswordValid = validatePassword();

        if (isnombre_usuarioValid && isPasswordValid) {
            console.log(isnombre_usuarioValid, isPasswordValid);
            try {
                const response = await axios.post(`${backendUrl}/iniciar-sesion-empleado`, { nombre_usuario: nombre_usuario, contrasena: password });
                console.log(nombre_usuario, password);
                
                const rol = response.data.rol;
                const token = response.data.token;
                const userId = response.data.userId;
                console.log(rol);
    
                login(token, userId, rol);
                
                if (rol === 1) {
                    navigate('/adminDashboard');
                } else if (rol === 2) {
                    navigate('/empleadoDashboard');
                } else {
                    console.error('Rol no válido');
                    setPasswordError('Rol no válido');
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setnombre_usuarioError('El nombre de usuario no existe');
                } else if (error.response && error.response.status === 401) {
                    setPasswordError('Contraseña incorrecta');
                } else {
                    console.error('Error al iniciar sesión:', error.message);
                }
            }
        }
    };

    return (
        <Fragment>
            <Navbar />
            <div className="mainContainer">
                <div className="titleContainer">    
                    <div>Inicia sesión</div>
                </div>
                <br />
                <div className="inputContainer">
                    <input
                        value={nombre_usuario}
                        placeholder="Ingresa tu nombre de usuario"
                        onChange={(ev) => setNombreUsuario(ev.target.value)}
                        className="inputBox"
                    />
                    <label className="errorLabel">{nombre_usuarioError}</label>
                </div>
                <br />
                <div className="inputContainer">
                    <input
                        value={password}
                        placeholder="Ingresa tu contraseña"
                        onChange={(ev) => setPassword(ev.target.value)}
                        className="inputBox"
                        type="password"
                    />
                    <label className="errorLabel">{passwordError}</label>
                </div>
                <br />
                <div className="inputContainer">
                    <input className="inputButton" type="button" onClick={onButtonClick} value="Ingresar" />
                </div>
            </div>
        </Fragment>
    );
};

export default LoginEmpleado;