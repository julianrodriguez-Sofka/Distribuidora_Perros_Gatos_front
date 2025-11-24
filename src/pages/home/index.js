import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productosService } from '../../services/productos-service';
import { carouselService } from '../../services/carousel-service';
import { useCart } from '../../hooks/use-cart';
import { useContext } from 'react';
import CartContext from '../../modules/cart/context/CartContext';
import { ProductCard } from '../../components/ui';
import { toast } from '../../utils/toast';
import './style.css';



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
  // Call both hooks unconditionally; prefer new CartContext when available
  const legacyCart = useCart();
  const ctx = useContext(CartContext);
  const addToCartHandler = (product, qty = 1) => {
    if (ctx && ctx.addItem) return ctx.addItem(product, qty);
    return legacyCart.addToCart(product, qty);
  };

  useEffect(() => {
    loadCatalog();
    loadCarousel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCatalog = async () => {
    try {
      setIsLoading(true);
      const data = await productosService.getCatalog();

      // If backend returns an array of products, transform it into the
      // expected catalog shape: { categoryName: { subcategoryName: [products] } }
      let catalogPayload = data;
      if (Array.isArray(data)) {
        catalogPayload = data.reduce((acc, prod) => {
          const catName = prod.categoria?.nombre || 'Sin categoría';
          const subName = prod.subcategoria?.nombre || 'General';
          if (!acc[catName]) acc[catName] = {};
          if (!acc[catName][subName]) acc[catName][subName] = [];

          // Normalize product fields expected by ProductCard
          const imagenFromArray = Array.isArray(prod.imagenes) && prod.imagenes.length > 0
            ? prod.imagenes[0]?.imagen_url || prod.imagenes[0]?.url || null
            : null;
          const possibleImage = prod.imagen_url ?? prod.imagenUrl ?? imagenFromArray ?? null;
          const imagenUrl = possibleImage ? (typeof possibleImage === 'string' && possibleImage.startsWith('http') ? possibleImage : `http://localhost:8000${possibleImage}`) : null;

          const normalized = {
            ...prod,
            imagenUrl,
            stock: prod.cantidad_disponible ?? prod.stock ?? 0,
            peso: prod.peso_gramos ?? prod.peso ?? null,
          };

          acc[catName][subName].push(normalized);
          return acc;
        }, {});
      }

      dispatch({ type: 'FETCH_CATALOG_SUCCESS', payload: catalogPayload });
    } catch (error) {
      console.error('Error loading catalog:', error);
      if (!error?._toastsShown) toast.error('Error al cargar el catálogo de productos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCarousel = async () => {
    try {
      const data = await carouselService.getCarousel();
      // Normalize backend fields (imagen_url, link_url) to frontend shape (imagenUrl, enlaceUrl)
      const normalized = Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            imagenUrl: typeof item.imagen_url === 'string' && item.imagen_url
              ? (item.imagen_url.startsWith('http') ? item.imagen_url : `http://localhost:8000${item.imagen_url}`)
              : null,
            enlaceUrl: item.link_url ?? item.enlaceUrl ?? null,
          }))
        : [];
      dispatch({ type: 'FETCH_CAROUSEL_SUCCESS', payload: normalized });
    } catch (error) {
      console.error('Error loading carousel:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCartHandler(product, 1);
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

