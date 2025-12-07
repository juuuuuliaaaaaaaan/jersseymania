import React from 'react';
import ProductCard from './ProductCard';

function Section({ id, title, products, currentUser }) {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      <div className="product-list">
        {products && products.length > 0 ? (
          products.map(p => <ProductCard key={p.id} product={p} currentUser={currentUser} />)
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
      </div>
    </section>
  );
}

export default Section;
