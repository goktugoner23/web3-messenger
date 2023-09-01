import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
      email,
      password,
      walletAddress: ''
    };
  
    // Save user data to localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    storedUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
  
    console.log('Registered user:', newUser);
    console.log('Updated registered users:', storedUsers);
  
    // Generate JWT token (You can use a library like 'jsonwebtoken')
    const token = 'your_generated_token_here';
  
    // Store the JWT token in local storage
    localStorage.setItem('jwtToken', token);
  
    // Set registration success state
    setIsRegistered(true);
  
    // Clear registration success after 3 seconds
    setTimeout(() => {
      setIsRegistered(false);
      navigate('/login'); // Redirect to login page
    }, 3000);
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      {isRegistered && <p style={{ color: 'green' }}>Registration successful!</p>}
    </div>
  );
}

export default RegisterPage;
