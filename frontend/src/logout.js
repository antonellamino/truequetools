import React, { Fragment} from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Logout = () => {

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
            <div style={{ marginBottom: '200px' }}></div> {/*espacio antes del footer*/}
            <Footer />
        </Fragment>
    );
}

export default Logout;