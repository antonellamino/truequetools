import React, { Fragment, useState } from 'react';
import axios from 'axios'; 
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';


const backendUrl = process.env.REACT_APP_BACK_URL;

const LoginCliente = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const validateEmail = () => {
        if (!email) {
            setEmailError('Por favor ingresa un email');
            return false;
        }
        if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setEmailError('Por favor, ingresa un email valido');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('Por favor ingresa una contraseña');
            return false;
        }
        if (password.length < 8) {
            setPasswordError('La contraseña debe tener 8 caracteres o mas');
            return false;
        }
        setPasswordError('');
        return true;
    };
    const navigate = useNavigate();

    const onButtonClick = async () => {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            try {
                const response = await axios.post(`${backendUrl}/iniciar-sesion-cliente`, { correo: email, contrasena: password });
                
                if (response.status === 200) {
                    const rol_id  = response.data.usuario.rol_id;
                    console.log(rol_id);
                    navigate('/clienteDashboard');
                } else {
                    console.error('Error al iniciar sesión:', response.data.error);
                    setMensajeError(response.data.error);
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error.message);
            }
        }
    };

    return (
        <Fragment>
            <Navbar />
            <div className="mainContainer">
                <div className="titleContainer">    
                    <div>Inicia sesion</div>
                </div>
                <br />
                <div className="inputContainer">
                    <input
                        value={email}
                        placeholder="Ingresa tu email"
                        onChange={(ev) => setEmail(ev.target.value)}
                        className="inputBox"
                    />
                    <label className="errorLabel">{emailError}</label>
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
                {mensajeError && <div className="errorLabel">{mensajeError}</div>}

                <div className="inputContainer">
                    <input className="inputButton" type="button" onClick={onButtonClick} value="ingresar" />
                </div>
            </div>
    </Fragment>
    );
};

export default LoginCliente;
