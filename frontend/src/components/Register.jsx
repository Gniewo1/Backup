import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ username, email, password });

    try {
      const res = await axios.post('http://localhost:8000/api/register/', body, config);
      console.log('Registration Successful:', res.data);
      if (res.status === 200) {
                alert("Twoje konto zostało założone. Kod weryfikacyjny został wysłany na podany adres e-mail");
                navigate('/');
        }
      
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <form className="login-form" onSubmit={onSubmit}>
          <h2 className="login-title">Rejestracja</h2>
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
            type="email"
            placeholder="E-mail"
            name="email"
            value={email}
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
          <button className="login-button" type="submit">Rejestruj</button>
        </form>
      </div>
    </>
  );
};

export default Register;
