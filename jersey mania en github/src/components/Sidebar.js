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
      {/* Header compacto: logo + nombre + menú extremo derecho */}
      <div className="sidebar-header-compact" style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1.5rem',
        justifyContent: 'space-between',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img
            src={process.env.PUBLIC_URL + '/images/logo.jpg'}
            alt="Logo"
            className="sidebar-logo-small"
            onClick={handleLogoClick}
          />
          <h1 className="sidebar-title-small" style={{ margin: 0 }}>Jerssey Mania</h1>
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={showCategories}
          onClick={() => setShowCategories(prev => !prev)}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            padding: 0
          }}
        >
          <img
            src={process.env.PUBLIC_URL + '/menu.svg'}
            alt="Menú"
            style={{ width: 28, height: 28, verticalAlign: 'middle' }}
          />
        </button>
      </div>
      {currentUser && <p className="sidebar-username-small">👤 {currentUser.username}</p>}

      {/* Selector de categorías + cajón */}
      <div className="sidebar-nav">
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
