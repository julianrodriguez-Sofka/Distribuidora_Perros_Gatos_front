import React, { useState } from 'react';
import './style.css';
import { Button, StarRating } from '../index';
import { formatPrice, formatWeight } from '../../../utils/validation';
import { useContext } from 'react';
import CartContext from '../../../modules/cart/context/CartContext';
import { calificacionesService } from '../../../services/calificaciones-service';
import { toast } from '../../../utils/toast';

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock === 0;
  const [rating, setRating] = useState(product.promedio_calificacion || 0);
  const [totalRatings, setTotalRatings] = useState(product.total_calificaciones || 0);

  // try to get cart add function from CartContext (optional)
  const ctx = useContext(CartContext);
  const addFromCtx = ctx?.addItem ?? null;

  const handleAdd = () => {
    if (onAddToCart) return onAddToCart(product);
    if (addFromCtx) return addFromCtx(product, 1);
    console.warn('Add to cart not available: provide onAddToCart or wrap app with CartProvider');
  };

  const handleRate = async (newRating) => {
    try {
      await calificacionesService.crearCalificacion(product.id, newRating);
      
      // Actualizar el rating local optimísticamente
      const newTotal = totalRatings + 1;
      const newAverage = ((rating * totalRatings) + newRating) / newTotal;
      
      setRating(Math.round(newAverage * 10) / 10);
      setTotalRatings(newTotal);
      
      toast.success('¡Gracias por tu calificación!');
    } catch (error) {
      console.error('Error al calificar:', error);
      toast.error('Error al registrar tu calificación. Por favor intenta de nuevo.');
    }
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
      </div>
      <div className="cc-product-body">
        <h3 className="cc-product-name">{product.nombre}</h3>
        
        {/* Rating Section */}
        <div className="cc-product-rating">
          <StarRating
            rating={rating}
            totalRatings={totalRatings}
            interactive={true}
            onRate={handleRate}
            size="small"
            showCount={true}
          />
        </div>

        <p className="cc-product-price">{formatPrice(product.precio)}</p>
        <p className="cc-product-weight">{formatWeight(product.peso)}</p>
        <p className="cc-product-stock">{isOutOfStock ? 'Sin existencias' : `Disponible: ${product.stock} unidades`}</p>
        <div className="cc-product-actions">
          <Button variant="primary" size="small" disabled={isOutOfStock} onClick={handleAdd}>
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
