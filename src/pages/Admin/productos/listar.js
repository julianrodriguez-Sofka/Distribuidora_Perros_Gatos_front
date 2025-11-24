import React, { useEffect, useState } from 'react';
import { productosService } from '../../../services/productos-service';
import { useToast } from '../../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import './style.css';

const ListarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
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
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="6">No hay productos</td>
              </tr>
            ) : (
              productos.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.id}</td>
                  <td>{prod.nombre}</td>
                  <td>{prod.categoria?.nombre || (typeof prod.categoria === 'string' ? prod.categoria : '')}</td>
                  <td>{prod.precio}</td>
                  <td>{prod.cantidad_disponible}</td>
                  <td>
                    <button className="btn-editar" onClick={() => navigate(`/admin/productos/editar/${prod.id}`)}>Editar</button>
                    {' '}
                    <button className="btn-eliminar" onClick={() => handleEliminar(prod.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarProductos;
