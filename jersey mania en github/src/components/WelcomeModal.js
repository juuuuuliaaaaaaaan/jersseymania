import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import '../styles/login.css';

function WelcomeModal({ onStart }) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [inviterCode, setInviterCode] = useState('');
  const [error, setError] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    // Verificar si ya hay usuario en este dispositivo
    const registered = userService.getRegisteredUserOnDevice();
    if (registered) {
      setAlreadyRegistered(true);
      setError(`Ya tienes un usuario registrado en este dispositivo: ${registered.username}`);
    }
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Ingresa un nombre');
      return;
    }
    try {
      const user = userService.createUser(username.trim(), phone.trim(), inviterCode.trim() || null);
      userService.refreshCurrent();
      onStart(user);
    } catch (err) {
      setError(err.message);
      setUsername('');
    }
  };

  const handleContinueGuest = () => {
    onStart(null);
  };

  const handleUsePreviousUser = () => {
    const registered = userService.getRegisteredUserOnDevice();
    if (registered) {
      onStart(registered);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <h2>Bienvenido a Jerssey Mania</h2>
        
        {alreadyRegistered ? (
          <>
            <p style={{ color: '#ff6f3c', fontWeight: '700' }}>
              ⚠️ Ya tienes un usuario registrado en este dispositivo
            </p>
            <p>Un dispositivo solo puede tener una cuenta. Puedes continuar con tu usuario existente o como invitado.</p>
            <div className="login-actions">
              <button type="button" className="btn-login" onClick={handleUsePreviousUser}>Usar mi cuenta</button>
              <button type="button" className="btn-cancel" onClick={handleContinueGuest}>Continuar como invitado</button>
            </div>
          </>
        ) : (
          <>
            <p>Puedes crear una cuenta opcional para recibir y compartir tu código de invitación.</p>
            <form onSubmit={handleRegister}>
              <input 
                placeholder="Nombre" 
                value={username} 
                onChange={e => {
                  setUsername(e.target.value);
                  setError('');
                }} 
              />
              <input 
                placeholder="Teléfono (opcional)" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
              />
              <input 
                placeholder="Código de invitación (opcional)" 
                value={inviterCode} 
                onChange={e => setInviterCode(e.target.value)} 
              />
              {error && <p className="error-message">{error}</p>}
              <div className="login-actions">
                <button type="submit" className="btn-login">Crear cuenta</button>
                <button type="button" className="btn-cancel" onClick={handleContinueGuest}>Continuar como invitado</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default WelcomeModal;
