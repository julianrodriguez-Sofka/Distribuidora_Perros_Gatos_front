import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productosService } from '../../services/productos-service';
import { carouselService } from '../../services/carousel-service';
import { useCart } from '../../hooks/use-cart';
import { Button } from '../../components/ui';
import { formatPrice, formatWeight } from '../../utils/validation';
import { toast } from '../../utils/toast';
import './style.css';

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img
          src={product.imagenUrl || '/placeholder-product.png'}
          alt={product.nombre}
          loading="lazy"
        />
        {isOutOfStock && <div className="product-card-overlay">Sin existencias</div>}
      </div>
      <div className="product-card-content">
        <h3 className="product-card-name">{product.nombre}</h3>
        <p className="product-card-price">{formatPrice(product.precio)}</p>
        <p className="product-card-weight">{formatWeight(product.peso)}</p>
        <p className="product-card-stock">
          {isOutOfStock
            ? 'Sin existencias'
            : `Disponible: ${product.stock} unidades`}
        </p>
        <Button
          variant="primary"
          size="small"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="product-card-button"
        >
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
};

const CategorySection = ({ categoryName, subcategories, onAddToCart }) => {
  if (!subcategories || Object.keys(subcategories).length === 0) {
    return null;
  }

  return (
    <section className="category-section" aria-labelledby={`category-${categoryName}`}>
      <h2 id={`category-${categoryName}`} className="category-section-title">
        {categoryName}
      </h2>
      {Object.entries(subcategories).map(([subcategoryName, products]) => {
        if (!products || products.length === 0) return null;
        
        return (
          <div key={subcategoryName} className="subcategory-section">
            <h3 className="subcategory-title">{subcategoryName}</h3>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export const HomePage = () => {
  const dispatch = useDispatch();
  const { catalog } = useSelector((state) => state.productos);
  const carousel = useSelector((state) => state.carousel);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadCatalog();
    loadCarousel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCatalog = async () => {
    try {
      setIsLoading(true);
      const data = await productosService.getCatalog();
      dispatch({ type: 'FETCH_CATALOG_SUCCESS', payload: data });
    } catch (error) {
      console.error('Error loading catalog:', error);
      toast.error('Error al cargar el catálogo de productos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCarousel = async () => {
    try {
      const data = await carouselService.getCarousel();
      dispatch({ type: 'FETCH_CAROUSEL_SUCCESS', payload: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('Error loading carousel:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (isLoading) {
    return (
      <div className="home-loading">
        <p>Cargando catálogo...</p>
      </div>
    );
  }

  const carouselImages = carousel?.images || [];

  return (
    <div className="home-page">
      {carouselImages.length > 0 && (
        <section className="carousel-section" aria-label="Carrusel de promociones">
          <div className="carousel">
            {carouselImages.map((item, index) => (
              <a
                key={item.id}
                href={item.enlaceUrl || '#'}
                className="carousel-item"
                aria-label={`Promoción ${index + 1}`}
              >
                <img
                  src={item.imagenUrl}
                  alt={`Promoción ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="catalog-container">
        {Object.entries(catalog).map(([categoryName, subcategories]) => (
          <CategorySection
            key={categoryName}
            categoryName={categoryName}
            subcategories={subcategories}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {Object.keys(catalog).length === 0 && (
        <div className="empty-catalog">
          <p>No hay productos disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};

