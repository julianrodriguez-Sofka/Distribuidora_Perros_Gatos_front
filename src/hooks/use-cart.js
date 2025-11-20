import { useState, useEffect, useCallback } from 'react';
import { cartUtils } from '../utils/cart';
import { toast } from '../utils/toast';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    setItemCount(cartUtils.getCartItemCount());
    setTotal(cartUtils.getCartTotal());
  }, [cart]);

  const loadCart = () => {
    const savedCart = cartUtils.getCart();
    setCart(savedCart);
  };

  const addToCart = useCallback((product, quantity = 1) => {
    if (product.stock <= 0) {
      toast.error('Este producto no tiene stock disponible.');
      return;
    }

    const updatedCart = cartUtils.addToCart(product, quantity);
    setCart(updatedCart);
    toast.success('Producto añadido al carrito.');
  }, []);

  const removeFromCart = useCallback((productId) => {
    const updatedCart = cartUtils.removeFromCart(productId);
    setCart(updatedCart);
    toast.info('Producto eliminado del carrito.');
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const updatedCart = cartUtils.updateQuantity(productId, quantity);
    setCart(updatedCart);
  }, []);

  const clearCart = useCallback(() => {
    cartUtils.clearCart();
    setCart([]);
  }, []);

  const mergeWithServerCart = useCallback((serverCart) => {
    const localCart = cartUtils.getCart();
    const merged = cartUtils.mergeCarts(localCart, serverCart);
    cartUtils.saveCart(merged);
    setCart(merged);
    return merged;
  }, []);

  return {
    cart,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    mergeWithServerCart,
    loadCart,
  };
};

