import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/use-cart';
import { useAuth } from '../../hooks/use-auth';
import { Button, Input } from '../../components/ui/index';
import { formatPrice } from '../../utils/validation';
import { toast } from '../../utils/toast';
import { pedidosService } from '../../services/pedidos-service';
import './style.css';

export const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, itemCount, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión o registrarte para continuar con la compra.');
      // Optionally add a button in toast to redirect to login
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (cart.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        productos: cart.map(item => ({
          sku: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
        })),
        direccionEnvio: user.direccionEnvio,
      };

      await pedidosService.createOrder(orderData);
      clearCart();
      toast.success('Pedido creado exitosamente');
      navigate('/pedidos');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al procesar el pedido');
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
                src={item.imagenUrl || '/placeholder-product.png'}
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
                  max={item.stock}
                  value={item.cantidad}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="cart-quantity-input"
                />
              </div>
              <div className="cart-item-total">
                {formatPrice(item.precio * item.cantidad)}
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

