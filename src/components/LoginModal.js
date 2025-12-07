import React, { useState } from 'react';
import '../styles/login.css';

function LoginModal({ onLogin, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Cambiar 'admin123' por tu contraseña deseada
    const correctPassword = 'N87QRSt';

    if (password === correctPassword) {
      setError('');
      onLogin();
      localStorage.setItem('adminLogged', 'true');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <h2>Acceso de Administrador</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Ingresa la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="error-message">{error}</p>}
          <div className="login-actions">
            <button type="submit" className="btn-login">Entrar</button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
