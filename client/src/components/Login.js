// Componente para vista de login (estilo Spotify con axios y auth)
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);  // Toggle para form de registro

  // Handler para login tradicional (POST a backend)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      login(res.data);  // Actualiza auth context con token/rol/username
      // Redirect por rol
      switch (res.data.role) {
        case 'cliente':
          navigate('/client');
          break;
        case 'repartidor':
          navigate('/delivery');
          break;
        case 'administrador':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error en login');
    }
  };

  // Handler para registro (POST a backend)
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', { username, password, role: 'cliente' });  // Rol default 'cliente'
      setError('');  // Limpia error
      alert('Usuario creado! Ahora inicia sesión.');  // Placeholder para toast
      setShowRegister(false);  // Vuelve a form login
    } catch (err) {
      setError(err.response?.data?.error || 'Error en registro');
    }
  };

  // Handler para login social (simulado; integra OAuth en prod)
  const handleSocialLogin = (provider) => {
    const fakeData = { token: 'fake-jwt', role: 'cliente', username: `${provider}User` };
    login(fakeData);
    navigate('/client');  // Default a cliente
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>  {/* Centrado como Spotify */}
      <h2 className="text-center mb-4">{showRegister ? 'Regístrate en BAKETRAK' : 'Inicia sesión en BAKETRAK'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Botones sociales */}
      <button className="btn btn-light w-100 mb-2" onClick={() => handleSocialLogin('google')}>
        <i className="bi bi-google me-2"></i> Continuar con Google
      </button>
      <button className="btn btn-light w-100 mb-2" onClick={() => handleSocialLogin('facebook')}>
        <i className="bi bi-facebook me-2"></i> Continuar con Facebook
      </button>
      <button className="btn btn-dark w-100 mb-3" onClick={() => handleSocialLogin('apple')}>
        <i className="bi bi-apple me-2"></i> Continuar con Apple
      </button>

      {/* Separador */}
      <div className="d-flex align-items-center mb-3">
        <hr className="flex-grow-1" />
        <span className="px-3">o</span>
        <hr className="flex-grow-1" />
      </div>

      {/* Form dinámico: Login o Register */}
      <form onSubmit={showRegister ? handleRegister : handleLogin}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {showRegister && (
          <div className="mb-3">
            <select className="form-select" value="cliente" onChange={() => {}} disabled>
              <option value="cliente">Cliente</option>
              {/* Agrega opciones para repartidor/admin si quieres */}
            </select>
          </div>
        )}
        <button type="submit" className="btn btn-success w-100">
          {showRegister ? 'Registrarse' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Toggle entre login/register */}
      <p className="text-center mt-3">
        {showRegister ? (
          <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(false); }}>¿Ya tienes cuenta? Inicia sesión</a>
        ) : (
          <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>¿No tienes cuenta? Regístrate</a>
        )}
      </p>
    </div>
  );
};

export default Login;