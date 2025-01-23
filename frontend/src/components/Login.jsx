import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ username, password });

    try {
      const res = await axios.post('http://localhost:8000/api/login/', body, config);
      console.log('Login Successful:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <form className="login-form" onSubmit={onSubmit}>
          <h2 className="login-title">Logowanie</h2>
          <input
            className="login-input"
            type="text"
            placeholder="Nazwa użytkownika"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Hasło"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
          <button className="login-button" type="submit">Zaloguj</button>
        </form>
      </div>
    </>
  );
};

export default Login;