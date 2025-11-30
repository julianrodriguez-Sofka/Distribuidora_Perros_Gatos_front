import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/use-cart';
import CartContext from '../../modules/cart/context/CartContext';
import { useAuth } from '../../hooks/use-auth';
import { Button, Input } from '../../components/ui/index';
import { formatPrice } from '../../utils/validation';
import { toast } from '../../utils/toast';
import { pedidosService } from '../../services/pedidos-service';
import { CheckoutForm } from './components/CheckoutForm';
import './style.css';

export const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  // Prefer the new CartContext if available, otherwise fall back to legacy useCart
  // Call hooks unconditionally to satisfy React rules of hooks
  const legacy = useCart();
  const ctx = useContext(CartContext);

  let cart, itemCount, subtotal, shipping, total, updateQuantity, removeFromCart, clearCart;
  if (ctx) {
    cart = ctx.items;
    itemCount = ctx.itemCount;
    subtotal = ctx.subtotal;
    shipping = ctx.shipping;
    total = ctx.total;
    updateQuantity = ctx.updateQuantity;
    removeFromCart = ctx.removeItem;
    clearCart = ctx.clear;
  } else {
    cart = legacy.cart;
    itemCount = legacy.itemCount;
    subtotal = legacy.subtotal || 0;
    shipping = legacy.shipping || 0;
    total = legacy.total;
    updateQuantity = legacy.updateQuantity;
    removeFromCart = legacy.removeFromCart;
    clearCart = legacy.clearCart;
  }
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (Number.isNaN(quantity)) return;
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };
  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión o registrarte para continuar con la compra.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (cart.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setShowCheckoutForm(true);
  };

  const handleCheckoutSubmit = async (formData) => {
    setIsProcessing(true);
    try {
      const orderData = {
        usuario_id: user.id,
        direccion_entrega: formData.direccion_entrega,
        telefono_contacto: formData.telefono_contacto,
        metodo_pago: formData.metodo_pago,
        nota_especial: formData.nota_especial || '',
        items: cart.map(item => ({
          producto_id: item.id,
          cantidad: item.quantity ?? item.cantidad ?? 1,
          precio_unitario: item.precio,
        })),
      };

      await pedidosService.createOrder(orderData);
      clearCart();
      setShowCheckoutForm(false);
      toast.success('¡Pedido creado exitosamente! Pronto recibirás la confirmación.');
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      if (!error?._toastsShown) toast.error('Error al procesar el pedido');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckoutCancel = () => {
    setShowCheckoutForm(false);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el catálogo</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Ver Catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Carrito de Compras</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={(() => {
                  console.log('Item image data:', item);
                  const raw = item.imagenUrl || item.imagenes[0] || (Array.isArray(item.imagenes) && item.imagenes[0]?.imagen_url) || null;
                  if (!raw) return '/placeholder-produssct.png';
                  const cleaned = raw.replace('/app/app/', '/app/');
                  return cleaned.startsWith('http') ? cleaned : `http://localhost:8000${cleaned}`;
                })()}
                alt={item.nombre}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.nombre}</h3>
                <p className="cart-item-price">{formatPrice(item.precio)}</p>
              </div>
              <div className="cart-item-quantity">
                <Input
                  type="number"
                  min="1"
                  max={item.stock ?? item.stock}
                  value={item.quantity ?? item.cantidad}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="cart-quantity-input"
                />
              </div>
              <div className="cart-item-total">
                {formatPrice((item.precio || 0) * (item.quantity ?? item.cantidad ?? 1))}
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleRemove(item.id)}
                aria-label={`Eliminar ${item.nombre}`}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary-title">Resumen del Pedido</h2>
          
          <div className="cart-summary-row">
            <span>Productos ({itemCount}):</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="cart-summary-row">
            <span>Envío:</span>
            <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
          </div>
          
          <div className="cart-summary-divider"></div>
          
          <div className="cart-summary-row cart-summary-total">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          <Button
            variant="primary"
            size="large"
            onClick={handleCheckoutClick}
            disabled={isProcessing}
            className="cart-checkout-button"
          >
            Comprar
          </Button>
        </div>
      </div>

      {showCheckoutForm && (
        <CheckoutForm
          onSubmit={handleCheckoutSubmit}
          onCancel={handleCheckoutCancel}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};
