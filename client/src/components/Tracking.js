// Componente para seguimiento de pedido con dirección y mapa en construcción
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Tracking = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Fetch details de order con token auth
    axios.get(`http://localhost:5000/api/orders/${orderId}/details`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => {
        setDetails(res.data);
        // Simula order info con dirección (de BD o original)
        setOrder({ id: orderId, status: 'En tránsito', address: 'Calle 123, Bogotá' });  // Ajusta con fetch real
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching order details:', err);
        setLoading(false);
      });
  }, [orderId, user]);

  if (loading) return <p className="text-center mt-5">Cargando seguimiento...</p>;

  if (!order) return <p className="text-center mt-3">Pedido no encontrado.</p>;

  return (
    <section id="tracking-view" className="container mt-5">
      <h2 className="text-center mb-4">BAKETRAK - Seguimiento de Pedido</h2>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => window.history.back()}>Volver a Historial de Pedidos</button>
      </div>
      <div className="accordion" id="trackingAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#trackingCollapse">
              Pedido #{order.id}
            </button>
          </h2>
          <div id="trackingCollapse" className="accordion-collapse collapse show">
            <div className="accordion-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Estado Actual</th>
                    <th>Dirección de Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{order.status}</td>
                    <td>{order.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h5>Mapa en Tiempo Real</h5>
        <div id="map" style={{ height: '400px', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>En construcción (por ejemplo, Google Maps)</p>
        </div>
      </div>
    </section>
  );
};

export default Tracking;