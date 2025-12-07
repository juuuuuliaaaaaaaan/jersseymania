import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import { productService } from '../services/productService';

function Home({ selected, currentUser }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categoryTitles = {
    futbol: 'Football',
    basket: 'Basketball',
    beisbol: 'Basseball'
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productService.getProductsByCategory(selected);
        console.log('Productos recibidos:', data);
        setProducts(data);
      } catch (err) {
        setError('Error al cargar productos');
        setProducts([]);
      }
      setLoading(false);
    };
    loadProducts();
  }, [selected]);

  return (
    <div className="main-content">
      {loading ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p style={{color:'red'}}>{error}</p>
      ) : (
        <Section 
          id={selected} 
          title={categoryTitles[selected]} 
          products={products}
          currentUser={currentUser}
        />
      )}
      {/* Iconos de redes sociales al final de la página */}
      <div className="main-footer-social">
        <a href="https://wa.me/5355792217" target="_blank" rel="noopener noreferrer" title="WhatsApp">
          <img src={process.env.PUBLIC_URL + '/whatsapp.svg'} alt="WhatsApp" className="footer-icon" />
        </a>
        <a href="https://www.facebook.com/profile.php?id=61578607190965" target="_blank" rel="noopener noreferrer" title="Facebook">
          <img src={process.env.PUBLIC_URL + '/facebook.svg'} alt="Facebook" className="footer-icon" />
        </a>
        <a href="https://www.instagram.com/jerseymania777?igsh=MW51NmFocTBmYmg5cA==" target="_blank" rel="noopener noreferrer" title="Instagram">
          <img src={process.env.PUBLIC_URL + '/instagram.svg'} alt="Instagram" className="footer-icon" />
        </a>
      </div>
    </div>
  );
}

export default Home;
