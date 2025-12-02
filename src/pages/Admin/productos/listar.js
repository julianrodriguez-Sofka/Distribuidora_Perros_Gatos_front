import React, { useEffect, useState } from 'react';
import { productosService } from '../../../services/productos-service';
import { useToast } from '../../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { StarRating } from '../../../components/ui';
import './style.css';

const ListarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
    
    // Auto-refresh every 3 seconds for the first 10 seconds after mounting
    // This helps catch newly created products from RabbitMQ worker
    let refreshCount = 0;
    const maxRefreshes = 3;
    const refreshInterval = setInterval(() => {
      refreshCount++;
      if (refreshCount <= maxRefreshes) {
        fetchProductos();
      } else {
        clearInterval(refreshInterval);
      }
    }, 3000);

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const data = await productosService.getAllProducts();
      setProductos(data);
    } catch (error) {
      if (!error?._toastsShown) toast.error(error.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await productosService.eliminarProducto(id);
      toast.success('Producto eliminado correctamente');
      fetchProductos();
    } catch (error) {
      if (!error?._toastsShown) toast.error(error.message || 'Error al eliminar producto');
    }
  };

  return (
    <div className="admin-productos-listar">
      <h2>Lista de Productos</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
          <table className="productos-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Calificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="8">No hay productos</td>
              </tr>
            ) : (
              productos.map((prod) => {
                // Get first image from imagenes array
                const primeraImagen = prod.imagenes && prod.imagenes.length > 0 ? prod.imagenes[0] : null;
                const imagenUrl = primeraImagen 
                  ? (primeraImagen.startsWith('http') ? primeraImagen : `http://localhost:8000${primeraImagen}`)
                  : null;
                
                return (
                  <tr key={prod.id}>
                    <td>
                      {imagenUrl ? (
                        <img 
                          src={imagenUrl} 
                          alt={prod.nombre} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.8em', color: '#999' }}>Sin imagen</span>
                      )}
                    </td>
                    <td>{prod.id}</td>
                    <td>{prod.nombre}</td>
                    <td>{prod.categoria?.nombre || (typeof prod.categoria === 'string' ? prod.categoria : '')}</td>
                    <td>{prod.precio}</td>
                    <td>{prod.cantidad_disponible}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <StarRating 
                          rating={prod.promedio_calificacion || 0} 
                          totalRatings={prod.total_calificaciones || 0}
                          interactive={false}
                          size={16}
                          showCount={true}
                        />
                      </div>
                    </td>
                    <td>
                      <button className="btn-editar" onClick={() => navigate(`/admin/productos/editar/${prod.id}`)}>Editar</button>
                      {' '}
                      <button className="btn-eliminar" onClick={() => handleEliminar(prod.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarProductos;
