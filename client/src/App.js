// Componente principal con rutas y auth
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Home from './components/Home';
import ClientView from './components/ClientView';
import DeliveryView from './components/DeliveryView';
import AdminView from './components/AdminView';
import OrderHistory from './components/OrderHistory';
import Tracking from './components/Tracking';
import About from './components/About';
import './styles/App.css';  // Estilos globales

// Hook para auth (evita error de useAuth en top-level)
function useAuthHook() {
  return useAuth();
}

// Componente para link dinámico (Login o User)
function AuthLink() {
  const { isLoggedIn, user, logout } = useAuthHook();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <Link className="nav-link" to="/login">Iniciar Sesión</Link>;
  }
  return (
    <span className="nav-link d-flex align-items-center">
      {user?.username} ({user?.role})
      <button className="btn btn-sm btn-outline-light ms-2" onClick={() => { logout(); navigate('/'); }}>Logout</button>
    </span>
  );
}

// Ruta protegida (requiere login)
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthHook();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function AppContent() {
  return (
    <div className="App">
      {/* Nav principal */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">BAKETRAK</Link>
          <div className="navbar-nav ms-auto">
            <AuthLink />
          </div>
        </div>
      </nav>

      {/* Nav secundaria */}
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="combosDropdown" role="button" data-bs-toggle="dropdown">
                Combos
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Combo 1: Pan Artesanal + Pastel de Chocolate + Café</a></li>
                <li><a className="dropdown-item" href="#">Combo 2: Croissant + Tarta de Fresa + Jugo Natural</a></li>
                <li><a className="dropdown-item" href="#">Combo 3: Creppe de Nutella + Waffle con Frutas + Batido</a></li>
                <li><a className="dropdown-item" href="#">Combo 4: Pan Integral + Cupcake Vainilla + Té</a></li>
                <li><a className="dropdown-item" href="#">Combo 5: Creppe Salado + Galleta Integral + Smoothie</a></li>
              </ul>
            </li>
            <li className="nav-item"><Link className="nav-link" to="/client">Ordenar Online</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/client">Catálogo de Pasteles</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/client">Heladería</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/client">Creppes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/client">Waffles</Link></li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="aboutDropdown" role="button" data-bs-toggle="dropdown">
                Acerca de Nosotros
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/about">Nuestra Historia</Link></li>
                <li><a className="dropdown-item" href="#">Equipo</a></li>
                <li><a className="dropdown-item" href="#">Contáctenos</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      {/* Rutas principales */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/client" element={<ProtectedRoute><ClientView /></ProtectedRoute>} />
        <Route path="/delivery" element={<ProtectedRoute><DeliveryView /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminView /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/tracking/:orderId" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

// Wrap con AuthProvider y Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;