import React from 'react';
import './style.css';

export const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} Distribuidora Perros y Gatos. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

