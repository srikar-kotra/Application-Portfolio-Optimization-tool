import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { AiOutlineLock } from 'react-icons/ai'; // Import the lock icon from react-icons
import axios from 'axios';
import Logo from './TechM-color-logo.png';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleReset = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Username:', username);
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });

      window.location.href = '/' + username + '/select-customer'; // Redirect to home page

      console.log('Login response:', response.data);
    } catch (error) {
      console.error('Error during login:', error.response.data.error);
      // Handle login error, e.g., display an error message
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div>
      <Container fluid className="login-container">
        <div className="login-box">
          <div className="login-image">
            <img src={Logo} alt="Tech Mahindra Logo" className="login-image-img" />
          </div>
          <h2 className="login-title text-center">
            <span className="lock-icon">
              <AiOutlineLock size={15} />
            </span>
            Login APO Tool<span className='copyright-login'>&copy; </span> TechM
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="left-label">Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label className="left-label">Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className='password-input'
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button className="login-button" variant="primary" type="submit">
                Login
              </Button>
              <Button className="reset-button" variant="secondary" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Form>
        </div>
      </Container>

      <p className='login-footer'>
        &copy; {currentYear} Tech Mahindra. All rights reserved.
        <br />
        Application Portfolio Optimization
      </p>

    </div >
  );
};

export default Login;
