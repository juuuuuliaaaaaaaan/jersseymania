import React, { useState, useEffect } from 'react';
import ProductDetail from './ProductDetail';
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

function ProductCard({ product, currentUser }) {
  const [showDetail, setShowDetail] = useState(false);
  const [imageBroken, setImageBroken] = useState(false);
  const discountPercent = product.discountPercent || 0;
  const discountExpires = product.discountExpires ? new Date(product.discountExpires) : null;
  const [remaining, setRemaining] = useState(discountExpires ? discountExpires - Date.now() : 0);

  useEffect(() => {
    let t;
    if (discountExpires) {
      t = setInterval(() => {
        const rem = discountExpires - Date.now();
        setRemaining(rem);
      }, 1000);
    }
    return () => clearInterval(t);
  }, [product.discountExpires]);

  const activeDiscount = discountPercent > 0 && discountExpires && (new Date() < discountExpires);
  const discount = currentUser ? userService.getDiscountPercent(currentUser) : 0; // referral discount if any
  // combine discounts: admin discount first, then referral discount applied on discounted price
  let finalPrice = product.price;
  if (activeDiscount) finalPrice = finalPrice * (1 - discountPercent/100);
  if (discount > 0) finalPrice = finalPrice * (1 - discount/100);
  // redondear hacia arriba al entero más cercano
  const displayFinal = String(Math.ceil(finalPrice));
  
  // --- aplicar límites de tallas según categoría (mismo criterio que en ProductDetail) ---
  const sizeOrder = ['XS','S','M','L','XL','XXL'];
  const idxOf = (s) => {
    if (!s) return -1;
    const u = String(s).trim().toUpperCase();
    return sizeOrder.indexOf(u);
  };
  const categoryKey = (product.category || product.cat || '').toString().toLowerCase();
  // detección robusta de productos infantiles (name/subcategory/tags/flag)
  const textToScan = [
    product.name,
    product.subcategory,
    Array.isArray(product.tags) ? product.tags.join(' ') : '',
    product.description
  ].filter(Boolean).join(' ').toLowerCase();
  const kidsKeywords = ['niño','niños','nino','ninos','kid','kids','children','child','juego','juegos','infantil','infante'];
  const hasKidsKeyword = kidsKeywords.some(k => textToScan.includes(k));
  const isKidsFutbol = categoryKey === 'futbol' && (product.kids === true || hasKidsKeyword);
  const kidsSizes = Array.from({ length: 12 }, (_, i) => String(i + 3)); // '3'..'14'
 
   let visibleSizes = Array.isArray(product.sizes) ? product.sizes.slice() : [];
   if (visibleSizes.length > 0) {
     const maxIdx = idxOf('XL');
     const minBeisbolIdx = idxOf('L');
     visibleSizes = visibleSizes.filter(sz => {
      if (isKidsFutbol) {
        const n = parseInt(String(sz).replace(/\D/g, ''), 10);
        return !Number.isNaN(n) && n >= 3 && n <= 14;
      }
       const i = idxOf(sz);
       if (i === -1) return true; // mantener tallas no reconocidas
       if (categoryKey === 'basket') return i <= idxOf('L');
       if (categoryKey === 'beisbol') return i >= minBeisbolIdx && i <= maxIdx;
       if (categoryKey === 'futbol') return i >= idxOf('S') && i <= maxIdx; // fútbol: S..XL
       return i <= maxIdx; // resto: máximo XL
     });
   }
   
  return (
    <>
      <div className="product-card" onClick={() => setShowDetail(true)} style={{ cursor: 'pointer' }}>
        {/* renderizamos la imagen solo si hay URL y no falló la carga */}
        {product.images && product.images[0] && !imageBroken ? (
          <div className="product-image-wrapper">
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-image"
              onError={() => setImageBroken(true)}
            />
          </div>
        ) : null}
        
        {/* nombre pequeño debajo de la imagen */}
        <div className="product-title" aria-hidden="false">{product.name}</div>
        
        {/* mostrar precio solo si hay disponibilidad (tras aplicar filtros de talla) */}
        {(!visibleSizes || visibleSizes.length === 0) ? (
          <div className="sold-out">Agotado</div>
        ) : (
            (activeDiscount ? (
              <div className="price"><del>${product.price}</del> <strong>${displayFinal} USD</strong></div>
            ) : discount > 0 ? (
              <div className="price"><del>${product.price}</del> <strong>${String(Math.ceil(product.price * (1 - discount/100)))} USD</strong></div>
            ) : (
              <div className="price"><strong>${displayFinal} USD</strong></div>
            ))
         )}
      </div>

      {showDetail && (
        <ProductDetail product={product} onClose={() => setShowDetail(false)} currentUser={currentUser} />
      )}
    </>
  );
}

export default ProductCard;
