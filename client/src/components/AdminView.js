// Componente para vista administrador con tabla de pedidos filtrable y acciones
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AdminView = () => {
  const { user } = useAuth();  // Obtiene username y role de AuthContext (de BD)
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);  useEffect(() => {
    if (!user) return;
    // Fetch all orders con token auth (admin ve todo)
    axios.get('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${user.token}` }  // Backticks para template literal
    })
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [user]);  const filteredOrders = orders.filter(order => 
    filter === 'Todos' || order.status === filter
  );  const handleAssignDelivery = (orderId) => {
    alert(`Repartidor asignado a pedido #${orderId}`);  // Simula (PUT a API)
  };  const handleCancelOrder = (orderId) => {
    alert(`Pedido #${orderId} cancelado.`);  // Simula (PUT a API)
  };  if (loading) return <p className="text-center mt-5">Cargando pedidos...</p>;  return (
    <section id="administrador-view" className="container mt-5 hero">
      <h2 className="text-center mb-4">Bienvenido {user?.username} ({user?.role})</h2>  {/* Título con username y role de BD, sin paréntesis en username */}
      <div className="mb-3">
        <label htmlFor="filter-admin" className="form-label">Filtrar Pedidos:</label>
        <select className="form-select" id="filter-admin" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>Todos</option>
          <option>Pendientes</option>
          <option>En reparto</option>
          <option>Entregados</option>
        </select>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>Usuario {order.user_id}</td>
              <td>{order.status}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleAssignDelivery(order.id)}>Asignar Repartidor</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleCancelOrder(order.id)}>Cancelar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredOrders.length === 0 && <p className="text-center mt-3">No hay pedidos.</p>}
    </section>
  );
};

export default AdminView;