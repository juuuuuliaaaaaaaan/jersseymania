import React, { useState } from 'react';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import '../styles/orderModal.css';

function OrderModal({ onClose, onRequireLogin }) {
  const [formData, setFormData] = useState({
    playerName: '',
    sport: 'futbol',
    size: 'M',
    team: '',
    photo: null
  });
  const [submitted, setSubmitted] = useState(false);

  const currentUser = userService.getCurrentUser();

  // Si no hay usuario, mostramos aviso y botón para registrarse
  if (!currentUser) {
    return (
      <div className="order-modal-overlay">
        <div className="order-modal-content">
          <button className="order-modal-close" onClick={onClose}>×</button>
          <h2>Necesitas crear una cuenta</h2>
          <p>Para poder hacer encargos es necesario registrarse o iniciar sesión.</p>
          <div style={{display:'flex', gap:'0.6rem', marginTop:'1rem'}}>
            <button
              className="btn-order-submit"
              onClick={() => {
                onClose();
                if (typeof onRequireLogin === 'function') onRequireLogin();
              }}
            >
              Crear cuenta
            </button>
            <button
              className="btn-share-secondary"
              onClick={onClose}
              style={{background:'#f0f0f0', color:'#333', border:'1px solid #ddd'}}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
  };

  const sendToWhatsapp = () => {
    const whatsappNumber = '5355792217';
    const userName = currentUser ? `\n👤 Usuario: ${currentUser.username}` : '';
    const message = encodeURIComponent(
      `*NUEVO ENCARGO* 📦\n\n` +
      `👤 Jugador: ${formData.playerName}\n` +
      `⚽ Deporte: ${formData.sport}\n` +
      `👕 Talla: ${formData.size}\n` +
      `🏟️ Equipo: ${formData.team}\n` +
      `${formData.photo ? '📷 Enviar foto' : ''}${userName}`
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappLink, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.playerName.trim() || !formData.team.trim()) {
      alert('Por favor completa los campos requeridos');
      return;
    }
    const order = orderService.createOrder(formData);
    setSubmitted(true);
    
    // Enviar por WhatsApp después de guardar
    setTimeout(() => {
      sendToWhatsapp();
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1000);
    }, 500);
  };

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <button className="order-modal-close" onClick={onClose}>×</button>

        <h2>Hacer un encargo</h2>

        {submitted ? (
          <div className="order-success">
            <p>✓ Encargo enviado correctamente</p>
            <p>Abriendo WhatsApp...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del jugador *</label>
              <input
                type="text"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                placeholder="ej: Mbappe"
              />
            </div>

            <div className="form-group">
              <label>Deporte *</label>
              <select name="sport" value={formData.sport} onChange={handleChange}>
                <option value="futbol">Fútbol</option>
                <option value="basket">Básquet</option>
                <option value="beisbol">Béisbol</option>
              </select>
            </div>

            <div className="form-group">
              <label>Talla *</label>
              <select name="size" value={formData.size} onChange={handleChange}>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <div className="form-group">
              <label>Equipo *</label>
              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                placeholder="Barcelona"
              />
            </div>

            <div className="form-group">
              <label>Añadir foto (opcional)</label>
              <div className="photo-upload-area">
                {formData.photo ? (
                  <div className="photo-preview-container">
                    <img src={formData.photo} alt="preview" className="photo-preview" />
                    <button 
                      type="button"
                      className="btn-remove-photo"
                      onClick={handleRemovePhoto}
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                ) : (
                  <label className="photo-input-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{display: 'none'}}
                    />
                    <div className="photo-placeholder">
                      <span className="photo-icon">📷</span>
                      <p>Selecciona una imagen para enviar</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <button type="submit" className="btn-order-submit">Enviar encargo</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default OrderModal;
