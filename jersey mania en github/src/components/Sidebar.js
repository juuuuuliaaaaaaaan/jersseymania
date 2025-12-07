import React, { useState, useRef, useEffect } from 'react';
import { userService } from '../services/userService';
import ShareModal from './ShareModal';
import OrderModal from './OrderModal';

function Sidebar({ selected, onSelect, onSecretAdmin, onRequireLogin }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [externalOrderProductId, setExternalOrderProductId] = useState(null);
  const currentUser = userService.getCurrentUser();

  // contador de clicks en logo para trigger secreto
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  useEffect(() => {
    const onOpenOrder = (e) => {
      // detalle con productId opcional
      setExternalOrderProductId(e && e.detail && e.detail.productId ? e.detail.productId : null);
      setShowOrderModal(true);
      // cerrar categories drawer si estaba abierto
      setShowCategories(false);
    };
    window.addEventListener('open-order-modal', onOpenOrder);
    return () => window.removeEventListener('open-order-modal', onOpenOrder);
  }, []);

  const handleLogoClick = () => {
    // incrementar contador
    clickCountRef.current += 1;
    // si primer click, iniciar timer de 5 segundos
    if (!clickTimerRef.current) {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }, 5000);
    }
    // si alcanza 7 clicks en el tiempo, activar trigger admin secreto
    if (clickCountRef.current >= 7) {
      clickCountRef.current = 0;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      if (typeof onSecretAdmin === 'function') onSecretAdmin();
    }
  };

  return (
    <aside className="sidebar">
      {/* Header compacto: logo + nombre */}
      <div className="sidebar-header-compact">
        <img
          src={process.env.PUBLIC_URL + '/images/logo.jpg'}
          alt="Logo"
          className="sidebar-logo-small"
          onClick={handleLogoClick} // click secreto
        />
        <h1 className="sidebar-title-small">Jerssey Mania</h1>
        {currentUser && <p className="sidebar-username-small">👤 {currentUser.username}</p>}
      </div>

      {/* Selector de categorías + cajón */}
      <div className="sidebar-nav">
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={showCategories}
          onClick={() => setShowCategories(prev => !prev)}
        >
          Categorías
        </button>

        <div className={`categories-drawer ${showCategories ? 'open' : ''}`} role="dialog" aria-hidden={!showCategories}>
          <div className="categories-row">
            <button
              className={`category-btn ${selected === 'futbol' ? 'active' : ''}`}
              onClick={() => { onSelect('futbol'); setShowCategories(false); }}
            >
              ⚽ Football
            </button>
            <button
              className={`category-btn ${selected === 'basket' ? 'active' : ''}`}
              onClick={() => { onSelect('basket'); setShowCategories(false); }}
            >
              🏀 Basketball
            </button>
          </div>
          <div className="categories-row">
            <button
              className={`category-btn ${selected === 'beisbol' ? 'active' : ''}`}
              onClick={() => { onSelect('beisbol'); setShowCategories(false); }}
            >
              ⚾ Basseball
            </button>
            <button
              className="category-btn order-btn"
              onClick={() => {
                if (currentUser) {
                  setShowOrderModal(true);
                } else if (typeof onRequireLogin === 'function') {
                  onRequireLogin();
                } else {
                  alert('Necesitas crear una cuenta para hacer encargos.');
                }
                setShowCategories(false);
              }}
            >
              📦 Encargo
            </button>
          </div>
        </div>
      </div>

      {/* Iconos de redes + enlace de código */}
      <div className="sidebar-footer">
        <a href="https://wa.me/5355792217" target="_blank" rel="noopener noreferrer" title="WhatsApp">
          <img src={process.env.PUBLIC_URL + '/whatsapp.svg'} alt="WhatsApp" className="footer-icon" />
        </a>
        <a href="https://www.facebook.com/profile.php?id=61578607190965" target="_blank" rel="noopener noreferrer" title="Facebook">
          <img src={process.env.PUBLIC_URL + '/facebook.svg'} alt="Facebook" className="footer-icon" />
        </a>
        <a href="https://www.instagram.com/jerseymania777?igsh=MW51NmFocTBmYmg5cA==" target="_blank" rel="noopener noreferrer" title="Instagram">
          <img src={process.env.PUBLIC_URL + '/instagram.svg'} alt="Instagram" className="footer-icon" />
        </a>
        {currentUser && (
          <button
            className="footer-icon-btn"
            onClick={() => setShowShareModal(true)}
            title="Compartir código"
          >
            <img src={process.env.PUBLIC_URL + '/enlace.svg'} alt="Compartir" className="footer-icon" />
          </button>
        )}
      </div>

      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} currentUser={currentUser} />
      )}

      {showOrderModal && (
        <OrderModal onClose={() => { setShowOrderModal(false); setExternalOrderProductId(null); }} onRequireLogin={onRequireLogin} productId={externalOrderProductId} />
      )}
    </aside>
  );
}

export default Sidebar;
