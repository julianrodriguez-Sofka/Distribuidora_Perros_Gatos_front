import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/use-cart';
import CartContext from '../../modules/cart/context/CartContext';
import { useAuth } from '../../hooks/use-auth';
import { Button, Input, Textarea, Select } from '../../components/ui/index';
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

  let cart, itemCount, total, updateQuantity, removeFromCart, clearCart;
  if (ctx) {
    cart = ctx.items;
    itemCount = ctx.itemCount;
    subtotal = ctx.subtotal;
    shipping = ctx.shipping;
    total = ctx.total;
    subtotal = ctx.subtotal;
    shipping = ctx.shipping;
    updateQuantity = ctx.updateQuantity;
    removeFromCart = ctx.removeItem;
    clearCart = ctx.clear;
  } else {
    cart = legacy.cart;
    itemCount = legacy.itemCount;
    subtotal = legacy.subtotal || 0;
    shipping = legacy.shipping || 0;
    total = legacy.total;
    // Calculate subtotal and shipping for legacy cart
    subtotal = cart.reduce((sum, item) => sum + (item.precio || 0) * (item.quantity || item.cantidad || 1), 0);
    shipping = subtotal > 0 ? Math.max(150, Math.round(subtotal * 0.05)) : 0;
    updateQuantity = legacy.updateQuantity;
    removeFromCart = legacy.removeFromCart;
    clearCart = legacy.clearCart;
  }
  const [isProcessing, setIsProcessing] = useState(false);

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

  const validateAddressForm = () => {
    if (!shippingAddress || shippingAddress.trim().length < 10) {
      toast.error('La dirección de envío debe tener al menos 10 caracteres.');
      return false;
    }
    if (!shippingPhone || shippingPhone.trim().length < 7) {
      toast.error('El teléfono de contacto debe tener al menos 7 dígitos.');
      return false;
    }
    return true;
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

    // Check if address form needs to be shown
    const hasValidAddress = shippingAddress && shippingAddress.trim().length >= 10;
    if (!hasValidAddress) {
      setShowAddressForm(true);
      toast.error('Por favor, completa la información de envío antes de continuar.');
      return;
    }

    // Validate form if it's visible
    if (showAddressForm && !validateAddressForm()) {
      return;
    }

    // Validate payment method
    if (!paymentMethod) {
      toast.error('Por favor, selecciona un método de pago.');
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
        direccionEnvio: user.direccionEnvio,
      };

      await pedidosService.createOrder(orderData);
      clearCart();
      setShowCheckoutForm(false);
      toast.success('¡Pedido creado exitosamente! Pronto recibirás la confirmación.');
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.detail?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'Error al procesar el pedido';
      if (!error?._toastsShown) toast.error(errorMessage);
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
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el catálogo para empezar tu compra</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Ver Catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="cart-title-wrapper">
          <svg className="cart-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h1 className="cart-title">Carrito de Compras</h1>
        </div>
        <div className="cart-count-badge">{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</div>
      </div>
      
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
                <div className="cart-item-meta">
                  <span className="cart-item-price">{formatPrice(item.precio)}</span>
                  <span className="cart-item-separator">•</span>
                  <span className="cart-item-stock">{item.stock} disponibles</span>
                </div>
              </div>
              <div className="cart-item-quantity">
                <label className="quantity-label">Cantidad:</label>
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
                <span className="total-label">Subtotal</span>
                <span className="total-value">{formatPrice((item.precio || 0) * (item.quantity ?? item.cantidad ?? 1))}</span>
              </div>
              <button
                className="cart-item-remove"
                onClick={() => handleRemove(item.id)}
                aria-label={`Eliminar ${item.nombre}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary-title">Resumen</h2>
          <div className="cart-summary-row">
            <span>Productos:</span>
            <span>{itemCount}</span>
          </div>
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
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            {isProcessing ? 'Procesando...' : 'Comprar'}
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
