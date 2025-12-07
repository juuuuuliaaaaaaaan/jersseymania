import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import LoginModal from './components/LoginModal';
import WelcomeModal from './components/WelcomeModal';
import './styles/main.css';
import { userService } from './services/userService';

function App() {
  const [selected, setSelected] = useState('futbol');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Verificar si ya está autenticado al cargar
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLogged') === 'true';
    if (isLoggedIn) {
      setIsAdmin(true);
    }
    
    // Verificar si hay usuario registrado en este dispositivo
    const registeredUser = userService.getRegisteredUserOnDevice();
    if (registeredUser) {
      setCurrentUser(registeredUser);
      setShowWelcome(false);
    } else {
      // Si no hay usuario registrado en el dispositivo, mostrar welcome
      setShowWelcome(true);
    }
  }, []);

  // Trigger secreto por teclado: Ctrl+Alt+A abre modal de login
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        setShowLoginModal(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleAdminClick = () => {
    const isLoggedIn = localStorage.getItem('adminLogged') === 'true';
    if (isLoggedIn) {
      setIsAdmin(!isAdmin);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLogged');
    setIsAdmin(false);
  };

  const handleStart = (user) => {
    setCurrentUser(user);
    setShowWelcome(false);
  };

  // Función que se pasará al Sidebar para trigger secreto por clicks en logo
  const openSecretAdmin = () => setShowLoginModal(true);

  // abrir modal de registro/bienvenida desde Sidebar/OrderModal
  const openRegister = () => {
    setShowWelcome(true);
  };

  return (
    <div className="app-layout">
      <Navbar 
        onAdminClick={handleAdminClick}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      {!isAdmin && <Sidebar selected={selected} onSelect={setSelected} onSecretAdmin={openSecretAdmin} onRequireLogin={openRegister} />}
      {isAdmin ? <Admin onLogout={handleLogout} /> : <Home selected={selected} currentUser={currentUser} />}
      {showLoginModal && (
        <LoginModal 
          onLogin={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      {showWelcome && (
        <WelcomeModal onStart={handleStart} />
      )}
    </div>
  );
}

export default App;
