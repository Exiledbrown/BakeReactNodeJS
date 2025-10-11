// Componente para vista acerca de nosotros (migrado de HTML original)
import React from 'react';

const About = () => {
  return (
    <section id="about-view" className="container mt-5">
      <h2 className="text-center mb-4">Acerca de Nosotros</h2>  
      <div className="card">
        <div className="card-body">
          <p>BakeTrak es una aplicación para gestionar pedidos de clientes, repartidores y administradores.</p>
          <p>Nuestra historia: Fundada en 2025, nos dedicamos a la panadería artesanal con entregas rápidas.</p>
          <p>desarrollado por: Sandra Marcela Lopera, Yohan Racinez, Jhonnier Medina</p>  
          <p>Contáctenos: WhatsApp +57 312 456 7890 o redes sociales.</p>
        </div>
      </div>
    </section>
  );
};

export default About;