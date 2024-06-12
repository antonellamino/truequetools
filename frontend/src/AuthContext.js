import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUsuarioId] = useState(null);
    const [rol, setRol] = useState(null);
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedRol = localStorage.getItem('rol');
        // if (token) {
        //     setIsAuthenticated(true);
        //     setUsuarioId(storedUserId);
        //     setRol(storedRol);
        // }

        if (storedUserId && storedRol) {
            setUsuarioId(storedUserId);
            setRol(parseInt(storedRol, 10));
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        // setLoading(false);
    }, []);

    const login = (token, userId, rol) => {

        setIsAuthenticated(true);
        setUsuarioId(userId);
        setRol(rol);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('rol', rol);
    };

    const logout = () => {

        setIsAuthenticated(false);
        setUsuarioId(null);
        setRol(null);
        navigate('/iniciarSesion');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('rol');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, rol, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};