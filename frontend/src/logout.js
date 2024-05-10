import React, { Fragment, useEffect } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        axios.post('/logout', null, { withCredentials: true })
            .then(response => {
                navigate('/');
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
            });
    }, [navigate]);

    return (
        <Fragment>
            <Navbar />
            <div>
                <h1>
                    Gracias por usar truequetools
                </h1>
            </div>
        </Fragment>
    );
}

export default Logout;
