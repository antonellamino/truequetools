import React, { Fragment } from 'react';
import Header from './header';

const Forbidden = () => {
    return (
        <Fragment>
            <Header />
            <div className="d-flex justify-content-center align-items-center ">
                <div className="text-center">
                    <h1>403 - Forbidden</h1>
                    <p>No tienes permiso para acceder a esta página.</p>
                </div>
            </div>
        </Fragment>
    );
};

export default Forbidden;
