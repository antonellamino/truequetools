import React, { Fragment, useState } from 'react';
import axios from 'axios'; 
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const LoginEmpleado = () => {
    const [dni, setdni] = useState('');
    const [password, setPassword] = useState('');
    const [dniError, setdniError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const validatedni = () => {
        if (!dni) {
            setdniError('Por favor ingresa un dni');
            return false;
        }
        if (dni.length !== 8) {
            setdniError('El DNI debe tener exactamente 8 caracteres');
            return false;
        }
        setdniError('');
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('Por favor ingresa una contraseña');
            return false;
        }
        // if (password.length < 8) {
        //     setPasswordError('La contraseña debe tener 8 caracteres o más');
        //     return false;
        // }
        setPasswordError('');
        return true;
    };
    const navigate = useNavigate();

    const onButtonClick = async () => {
        const isdniValid = validatedni();
        const isPasswordValid = validatePassword();

        if (isdniValid && isPasswordValid) {
            try {
                const response = await axios.post(`${backendUrl}/iniciar-sesion-empleado`, { dni: dni, contrasena: password });
                
                if (response.status === 200) {
                    const rol_id  = response.data.usuario.rol_id;
                    console.log(rol_id);
                    if (rol_id === 1) {
                        navigate('/adminDashboard');
                    } else if (rol_id === 2) {
                        navigate('/empleadoDashboard');
                    } else {
                        // si el rol no es ni 1 ni 2, redirigir a una pagina por defecto o mostrar un mensaje de error
                        console.error('Rol no válido');
                    }
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
                    <div>Inicia sesión</div>
                </div>
                <br />
                <div className="inputContainer">
                    <input
                        value={dni}
                        placeholder="Ingresa tu DNI"
                        onChange={(ev) => setdni(ev.target.value)}
                        className="inputBox"
                    />
                    <label className="errorLabel">{dniError}</label>
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
                    <input className="inputButton" type="button" onClick={onButtonClick} value="Ingresar" />
                </div>
            </div>
    </Fragment>
    );
};

export default LoginEmpleado;
