import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="container">
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
