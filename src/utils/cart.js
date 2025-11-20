// Cart utilities for localStorage

const CART_STORAGE_KEY = 'distribuidora_cart';

export const cartUtils = {
  getCart: () => {
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  },

  saveCart: (cart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  addToCart: (product, quantity = 1) => {
    const cart = cartUtils.getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagenUrl: product.imagenUrl,
        cantidad: quantity,
        stock: product.stock,
      });
    }
    
    cartUtils.saveCart(cart);
    return cart;
  },

  removeFromCart: (productId) => {
    const cart = cartUtils.getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    cartUtils.saveCart(filteredCart);
    return filteredCart;
  },

  updateQuantity: (productId, quantity) => {
    const cart = cartUtils.getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        return cartUtils.removeFromCart(productId);
      }
      cart[itemIndex].quantity = quantity;
      cartUtils.saveCart(cart);
    }
    
    return cart;
  },

  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  },

  getCartTotal: () => {
    const cart = cartUtils.getCart();
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  },

  getCartItemCount: () => {
    const cart = cartUtils.getCart();
    return cart.reduce((count, item) => count + item.cantidad, 0);
  },

  // Merge local cart with server cart
  mergeCarts: (localCart, serverCart) => {
    const merged = [...serverCart];
    
    localCart.forEach(localItem => {
      const existingIndex = merged.findIndex(item => item.id === localItem.id);
      
      if (existingIndex >= 0) {
        // Sum quantities, respecting stock
        const maxQuantity = Math.min(
          merged[existingIndex].stock,
          merged[existingIndex].cantidad + localItem.cantidad
        );
        merged[existingIndex].cantidad = maxQuantity;
      } else {
        // Add if stock available
        if (localItem.stock > 0) {
          merged.push({
            ...localItem,
            cantidad: Math.min(localItem.cantidad, localItem.stock),
          });
        }
      }
    });
    
    return merged;
  },
};

