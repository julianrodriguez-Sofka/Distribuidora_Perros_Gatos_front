import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/use-cart';
import CartContext from '../../modules/cart/context/CartContext';
import { useAuth } from '../../hooks/use-auth';
import { Button, Input, Textarea, Select } from '../../components/ui/index';
import { formatPrice } from '../../utils/validation';
import { toast } from '../../utils/toast';
import { pedidosService } from '../../services/pedidos-service';
import './style.css';

export const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  // Prefer the new CartContext if available, otherwise fall back to legacy useCart
  // Call hooks unconditionally to satisfy React rules of hooks
  const legacy = useCart();
  const ctx = useContext(CartContext);

  let cart, itemCount, total, subtotal, shipping, updateQuantity, removeFromCart, clearCart;
  if (ctx) {
    cart = ctx.items;
    itemCount = ctx.itemCount;
    total = ctx.total;
    subtotal = ctx.subtotal;
    shipping = ctx.shipping;
    updateQuantity = ctx.updateQuantity;
    removeFromCart = ctx.removeItem;
    clearCart = ctx.clear;
  } else {
    cart = legacy.cart;
    itemCount = legacy.itemCount;
    total = legacy.total;
    // Calculate subtotal and shipping for legacy cart
    subtotal = cart.reduce((sum, item) => sum + (item.precio || 0) * (item.quantity || item.cantidad || 1), 0);
    shipping = subtotal > 0 ? Math.max(150, Math.round(subtotal * 0.05)) : 0;
    updateQuantity = legacy.updateQuantity;
    removeFromCart = legacy.removeFromCart;
    clearCart = legacy.clearCart;
  }
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const paymentMethods = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta_credito', label: 'Tarjeta de Crédito' },
    { value: 'tarjeta_debito', label: 'Tarjeta de Débito' },
    { value: 'transferencia', label: 'Transferencia Bancaria' },
    { value: 'nequi', label: 'Nequi' },
    { value: 'daviplata', label: 'Daviplata' },
  ];

  // Initialize form with user data if available
  useEffect(() => {
    if (user) {
      const userAddress = user.direccion_envio || user.direccionEnvio || '';
      const userPhone = user.telefono || '';
      setShippingAddress(userAddress);
      setShippingPhone(userPhone);
      
      // Show form automatically if address is invalid
      if (!userAddress || userAddress.trim().length < 10) {
        setShowAddressForm(true);
      }
    }
  }, [user]);

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

  const handleCheckout = async () => {
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

    setIsProcessing(true);
    try {
      const orderData = {
        productos: cart.map(item => ({
          sku: item.id,
          nombre: item.nombre,
          cantidad: item.quantity ?? item.cantidad ?? 1,
          precioUnitario: item.precio,
        })),
        direccionEnvio: shippingAddress.trim(),
        telefonoContacto: shippingPhone.trim(),
        notaEspecial: specialNote.trim() || undefined,
        subtotal: subtotal,
        costoEnvio: shipping,
        metodoPago: paymentMethod,
      };

      await pedidosService.createOrder(orderData);
      clearCart();
      toast.success('Pedido creado exitosamente');
      navigate('/pedidos');
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
          <h2 className="cart-summary-title">Resumen</h2>
          
          {/* Product breakdown */}
          <div className="cart-products-breakdown">
            <h3 className="breakdown-title">Productos</h3>
            {cart.map((item) => {
              const quantity = item.quantity ?? item.cantidad ?? 1;
              const itemTotal = (item.precio || 0) * quantity;
              return (
                <div key={item.id} className="breakdown-item">
                  <div className="breakdown-item-info">
                    <span className="breakdown-item-name">{item.nombre}</span>
                    <span className="breakdown-item-details">
                      {quantity} x {formatPrice(item.precio)}
                    </span>
                  </div>
                  <span className="breakdown-item-total">{formatPrice(itemTotal)}</span>
                </div>
              );
            })}
          </div>

          {/* Cost breakdown */}
          <div className="cart-cost-breakdown">
            <div className="cart-summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Costo de Envío:</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Shipping Address Form */}
          <div className={`shipping-form-container ${showAddressForm ? 'shipping-form-visible' : ''}`}>
            <h3 className="shipping-form-title">Información de Envío</h3>
            <div className="shipping-form-fields">
              <div className="form-field">
                <label htmlFor="shipping-address">Dirección de Envío *</label>
                <Textarea
                  id="shipping-address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Ingresa tu dirección completa (mínimo 10 caracteres)"
                  rows={3}
                  className="shipping-input"
                />
                {shippingAddress && shippingAddress.trim().length < 10 && (
                  <span className="form-error">La dirección debe tener al menos 10 caracteres</span>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="shipping-phone">Teléfono de Contacto *</label>
                <Input
                  id="shipping-phone"
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="Ej: 3001234567"
                  className="shipping-input"
                />
                {shippingPhone && shippingPhone.trim().length < 7 && (
                  <span className="form-error">El teléfono debe tener al menos 7 dígitos</span>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="special-note">Nota Especial (Opcional)</label>
                <Textarea
                  id="special-note"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Instrucciones especiales para la entrega"
                  rows={2}
                  className="shipping-input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="payment-method">Método de Pago *</label>
                <Select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  options={paymentMethods}
                  placeholder="Selecciona un método de pago"
                  className="shipping-input"
                  required
                />
                {!paymentMethod && (
                  <span className="form-error">Debes seleccionar un método de pago</span>
                )}
              </div>
            </div>
          </div>

          {!showAddressForm && (
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setShowAddressForm(true)}
              className="cart-edit-address-button"
            >
              {shippingAddress ? 'Editar Dirección' : 'Agregar Dirección de Envío'}
            </Button>
          )}

          <Button
            variant="primary"
            size="large"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="cart-checkout-button"
          >
            {isProcessing ? 'Procesando...' : 'Comprar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

