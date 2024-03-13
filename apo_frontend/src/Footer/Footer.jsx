// Footer.js

import React from 'react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer ">
            <div className="footer-content container text-center">
                <p>
                    &copy; {currentYear} Tech Mahindra. All rights reserved.
                    <br />
                    Application Portfolio Optimization
                </p>
            </div>
        </footer>
    );
};

export default Footer;
