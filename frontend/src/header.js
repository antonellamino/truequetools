import React from 'react';

const Header = () => {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '150px', margin: '30px 0' }}>
            <img src='/logo_2.svg' alt="Logo" height="180" className="d-inline-block align-top me-2" />
            <h1 className="m-0 text-center flex-grow-1 trueque-title">TRUEQUETOOLS</h1>
        </div>
    );
};

export default Header;
