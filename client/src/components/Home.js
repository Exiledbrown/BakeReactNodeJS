// Componente para vista home/inicio con solo 3 productos (imágenes) y botón verde
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Preload imágenes específicas para asegurar carga (img2 incluida)
    const preloadImages = () => {
      const urls = [
        'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg',  // Img1
        'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg',  // Img2 - preload fuerte
        'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg'   // Img3
      ];
      urls.forEach(url => {
        const img = new Image();
        img.src = url;
        img.onload = () => console.log('Preloaded:', url);
        img.onerror = () => console.log('Failed preload:', url);
      });
    };
    preloadImages();  // Preload antes de fetch

    // Fetch productos de backend y filtra solo 3 primeros con imágenes
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        const productsWithImages = res.data.filter(product => product.image_url && product.image_url.trim() !== '');
        setProducts(productsWithImages.slice(0, 3));  // Solo los primeros 3
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-5">Cargando productos...</p>;

  return (
    <section className="container mt-5">
      <h2 className="text-center mb-4">Bienvenido a BAKETRAK</h2>
      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card">
              <img 
                src={product.image_url} 
                className="card-img-top card-img-uniform" 
                alt={product.name} 
                onError={(e) => { 
                  e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';  // Fallback fuerte para img2
                  console.log('Fallback applied for:', product.name);
                }} 
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text fw-bold">${product.price.toLocaleString()}</p>
                <button className="btn btn-success-custom">Agregar al Carrito</button>  {/* Verde #27A645 */}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isLoggedIn && (
        <div className="text-center mt-3">
          <Link to="/history" className="btn btn-success-custom mt-3">Ver Historial de Pedidos</Link>  {/* Verde #27A645 */}
        </div>
      )}
    </section>
  );
};

export default Home;