import React from 'react';
import './style.css';
import { Button } from '../ui';

const Hero = ({ title = 'Amor y cuidado para tu mascota', subtitle = 'Alimentos, accesorios y todo lo que necesita para su bienestar', imageUrl }) => {
  const hasImage = Boolean(imageUrl);

  return (
    <section className="site-hero" style={ hasImage ? { backgroundImage: `url(${imageUrl})` } : undefined }>
      <div className="site-hero-overlay">
        <div className="site-hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            <div className="hero-ctas">
              <a href="#destacados"><Button variant="primary" size="large">Ver Destacados</Button></a>
              <a href="/carrito" style={{ marginLeft: 12 }}><Button variant="ghost" size="large">Ir al carrito</Button></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
