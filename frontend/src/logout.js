import React, { Fragment, useEffect } from 'react';
import Navbar from './navbar';

const Logout = () => {
    //esto lo hace el context, el remove de token
    /*
    useEffect(() => {
        localStorage.removeItem('token');
    }, []);
    */ 
   
    return (
        <Fragment>
            <Navbar />
            <div className="mt-5">
                <div className="row">
                    <div className="col text-center">
                        <h1 className="mb-4">
                            Gracias por usar truequetools!
                        </h1>
                        <p className="text-muted">
                            Esperamos que tu experiencia haya sido increible. ¿Queres
                            seguir explorando? Visita nuestra seccion de productos!
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}    

export default Logout;
