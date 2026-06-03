import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email === 'admin@test.com' && password === 'password123') {
      localStorage.setItem('token', 'demo-token-12345');
      localStorage.setItem('role', 'admin');
      localStorage.setItem('email', 'admin@test.com');
      alert('Admin Login Success!');
      window.location.href = '/dashboard';
    } 
    else if (email === 'author@test.com' && password === 'password123') {
      localStorage.setItem('token', 'demo-token-67890');
      localStorage.setItem('role', 'author');
      localStorage.setItem('email', 'author@test.com');
      alert('Author Login Success!');
      window.location.href = '/dashboard';
    }
    else {
      alert('Email ya password galat hai');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>BookLeaf Portal - Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', margin: '10px', width: '250px' }}
        />
        <br />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', margin: '10px', width: '250px' }}
        />
        <br />
        <button type="submit" style={{ padding: '10px 30px', margin: '10px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p>Admin: admin@test.com / password123</p>
      <p>Author: author@test.com / password123</p>
    </div>
  );
}

export default Login;