// Home.js

import React from 'react';
import Footer from '../../Footer/Footer';
import ProfileButton from '../Profile/Profile';
import { useParams } from 'react-router-dom';
import NavBar from '../../NavBar/NavBar';
import './Home.css'; // Import custom CSS file

const Home = () => {
    const { username, customer_id } = useParams();

    return (
        <div >
            <NavBar />

            <div className="home-bg container">
                <h5 className='sow-id'>SOW ID: SOW_{customer_id}</h5>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
