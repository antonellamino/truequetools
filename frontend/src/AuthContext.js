import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    //constantes con el valor por defecto y los sets
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const [userId, setUsuarioId] = useState(null);
    const [rol, setRol] = useState(null);

    useEffect(() => {
        //iniciar las variables con lo recibido

        const token = localStorage.getItem('token');
        const storedUserId  = localStorage.getItem('userId');
        const rol = localStorage.getItem('rol');
        if (token) {
            setIsAuthenticated(true);
            setUsuarioId(storedUserId);
            setRol(rol);
        }
    }, []);


    //no olvidar de recibir el used tmb
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