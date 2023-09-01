import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
  
    // Retrieve stored user data from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  
    // Find the user with the entered username
    const user = storedUsers.find((u) => u.email === username && u.password === password);
  
    if (!user) {
      // Invalid credentials
      setErrorMessage('Wrong username or password');
      return;
    }
  
    // Check if both username and password are not empty
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }
  
    // Retrieve JWT token from local storage
    const token = localStorage.getItem('jwtToken');
  
    if (token) {
      // Successful login
      console.log('Logged in successfully:', user);
      navigate('/settings'); // Navigate to the settings page
    } else {
      setErrorMessage('Failed to authenticate'); // Handle this case as needed
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
}

export default LoginPage;
