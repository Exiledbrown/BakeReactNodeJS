// Componente para historial de pedidos con 4 pedidos, anulación y track
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OrderHistory = () => {
  const { user } = useAuth();  // Obtiene username de AuthContext (de BD)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelConfirm, setCancelConfirm] = useState(null);  // Para confirm anulación

  useEffect(() => {
    if (!user) return;
    // Fetch orders con token auth (limita a 4 como original)
    axios.get('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${user.token}` }  // Backticks para template literal
    })
      .then(res => {
        const limitedOrders = res.data.slice(0, 4);  // Solo 4 pedidos
        setOrders(limitedOrders);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p className="text-center mt-5">Cargando historial...</p>;

  // Detalles por order ID (migrado de original, estados como especificado)
  const getOrderDetails = (orderId) => {
    const details = {
      1: [  // Pedido #100 (Entregado)
        { num: 1, name: 'Pan Artesanal', qty: 2, track: 'TRK100', price: 5000, status: 'Entregado' },
        { num: 2, name: 'Pastel de Chocolate', qty: 1, track: 'TRK100', price: 15000, status: 'Entregado' },
        { num: 3, name: 'Pan Integral', qty: 3, track: 'TRK100', price: 8000, status: 'Entregado' }
      ],
      2: [  // Pedido #101 (En tránsito)
        { num: 1, name: 'Croissant', qty: 4, track: 'TRK101', price: 6000, status: 'En tránsito' },
        { num: 2, name: 'Tarta de Fresa', qty: 2, track: 'TRK101', price: 12000, status: 'En tránsito' },
        { num: 3, name: 'Jugo Natural', qty: 2, track: 'TRK101', price: 4000, status: 'En tránsito' },
        { num: 4, name: 'Creppe de Nutella', qty: 1, track: 'TRK101', price: 10000, status: 'En tránsito' }
      ],
      3: [  // Pedido #102 (En preparación)
        { num: 1, name: 'Waffle con Frutas', qty: 2, track: 'TRK102', price: 9000, status: 'En preparación' },
        { num: 2, name: 'Batido', qty: 2, track: 'TRK102', price: 5000, status: 'En preparación' },
        { num: 3, name: 'Cupcake Vainilla', qty: 3, track: 'TRK102', price: 3000, status: 'En preparación' }
      ],
      4: [  // Pedido #103 (Cancelado)
        { num: 1, name: 'Creppe Salado', qty: 2, track: 'TRK103', price: 7000, status: 'Cancelado' },
        { num: 2, name: 'Galleta Integral', qty: 5, track: 'TRK103', price: 2000, status: 'Cancelado' },
        { num: 3, name: 'Smoothie', qty: 2, track: 'TRK103', price: 6000, status: 'Cancelado' }
      ]
    };
    return details[orderId] || [];
  };

  const canCancel = (status) => status !== 'Entregado' && status !== 'Cancelado';  // Solo anular si no entregado/cancelado

  const handleCancelConfirm = (orderId) => setCancelConfirm(orderId);

  const handleCancelOrder = (orderId) => {
    alert(`Pedido #${orderId} anulado.`);  // Simula (POST a API en real)
    setCancelConfirm(null);
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'Cancelado' } : order));
  };

  const handleHideCancel = () => setCancelConfirm(null);

  return (
    <section id="history-view" className="container mt-5">
      <h2 className="text-center mb-4">Tu Historial de Pedidos: {user?.username || 'Usuario'}</h2>  {/* Título personalizado con username de BD */}
      <div className="accordion" id="orderHistoryAccordion">
        {orders.map(order => {
          const orderDetails = getOrderDetails(order.id);  // Detalles por ID
          return (
            <div key={order.id} className="accordion-item">
              <h2 className="accordion-header" id={`heading${order.id}`}>
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${order.id}`} aria-expanded="false" aria-controls={`collapse${order.id}`}>
                  Pedido #{order.id}
                </button>
              </h2>
              <div id={`collapse${order.id}`} className="accordion-collapse collapse" aria-labelledby={`heading${order.id}`} data-bs-parent="#orderHistoryAccordion">
                <div className="accordion-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Número de Producto</th>
                        <th>Nombre del Producto</th>
                        <th>Cantidad</th>
                        <th>Número de Seguimiento</th>
                        <th>Precio</th>
                        <th>Estado Actual</th>
                        <th>Anulación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.map(detail => (
                        <tr key={detail.num}>
                          <td>{detail.num}</td>
                          <td>{detail.name}</td>
                          <td>{detail.qty}</td>
                          <td><Link to={`/tracking/${order.id}`}>{detail.track}</Link></td>  {/* Link a tracking */}
                          <td>${detail.price.toLocaleString()}</td>
                          <td>{detail.status}</td>
                          <td>
                            {canCancel(detail.status) ? (
                              <>
                                <button className="btn btn-danger btn-sm" onClick={() => handleCancelConfirm(order.id)}>Anular</button>
                                {cancelConfirm === order.id && (
                                  <div className="mt-2">
                                    <p>¿Estás seguro?</p>
                                    <button className="btn btn-danger btn-sm me-2" onClick={() => handleCancelOrder(order.id)}>Sí</button>
                                    <button className="btn btn-secondary btn-sm" onClick={handleHideCancel}>No</button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <button className="btn btn-danger btn-sm" disabled>Anular</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OrderHistory;