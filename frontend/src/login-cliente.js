import React, { Fragment, useState, useContext} from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Footer from './footer';

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
        /*
        if (password.length < 6 || password.length > 20) {
            setPasswordError('La contraseña debe tener 6 caracteres como minimo y 20 como maximo');
            return false;
        }
        */
        setPasswordError('');
        return true;
    };

    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Obtiene la función de login del contexto de autenticación


    const onButtonClick = async () => {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        console.log(isEmailValid, isPasswordValid);

        if (isEmailValid && isPasswordValid) {
            try {
                const response = await axios.post(`${backendUrl}/iniciar-sesion-cliente`, { correo: email, contrasena: password });
                console.log(response.status);
                if (response.status === 200) {
                    const token = response.data.token;
                    const userId = response.data.userId;
                    //localStorage.setItem('token', token);

                    //el login tambien tiene que recibir el id

                    login(token,userId)
                    //que me lleve al inicio no al productos publicados
                    navigate('/home');
                }
            } catch (error) {
                console.error('entra x el catch:', error.message);
                if (error.response.status === 404) {
                    console.error('Error:', error.response.data);
                    setMensajeError(error.response.data.error);
                } else {
                        if (error.response.status === 401){
                        console.error('Error:', error.response.data);
                        setMensajeError(error.response.data.error);
                    }
                }
            }
        };
    }
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
                {mensajeError && <div className="errorLabel text-danger" >{mensajeError}</div>}
                <div className="inputContainer">
                    <input className="inputButton" type="button" onClick={onButtonClick} value="ingresar" />
                </div>
            </div>
            <div style={{ marginBottom: '50px' }}></div>
            <Footer/>
        </Fragment>
    );
};
export default LoginCliente;
