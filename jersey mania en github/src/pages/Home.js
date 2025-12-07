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
    </div>
  );
}

export default Home;
