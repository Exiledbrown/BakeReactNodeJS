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

// Hook para auth
function useAuthHook() {
  return useAuth();
}

// Componente para link dinámico (Login o User)
function AuthLink() {
  const { isLoggedIn, user, logout } = useAuthHook();
  const navigate = useNavigate();  if (!isLoggedIn) {
    return <Link className="nav-link" to="/login">Iniciar Sesión</Link>;
  }
  return (
    <span className="nav-link d-flex align-items-center">
      {user?.username} ({user?.role})
      <button className="btn btn-sm btn-outline-light ms-2" onClick={() => { logout(); navigate('/'); }}>Logout</button>
    </span>
  );
}

// Ruta protegida con check de rol (para vistas específicas)
function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, user } = useAuthHook();
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;  // O a error page
  }
  return children;
}

function AppContent() {
  const { user } = useAuthHook();
  const role = user?.role;  return (
    <div className="App">
      {/* Nav principal */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success-custom">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">BAKETRAK</Link>
          <div className="navbar-nav ms-auto">
            <AuthLink />
          </div>
        </div>
      </nav>  {/* Nav secundaria dinámica por rol */}
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
        {/* Links por rol - Sin historial en nav para cliente */}
        {role === 'cliente' && (
          <>
            <li className="nav-item"><Link className="nav-link" to="/client">Ordenar Online</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/client">Catálogo de Pasteles</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/client">Heladería</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/client">Creppes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/client">Waffles</Link></li>
            {/* Eliminado el link historial de nav - solo botón abajo */}
          </>
        )}
        {role === 'repartidor' && (
          <>
            <li className="nav-item"><Link className="nav-link" to="/delivery">Mis Entregas</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/tracking">Seguimiento</Link></li>
          </>
        )}
        {role === 'administrador' && (
          <>
            <li className="nav-item"><Link className="nav-link" to="/admin">Gestionar Pedidos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/history">Historial General</Link></li>
          </>
        )}
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

  {/* Rutas principales con protección por rol */}
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/client" element={<ProtectedRoute allowedRoles={['cliente']}><ClientView /></ProtectedRoute>} />
    <Route path="/delivery" element={<ProtectedRoute allowedRoles={['repartidor']}><DeliveryView /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute allowedRoles={['administrador']}><AdminView /></ProtectedRoute>} />
    <Route path="/history" element={<ProtectedRoute allowedRoles={['cliente', 'administrador']}><OrderHistory /></ProtectedRoute>} />
    <Route path="/tracking/:orderId" element={<ProtectedRoute allowedRoles={['cliente', 'repartidor']}><Tracking /></ProtectedRoute>} />
    <Route path="/about" element={<About />} />
  </Routes>

  {/* Footer gris oscuro (migra de HTML original) */}
  <footer className="mt-5">
    <div className="container">
      <div className="row align-items-center mb-3">
        <div className="col-md-8">
          <nav className="nav flex-row justify-content-center justify-content-md-start">
            <a className="nav-link" href="#" aria-label="Política de Privacidad">Política de Privacidad</a>
            <a className="nav-link" href="#" aria-label="Condiciones de Servicio">Condiciones de Servicio</a>
            <a className="nav-link" href="#" aria-label="Declaración de Accesibilidad">Declaración de Accesibilidad</a>
            <a className="nav-link" href="#" aria-label="Al por Mayor">Al por Mayor</a>
            <a className="nav-link" href="#" aria-label="Eventos">Eventos</a>
            <a className="nav-link" href="#" aria-label="Centro de Ayuda">Centro de Ayuda</a>
          </nav>
        </div>
        <div className="col-md-4 contact-info text-end">
          <p>¿Tienes alguna pregunta? Siempre estamos aquí para ayudarte<br />El horario del Equipo de Atención al Consumidor es de lunes a viernes, de 9 a. m. a 5 p. m.</p>
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="social-icons d-flex">
            <a href="https://wa.me/+573124567890" aria-label="Contactar por WhatsApp" target="_blank">
              <i className="bi bi-whatsapp me-2" aria-hidden="true"></i> +57 312 456 7890
            </a>
            <a href="https://www.facebook.com/BAKETRAKColombia" aria-label="Página de Facebook" target="_blank">
              <i className="bi bi-facebook" aria-hidden="true"></i>
            </a>
            <a href="https://www.instagram.com/BAKETRAK_Colombia" aria-label="Página de Instagram" target="_blank">
              <i className="bi bi-instagram" aria-hidden="true"></i>
            </a>
            <a href="https://www.twitter.com/BAKETRAKCol" aria-label="Página de Twitter" target="_blank">
              <i className="bi bi-twitter" aria-hidden="true"></i>
            </a>
            <a href="https://www.youtube.com/@BAKETRAKColombia" aria-label="Canal de YouTube" target="_blank">
              <i className="bi bi-youtube" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <div className="col-md-6 text-end copyright">
          <p>© 2025 BAKETRAK. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </footer>
</div>  );
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