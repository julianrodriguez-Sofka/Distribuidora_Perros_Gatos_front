import React from 'react';
import styles from './CartDrawer.module.css';
import { useCartModule } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, subtotal, shipping, total, clear } = useCartModule();

  return (
    <aside className={`${styles.drawer} ${isOpen ? styles.open : ''}`} aria-hidden={!isOpen}>
      <div className={styles.header}>
        <h3>Tu carrito</h3>
        <button onClick={onClose} aria-label="Cerrar">×</button>
      </div>

      <div className={styles.body}>
        {items.length === 0 ? (
          <div className={styles.empty}>Tu carrito está vacío</div>
        ) : (
          items.map((it) => (
           
            <div key={it.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.name}>{it.nombre}</div>
                <div className={styles.price}>${((it.precio||0)/100).toFixed(2)}</div>
                <div className={styles.qty}>Cantidad: {it.quantity || 1}</div>
              </div>
              <div className={styles.actions}>
                <button onClick={() => updateQuantity(it.id, (it.quantity||1)-1)}>-</button>
                <button onClick={() => updateQuantity(it.id, (it.quantity||1)+1)}>+</button>
                <button onClick={() => removeItem(it.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.summary}>
          <div>Subtotal</div><div>${(subtotal/100).toFixed(2)}</div>
          <div>Envío</div><div>${(shipping/100).toFixed(2)}</div>
          <div className={styles.total}>Total</div><div className={styles.total}>${(total/100).toFixed(2)}</div>
        </div>
        <div className={styles.actionsFooter}>
          <button className={styles.clear} onClick={clear}>Vaciar carrito</button>
          <button className={styles.checkout}>Finalizar compra</button>
        </div>
      </div>
    </aside>
  );
};

export default CartDrawer;
