import React, { useEffect, useState } from 'react';
import { calificacionesService } from '../../../services/calificaciones-service';
import { productosService } from '../../../services/productos-service';
import { useToast } from '../../../hooks/use-toast';
import { StarRating } from '../../../components/ui';
import './style.css';

const ListarCalificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroProducto, setFiltroProducto] = useState('');
  const [filtroCalificacion, setFiltroCalificacion] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch productos y calificaciones en paralelo
      const [productsData, calificacionesData] = await Promise.all([
        productosService.getAllProducts(),
        calificacionesService.obtenerTodasCalificaciones()
      ]);
      
      setProductos(productsData);
      
      // Agregar nombre del producto a cada calificación
      const calificacionesConNombre = calificacionesData.map(cal => {
        const producto = productsData.find(p => p.id === cal.producto_id);
        return {
          ...cal,
          producto_nombre: producto ? producto.nombre : `Producto #${cal.producto_id}`
        };
      });
      
      setCalificaciones(calificacionesConNombre);
    } catch (error) {
      if (!error?._toastsShown) toast.error(error.message || 'Error al cargar calificaciones');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar calificaciones
  const calificacionesFiltradas = calificaciones.filter(cal => {
    const matchProducto = !filtroProducto || cal.producto_id === parseInt(filtroProducto);
    const matchCalificacion = !filtroCalificacion || cal.calificacion === parseInt(filtroCalificacion);
    return matchProducto && matchCalificacion;
  });

  return (
    <div className="admin-calificaciones-listar">
      <h2>Gestión de Calificaciones</h2>
      
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label>Filtrar por Producto:</label>
          <select value={filtroProducto} onChange={(e) => setFiltroProducto(e.target.value)}>
            <option value="">Todos los productos</option>
            {productos.map(prod => (
              <option key={prod.id} value={prod.id}>{prod.nombre}</option>
            ))}
          </select>
        </div>
        
        <div className="filtro-grupo">
          <label>Filtrar por Calificación:</label>
          <select value={filtroCalificacion} onChange={(e) => setFiltroCalificacion(e.target.value)}>
            <option value="">Todas las estrellas</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="2">2 estrellas</option>
            <option value="1">1 estrella</option>
          </select>
        </div>
        
        <button className="btn-limpiar-filtros" onClick={() => {
          setFiltroProducto('');
          setFiltroCalificacion('');
        }}>
          Limpiar filtros
        </button>
      </div>

      {loading ? (
        <p>Cargando calificaciones...</p>
      ) : (
        <>
          <div className="stats-resumen">
            <div className="stat-card">
              <h3>{calificaciones.length}</h3>
              <p>Total Calificaciones</p>
            </div>
            <div className="stat-card">
              <h3>{calificacionesFiltradas.length}</h3>
              <p>Mostradas</p>
            </div>
            <div className="stat-card">
              <h3>{productos.filter(p => p.total_calificaciones > 0).length}</h3>
              <p>Productos Calificados</p>
            </div>
          </div>

          <table className="calificaciones-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Calificación</th>
                <th>Comentario</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {calificacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="5">No hay calificaciones</td>
                </tr>
              ) : (
                calificacionesFiltradas.map((cal) => (
                  <tr key={`${cal.producto_id}-${cal.id}`}>
                    <td>{new Date(cal.fecha_creacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                    <td>{cal.producto_nombre}</td>
                    <td>
                      <StarRating 
                        rating={cal.calificacion} 
                        interactive={false}
                        size={20}
                      />
                    </td>
                    <td className="comentario-cell">
                      {cal.comentario || <em style={{ color: '#999' }}>Sin comentario</em>}
                    </td>
                    <td>{cal.usuario_id ? `Usuario #${cal.usuario_id}` : 'Anónimo'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ListarCalificaciones;
