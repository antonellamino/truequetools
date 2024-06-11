import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUsuarioId] = useState(null);
    const [rol, setRol] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedRol = localStorage.getItem('rol');
        if (token) {
            setIsAuthenticated(true);
            setUsuarioId(storedUserId);
            setRol(storedRol);
        }
    }, []);

    const login = (token, userId, rol) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('rol', rol);
        setIsAuthenticated(true);
        setUsuarioId(userId);
        setRol(rol);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('rol');
        setIsAuthenticated(false);
        setUsuarioId(null);
        setRol(null);
        navigate('/iniciarSesion');
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
