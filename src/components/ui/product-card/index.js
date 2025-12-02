import React from 'react';
import './style.css';
import { Button } from '../index';
import { formatPrice, formatWeight } from '../../../utils/validation';
import { useContext } from 'react';
import CartContext from '../../../modules/cart/context/CartContext';

// Componente de calificación por estrellas
const StarRating = ({ rating = 0, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating" role="img" aria-label={`Calificación: ${rating} de ${maxStars} estrellas`}>
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="star star-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      {hasHalfStar && (
        <svg className="star star-half" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="#FBBF24"/>
              <stop offset="50%" stopColor="#E5E7EB"/>
            </linearGradient>
          </defs>
          <path fill="url(#half-grad)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="star star-empty" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span className="rating-text">({rating.toFixed(1)})</span>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  
  // Generar calificación aleatoria si no existe (entre 3.5 y 5)
  const rating = product.rating || (Math.random() * 1.5 + 3.5);
  
  // Calcular descuento si existe precio original
  const hasDiscount = product.precio_original && product.precio_original > product.precio;
  const discountPercent = hasDiscount 
    ? Math.round(((product.precio_original - product.precio) / product.precio_original) * 100)
    : 0;

  // try to get cart add function from CartContext (optional)
  const ctx = useContext(CartContext);
  const addFromCtx = ctx?.addItem ?? null;

  const handleAdd = () => {
    if (onAddToCart) return onAddToCart(product);
    if (addFromCtx) return addFromCtx(product, 1);
    console.warn('Add to cart not available: provide onAddToCart or wrap app with CartProvider');
  };

  return (
    <div className="cc-product-card" role="article" aria-label={product.nombre}>
      <div className="cc-product-image">
        {(() => {
          // Determine raw image path: prefer explicit imagenUrl, then first element of imagenes array, then imagenes string
          let raw = null;
          if (product.imagenUrl) raw = product.imagenUrl;
          else if (Array.isArray(product.imagenes) && product.imagenes.length > 0) {
            const first = product.imagenes[0];
            raw = first?.imagen_url || first?.url || first || null;
          } else if (typeof product.imagenes === 'string') {
            raw = product.imagenes;
          }

          if (raw && typeof raw === 'string') {
            // Remove duplicated '/app/app/' -> '/app/' (covers the reported case)
            const cleaned = raw.replace('/app/app/', '/app/');
            const src = cleaned.startsWith('http') ? cleaned : `http://localhost:8000${cleaned}`;
            return (
              <>
                <img src={src} alt={product.nombre} loading="lazy" />
                {isOutOfStock && <div className="cc-product-overlay">Sin existencias</div>}
              </>
            );
          }

          return (
            <>
              <img src={'/hola-product.png'} alt={product.nombre} loading="lazy" />
              {isOutOfStock && <div className="cc-product-overlay">Sin existencias</div>}
            </>
          );
        })()}
        
        {/* Badges */}
        <div className="cc-product-badges">
          {hasDiscount && (
            <span className="badge badge-discount">-{discountPercent}%</span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="badge badge-low-stock">¡Últimas unidades!</span>
          )}
          {product.nuevo && (
            <span className="badge badge-new">Nuevo</span>
          )}
        </div>
      </div>
      
      <div className="cc-product-body">
        <h3 className="cc-product-name">{product.nombre}</h3>
        
        {/* Rating */}
        <StarRating rating={rating} />
        
        {/* Precio */}
        <div className="cc-product-price-container">
          {hasDiscount && (
            <span className="cc-product-price-original">{formatPrice(product.precio_original)}</span>
          )}
          <p className="cc-product-price">{formatPrice(product.precio)}</p>
        </div>
        
        <div className="cc-product-info">
          <div className="info-item">
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="cc-product-weight">{formatWeight(product.peso)}</span>
          </div>
          
          <div className="info-item">
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9M14 3v4M6 21V10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11M3 21h18"/>
            </svg>
            <span className={`cc-product-stock ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : ''}`}>
              {isOutOfStock ? 'Sin stock' : `${product.stock} disponibles`}
            </span>
          </div>
        </div>
        
        <div className="cc-product-actions">
          <Button 
            variant="primary" 
            size="small" 
            disabled={isOutOfStock} 
            onClick={handleAdd}
            className="add-to-cart-btn"
          >
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span>Agregar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
