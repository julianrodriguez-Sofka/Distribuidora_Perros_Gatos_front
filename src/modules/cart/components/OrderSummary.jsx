import React from 'react';
import styles from './OrderSummary.module.css';
import { useCartModule } from '../context/CartContext';

const OrderSummary = () => {
  const { subtotal, shipping, total } = useCartModule();
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}><span>Subtotal</span><span>${(subtotal/100).toFixed(2)}</span></div>
      <div className={styles.row}><span>Envío</span><span>${(shipping/100).toFixed(2)}</span></div>
      <div className={styles.row}><strong>Total</strong><strong>${(total/100).toFixed(2)}</strong></div>
      <button className={styles.checkout}>Finalizar compra</button>
    </div>
  );
};

export default OrderSummary;
