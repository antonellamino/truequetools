import React from 'react';

const Header = () => {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '150px', margin: '30px 0' }}>
            <img src='/logo_2.svg' alt="Logo" height="180" className="me-2" style={{ verticalAlign: 'middle' }} />
            <h1 className="m-0 text-center trueque-title">TRUEQUETOOLS</h1>
        </div>
    );
};

export default Header;