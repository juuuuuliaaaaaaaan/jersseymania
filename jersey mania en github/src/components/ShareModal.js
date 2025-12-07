import React, { useState } from 'react';
import '../styles/shareModal.css';

function ShareModal({ onClose, currentUser }) {
  const [showDiscounts, setShowDiscounts] = useState(false);

  const getShareUrl = () => {
    const base = window.location.origin + (process.env.PUBLIC_URL || '');
    return `${base}/?ref=${currentUser.inviteCode}`;
  };

  const copyCode = async () => {
    const code = currentUser.inviteCode;
    try {
      await navigator.clipboard.writeText(code);
      alert('Código copiado: ' + code);
    } catch (err) {
      prompt('Copia el código:', code);
    }
  };

  const shareLink = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: 'Jersey Mania', 
          text: `Únete a Jersey Mania con mi código: ${currentUser.inviteCode}`,
          url 
        });
      } catch (err) { /* usuario canceló */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Enlace copiado: ' + url);
      } catch (err) {
        prompt('Copia el enlace:', url);
      }
    }
  };

  return (
    <div className="share-modal-overlay">
      <div className="share-modal-content">
        <button className="share-modal-close" onClick={onClose}>×</button>

        <h2>Compartir enlace</h2>

        {!showDiscounts ? (
          <>
            <div className="share-modal-link">
              <p className="share-label">Tu código de referencia:</p>
              <div className="share-modal-code">{currentUser.inviteCode}</div>
            </div>

            <div className="share-modal-actions">
              <button onClick={copyCode} className="btn-share-primary">📋 Copiar código</button>
              <button onClick={shareLink} className="btn-share-primary">📤 Compartir enlace</button>
            </div>

            <button 
              onClick={() => setShowDiscounts(true)}
              className="btn-share-secondary"
            >
              💰 Ver Descuentos
            </button>
          </>
        ) : (
          <>
            <div className="share-modal-discounts">
              <h3>Cómo funciona</h3>
              <div className="discount-item">
                <strong>Invita 5 personas</strong>
                <p>Recibe <span className="discount-badge">5% de descuento</span> en todos los productos</p>
              </div>
              <div className="discount-item">
                <strong>Invita 10 personas</strong>
                <p>Recibe <span className="discount-badge">10% de descuento</span> en todos los productos</p>
              </div>
              <div className="discount-note">
                <p>✓ Descuento aplicado automáticamente en todos tus pedidos</p>
                <p>✓ Se muestra en el precio de cada producto</p>
                <p>✓ Se incluye en el mensaje de WhatsApp</p>
              </div>
            </div>

            <button 
              onClick={() => setShowDiscounts(false)}
              className="btn-share-secondary"
            >
              ← Volver
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ShareModal;
