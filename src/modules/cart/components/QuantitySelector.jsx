import React from 'react';
import styles from './QuantitySelector.module.css';
import { useCartModule } from '../context/CartContext';

const QuantitySelector = ({ product }) => {
  const { updateQuantity } = useCartModule();
  const quantity = product.quantity || 1;

  const dec = () => updateQuantity(product.id, Math.max(1, (product.quantity||1) - 1));
  const inc = () => updateQuantity(product.id, Math.min((product.quantity||1) + 1, product.stock || 9999));

  return (
    <div className={styles.container}>
      <button onClick={dec} aria-label="Disminuir">-</button>
      <input readOnly value={product.quantity || 1} />
      <button onClick={inc} aria-label="Aumentar">+</button>
    </div>
  );
};

export default QuantitySelector;
