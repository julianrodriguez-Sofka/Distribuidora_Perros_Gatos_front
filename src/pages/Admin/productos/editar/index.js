import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productosService } from '../../../../services/productos-service';
import { useToast } from '../../../../hooks/use-toast';
import '../style.css';

const EditarProductoPage = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', peso_gramos: '', stock: '', categoria: '', subcategoria: '', imagenFile: null });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await productosService.getProductById(id);
        setProducto(data);
        setForm({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          precio: data.precio || '',
          peso_gramos: data.peso_gramos || '',
          stock: data.cantidad_disponible ?? data.stock ?? '',
          categoria: data.categoria?.id || data.categoria_id || data.categoria || '',
          subcategoria: data.subcategoria?.id || data.subcategoria_id || '',
          imagenFile: null,
        });
        // set preview to existing image if present
        const existing = data.imagenUrl || data.imagen_url || data.url || data.path || null;
        if (existing) setPreviewUrl(existing.startsWith('http') ? existing : `http://localhost:8000${existing}`);
      } catch (error) {
        // toast may change identity between renders; keep effect deps minimal
        // use navigate or console for debug
        console.error('Error al cargar producto', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
      setForm({ ...form, [e.target.name]: file });
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleUploadImage = async () => {
    if (!form.imagenFile) return toast.error('Seleccione un archivo primero');
    setUploadingImage(true);
    try {
      const resp = await productosService.uploadProductImage(id, form.imagenFile);
      // backend may return imagen_url or path
      const img = resp.imagen_url ?? resp.url ?? resp.path ?? resp.imagenUrl ?? null;
      const final = img ? (img.startsWith('http') ? img : `http://localhost:8000${img}`) : null;
      if (final) {
        setPreviewUrl(final);
        // update producto preview
        setProducto(prev => ({ ...(prev || {}), imagenUrl: final }));
        setForm(prev => ({ ...prev, imagenFile: null }));
        toast.success('Imagen subida');
      } else {
        toast.error('La subida no devolvió URL de imagen');
      }
    } catch (err) {
      console.error('Error subiendo imagen', err);
      toast.error('Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        peso_gramos: form.peso_gramos ? Number(form.peso_gramos) : undefined,
        categoria_id: form.categoria ? Number(form.categoria) : undefined,
        subcategoria_id: form.subcategoria ? Number(form.subcategoria) : undefined,
        cantidad_disponible: form.stock ? Number(form.stock) : undefined,
      };
      if (form.imagenFile) {
        payload.imagenFile = form.imagenFile;
      }
      // Remove undefined fields so backend keeps existing values when not provided
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      await productosService.updateProduct(id, payload);
      toast.success('Producto actualizado');
      navigate('/admin/productos');
    } catch (error) {
      toast.error('Error al actualizar producto');
    }
  };

  if (loading) return <div className="admin-productos-listar"><p>Cargando...</p></div>;
  if (!producto) return <div className="admin-productos-listar"><p>No se encontró el producto</p></div>;

  return (
    <div className="admin-productos-listar">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit} className="form-producto">
        <div>
          <label>Nombre:</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Precio:</label>
          <input name="precio" type="number" value={form.precio} onChange={handleChange} required />
        </div>
        <div>
          <label>Stock (cantidad disponible):</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
        </div>
        <div>
          <label>Categoría (ID):</label>
          <input name="categoria" value={form.categoria} onChange={handleChange} required />
        </div>
        <div>
          <label>Subcategoría (ID):</label>
          <input name="subcategoria" value={form.subcategoria} onChange={handleChange} />
        </div>
        <div>
          <label>Peso (gramos):</label>
          <input name="peso_gramos" type="number" value={form.peso_gramos} onChange={handleChange} />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>
        <div>
          <label>Imagen actual / Preview:</label>
          {previewUrl ? (
            <div style={{ marginBottom: 8 }}>
              <img src={previewUrl} alt="preview" style={{ maxWidth: 260, maxHeight: 180, objectFit: 'cover', borderRadius: 6 }} />
            </div>
          ) : (
            <div style={{ color: '#6b7280', marginBottom: 8 }}>No hay imagen</div>
          )}
          <input name="imagenFile" type="file" accept="image/*" onChange={handleChange} />
          <button type="button" className="btn-editar" onClick={handleUploadImage} disabled={uploadingImage || !form.imagenFile} style={{ marginLeft: 8 }}>
            {uploadingImage ? 'Subiendo...' : 'Subir imagen'}
          </button>
        </div>
        <button type="submit" className="btn-editar">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditarProductoPage;
