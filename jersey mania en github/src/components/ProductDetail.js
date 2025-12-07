import React, { useState, useEffect } from 'react';
import defaultProducts from '../data/products';
import { userService } from '../services/userService';

function formatRemaining(ms) {
  if (ms <= 0) return '00:00:00';
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return (days > 0 ? `${days}d ` : '') + `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

function ProductDetail({ product, onClose, currentUser }) {
  // obtener imágenes fiables: si product.images tiene < 4 elementos, intentar fallback por id
  const sourceImages = (() => {
    const imgs = Array.isArray(product.images) ? product.images : [];
    // permitir hasta 4 imágenes; si faltan, intentar fallback y truncar a 4
    const fallback = defaultProducts.find(p => p.id === product.id);
    const fb = (fallback && Array.isArray(fallback.images)) ? fallback.images : [];
    const combined = imgs.length ? imgs.slice(0,4) : fb.slice(0,4);
    return combined;
  })();

  // seleccionar la primera imagen como principal (si hay >0)
  const [selectedImage, setSelectedImage] = useState(sourceImages[0] || '');
  const [mainImageBroken, setMainImageBroken] = useState(false);

  // --- lógica de tallas por categoría ---
  // orden conocido de tallas para comparar rangos
  const sizeOrder = ['XS','S','M','L','XL','XXL'];
  const idxOf = (s) => {
    if (!s) return -1;
    const u = String(s).trim().toUpperCase();
    return sizeOrder.indexOf(u);
  };
  const categoryKey = (product.category || product.cat || '').toString().toLowerCase(); // asumir propiedad category en product
  // Detección robusta de "kids": buscar pistas en varios campos (nombre, subcategory, tags, kids flag)
  const textToScan = [
    product.name,
    product.subcategory,
    product.description,
    Array.isArray(product.tags) ? product.tags.join(' ') : ''
  ].filter(Boolean).join(' ').toLowerCase();
  const kidsKeywords = ['niño','niños','nino','ninos','kid','kids','children','child','juego','juegos','infantil','infante'];
  const hasKidsKeyword = kidsKeywords.some(k => textToScan.includes(k));
  const isKidsFutbol = categoryKey === 'futbol' && (product.kids === true || hasKidsKeyword);

  // tallas numéricas para niños: 3..14 (strings)
  const kidsSizes = Array.from({ length: 12 }, (_, i) => String(i + 3)); // ['3','4',...,'14']

  // construir lista visible según restricciones (incluye caso kids)
  let visibleSizes = Array.isArray(product.sizes) ? product.sizes.slice() : [];
  if (visibleSizes.length > 0) {
    const maxIdx = idxOf('XL');
    const minBeisbolIdx = idxOf('L');
    visibleSizes = visibleSizes.filter(sz => {
      if (isKidsFutbol) {
        // aceptar solo tallas numéricas entre 3 y 14 (soporta '10' o '10Y' etc.)
        const n = parseInt(String(sz).replace(/\D/g, ''), 10);
        return !Number.isNaN(n) && n >= 3 && n <= 14;
      }
      const i = idxOf(sz);
      if (i === -1) return true; // tallas no reconocidas se mantienen (fallback)
      if (categoryKey === 'basket') return i <= idxOf('L');
      if (categoryKey === 'beisbol') return i >= minBeisbolIdx && i <= maxIdx;
      if (categoryKey === 'futbol') return i >= idxOf('S') && i <= maxIdx; // fútbol: S..XL
      return i <= maxIdx; // por defecto: máximo XL
    });
  }

  // tallas por defecto cuando product.sizes está vacío (se usan en el formulario de encargo)
  const defaultSizesByCategory = {
    futbol: ['S','M','L','XL'],
    basket: ['S','M','L'],
    beisbol: ['L','XL']
  };
  const fallbackSizes = isKidsFutbol ? kidsSizes : (defaultSizesByCategory[categoryKey] || ['S','M','L','XL']);

  const [selectedSize, setSelectedSize] = useState(visibleSizes[0] || (product.sizes && product.sizes[0]) || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'order' o null
  const [showOrderForm, setShowOrderForm] = useState(false); // formulario para encargos (agotado)
  const [orderSize, setOrderSize] = useState(visibleSizes[0] || (product.sizes && product.sizes[0]) || fallbackSizes[0] || ''); // talla elegida en formulario

  // Lightbox: mostrar imagen grande completa
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

  const discount = currentUser ? userService.getDiscountPercent(currentUser) : 0;
  const price = product.price || 0;
  const adminDiscount = product.discountPercent || 0;
  const discountExpires = product.discountExpires ? new Date(product.discountExpires) : null;
  const [remaining, setRemaining] = useState(discountExpires ? discountExpires - Date.now() : 0);

  useEffect(() => {
    let t;
    if (discountExpires) {
      t = setInterval(() => setRemaining(discountExpires - Date.now()), 1000);
    }
    return () => clearInterval(t);
  }, [product.discountExpires]);

  const adminActive = adminDiscount > 0 && discountExpires && (new Date() < discountExpires);
  let finalPrice = price;
  if (adminActive) finalPrice = finalPrice * (1 - adminDiscount/100);
  if (discount > 0) finalPrice = finalPrice * (1 - discount/100);
  // redondear hacia arriba al entero más cercano
  const displayFinal = String(Math.ceil(finalPrice));

  const whatsappNumber = '5355792217';
  const discountLabel = discount > 0 ? ` Descuento ${discount}%` : '';
  const userName = currentUser ? ` (Usuario: ${currentUser.username})` : '';
  const message = encodeURIComponent(`Me interesa esta: ${product.name} (Talla: ${selectedSize}). Precio: $${displayFinal}.${discountLabel}${userName}`);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  const handleEncargar = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    // si está agotado (sin tallas disponibles), abrir formulario con datos del producto
    if (!product.sizes || product.sizes.length === 0) {
      // si no hay tallas conocidas, inicializar orderSize con la primera talla por defecto según categoría
      setOrderSize(fallbackSizes[0] || '');
      setShowOrderForm(true);
      return;
    }
    // si hay tallas (no agotado), usar el flujo de confirmación habitual
    setConfirmAction('order');
  };

  const confirmOrder = () => {
    // Si se confirmó desde el confirmAction (producto en stock), disparar evento sin talla extra
    try {
      window.dispatchEvent(new CustomEvent('open-order-modal', { detail: { productId: product.id } }));
    } catch (err) {
      window.open(whatsappLink, '_blank');
    }
    if (typeof onClose === 'function') onClose();
    setConfirmAction(null);
  };

  const submitOrderForm = () => {
    // validar que exista una talla seleccionada/indicada
    if (!orderSize || orderSize.trim() === '') {
      alert('Por favor selecciona o indica la talla para el encargo.');
      return;
    }
    // enviar evento con datos del producto y la talla elegida
    try {
      window.dispatchEvent(new CustomEvent('open-order-modal', {
        detail: {
          productId: product.id,
          productName: product.name,
          price: displayFinal,
          size: orderSize,
          image: sourceImages[0] || ''
        }
      }));
    } catch (err) {
      // fallback: abrir WhatsApp con mensaje incluyendo la talla
      const msg = encodeURIComponent(`Quiero encargar: ${product.name} - Talla: ${orderSize} - Precio estimado: $${displayFinal}`);
      window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    }
    // cerrar formulario y detalle
    setShowOrderForm(false);
    if (typeof onClose === 'function') onClose();
  };

  // miniaturas: todas las imágenes excepto la principal (si existen)
  const thumbs = sourceImages.slice(1); // puede ser [] si no hay más imágenes

  // abrir lightbox con una imagen
  const openLightbox = (img) => {
    setLightboxImage(img);
    setShowLightbox(true);
  };

  // cerrar con Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        {/* mostrar imagen principal SOLO si existe y no se rompió al cargar */}
        {sourceImages.length > 0 && selectedImage && !mainImageBroken && (
          <img
            src={selectedImage}
            alt={product.name}
            className="detail-main-image"
            style={{ cursor: 'zoom-in' }}
            onClick={() => openLightbox(selectedImage)}
            onError={(e) => {
              // ocultar imagen principal si falla la carga
              setMainImageBroken(true);
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        {/* thumbnails solo si hay más imágenes */}
        {thumbs && thumbs.length > 0 && (
          <div className="detail-thumbnails">
            {thumbs.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} thumb ${idx + 2}`}
                className={selectedImage === img ? 'thumb selected' : 'thumb'}
                onClick={() => { setSelectedImage(img); openLightbox(img); }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ))}
          </div>
        )}
        {showLightbox && (
          <div className="lightbox-overlay" onClick={() => setShowLightbox(false)}>
            <div className="lightbox-content" onClick={(e)=>e.stopPropagation()}>
              <button className="lightbox-close" aria-label="Cerrar" onClick={() => setShowLightbox(false)}>×</button>
              <img src={lightboxImage} alt={product.name} className="lightbox-image" />
            </div>
          </div>
        )}
        <h2>{product.name}</h2>
        {adminActive ? (
          <p>Precio: <del>${price}</del> <strong>${displayFinal}</strong> <span style={{color:'#ff6f3c'}}>{adminDiscount}% off</span> {remaining>0 && <small> · Termina en {formatRemaining(remaining)}</small>}</p>
        ) : discount > 0 ? (
          <p>Precio: <del>${price}</del> <strong>${String(Math.ceil(price*(1-discount/100)))}</strong> <span style={{color:'#ff6f3c'}}>{discount}% off</span></p>
        ) : (
          <p>Precio: ${price} USD</p>
        )}
        {/* tallas o estado agotado (aplicando restricciones por categoría) */}
        <div className="sizes">
          {(!visibleSizes || visibleSizes.length === 0) ? (
            <div className="sold-out detail-sold-out">Agotado</div>
          ) : (
            <>
              <span>Selecciona talla:</span>
              {visibleSizes.map(size => (
                <button
                  key={size}
                  className={selectedSize === size ? 'size-btn selected' : 'size-btn'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </>
          )}
        </div>
        {/* Botón único: Encargar (siempre visible) */}
        <button
          type="button"
          className="whatsapp-btn"
          onClick={handleEncargar}
        >
          Encargar
        </button>

        {/* Modal de confirmación: Encargar (producto en stock) */}
        {confirmAction === 'order' && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <p>¿Está seguro que quiere encargar este producto?</p>
              <div className="confirm-actions">
                <button className="confirm-btn yes" onClick={confirmOrder}>Sí</button>
                <button className="confirm-btn no" onClick={() => setConfirmAction(null)}>No</button>
              </div>
            </div>
          </div>
        )}

        {/* Order form para productos agotados: muestra datos y permite seleccionar SOLO la talla */}
        {showOrderForm && (
          <div className="confirm-overlay">
            <div className="confirm-modal" style={{maxWidth: 540}}>
              <div style={{display:'flex', gap:16, alignItems:'center'}}>
                {sourceImages[0] ? <img src={sourceImages[0]} alt={product.name} style={{width:90,height:90,objectFit:'cover',borderRadius:8}}/> : null}
                <div style={{textAlign:'left'}}>
                  <strong>{product.name}</strong>
                  <div style={{marginTop:6,color:'#6b7280'}}>Precio estimado: ${displayFinal}</div>
                </div>
              </div>
              <div style={{marginTop:12, textAlign:'left'}}>
                <label style={{fontWeight:700, marginBottom:6, display:'block'}}>Selecciona talla:</label>
                {product.sizes && product.sizes.length > 0 ? (
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    {visibleSizes.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setOrderSize(sz)}
                        style={{
                          padding:'8px 12px',
                          borderRadius:8,
                          border: orderSize === sz ? '2px solid #ff6f3c' : '1px solid #e6eef6',
                          background: orderSize === sz ? '#fff7f2' : '#fff',
                          cursor:'pointer',
                          fontWeight:600
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                ) : (
                  // si no hay tallas registradas, permitir entrada libre o selección común
                  <select value={orderSize} onChange={(e)=>setOrderSize(e.target.value)} style={{padding:'8px 10px', borderRadius:8, width:'100%'}}>
                    <option value="">Selecciona una talla</option>
                    {fallbackSizes.map(sz => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="confirm-actions" style={{marginTop:14}}>
                <button className="confirm-btn yes" onClick={submitOrderForm}>Enviar encargo</button>
                <button className="confirm-btn no" onClick={() => { setShowOrderForm(false); setOrderSize(''); }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
