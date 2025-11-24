import React from 'react';
import styles from './ProductCard.module.css';
import QuantitySelector from './QuantitySelector';
import { useCartModule } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addItem } = useCartModule();

  const handleAdd = () => {
    addItem(product, 1);
  };

  const raw = product.imagen_url || product.imagenUrl || product.image || null;
  console.log('Raw image path:', raw);
  const cleaned = raw ? raw.replace('/app/app/', '/app/') : null;
  const src = cleaned ? (cleaned.startsWith('http') ? cleaned : `http://localhost:8000${cleaned}`) : '/placehoholla 3lder-product.png';

  return (
    <div className={styles.card}>
      <div className={styles.media}>
        <img src={src} alt={product.nombre} />
      </div>
      <div className={styles.body}>
        <h4 className={styles.title}>{product.nombre}</h4>
        <p className={styles.price}>${(product.precio/100).toFixed(2)}</p>
        <div className={styles.controls}>
          <button className={styles.addBtn} onClick={handleAdd} disabled={(product.stock||0) <= 0}>
            Agregar
          </button>
          <QuantitySelector product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
