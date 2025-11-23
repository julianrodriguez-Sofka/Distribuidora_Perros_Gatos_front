import React from 'react';
import styles from './CartIcon.module.css';
import { useCartModule } from '../context/CartContext';

const CartIcon = ({ onClick }) => {
  const { itemCount } = useCartModule();
  return (
    <button className={styles.iconBtn} onClick={onClick} aria-label="Abrir carrito">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
    </button>
  );
};

export default CartIcon;
