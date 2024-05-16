import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    //constantes con el valor por defecto y los sets
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const [userId, setUsuarioId] = useState(null);

    useEffect(() => {
        //iniciar las variables con lo recibido

        const token = localStorage.getItem('token');
        const storedUserId  = localStorage.getItem('userId');
        if (token) {
            setIsAuthenticated(true);
            setUsuarioId(storedUserId);
        }
    }, []);


    //no olvidar de recibir el used tmb
    const login = (token, userId) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        setIsAuthenticated(true);
        setUsuarioId(userId);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
        setUsuarioId(null);

    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, usuarioId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};