// Componente para vista repartidor con pedidos filtrables y acciones
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DeliveryView = () => {
  const { user } = useAuth();  // Obtiene username y role de AuthContext (de BD)
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);  useEffect(() => {
    if (!user) return;
    // Fetch orders con token auth (filtra pendientes/en tránsito para repartidor)
    axios.get('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${user.token}` }  // Backticks para template literal
    })
      .then(res => {
        const deliveryOrders = res.data.filter(order => order.status === 'Pendiente' || order.status === 'En reparto');
        setOrders(deliveryOrders);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [user]);  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(filter) || order.address.toLowerCase().includes(filter.toLowerCase())
  );  if (loading) return <p className="text-center mt-5">Cargando pedidos...</p>;  const handleValidateDelivery = (orderId) => {
    alert(`Entrega validada para pedido #${orderId}`);  // Simula (PUT a API en real)
  };  return (
    <section id="repartidor-view" className="container mt-5 hero">
      <h2 className="text-center mb-4">Bienvenido {user?.username} ({user?.role})</h2>  {/* Título con username y role de BD, sin paréntesis en username */}
      <div className="mb-3">
        <label htmlFor="filter-repartidor" className="form-label">Filtrar Pedidos:</label>
        <input 
          type="text" 
          className="form-control" 
          id="filter-repartidor" 
          placeholder="Filtrar por ID o dirección"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ul className="list-group">
        {filteredOrders.map(order => (
          <li key={order.id} className="list-group-item">
            <h5>Pedido #{order.id}</h5>
            <p>Cliente: Usuario {order.user_id}<br />Dirección: {order.address}<br />Estado: {order.status}</p>
            <button className="btn btn-primary btn-sm me-2" onClick={() => alert(`Detalles de #${order.id}`)}>Ver Detalles</button>
            <button className="btn btn-success btn-sm" onClick={() => handleValidateDelivery(order.id)}>Validar Entrega</button>
          </li>
        ))}
      </ul>
      {filteredOrders.length === 0 && <p className="text-center mt-3">No hay pedidos para repartir.</p>}
    </section>
  );
};

export default DeliveryView;