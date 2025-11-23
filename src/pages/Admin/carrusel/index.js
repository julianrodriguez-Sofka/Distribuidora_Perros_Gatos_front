import React, { useEffect, useState } from 'react';
import { carouselService } from '../../../services/carousel-service';
import { useToast } from '../../../hooks/use-toast';
import './style.css';

const MAX_IMAGES = 5;
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
const MAX_SIZE = 10485760; // 10MB

const AdminCarruselPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [enlace, setEnlace] = useState('');
  const [orden, setOrden] = useState(images.length + 1);
  const [createdBy, setCreatedBy] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchCarousel();
  }, []);

  const fetchCarousel = async () => {
    setLoading(true);
    try {
      const data = await carouselService.getCarousel();
      setImages(data);
    } catch (error) {
      showToast('Error al cargar el carrusel', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!ACCEPTED_FORMATS.includes(selected.type) || selected.size > MAX_SIZE) {
      showToast('Formato o tamaño no válido. Usa JPG, PNG, SVG o WebP (máx. 10 MB).', 'error');
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (images.length >= MAX_IMAGES) {
      showToast('El carrusel no puede tener más de 5 imágenes.', 'error');
      return;
    }
    if (!file || !orden) {
      showToast('Por favor, completa todos los campos obligatorios.', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orden', orden);
    formData.append('link_url', enlace);
    formData.append('created_by', createdBy);
    try {
      await carouselService.addImage(formData);
      setFile(null);
      setEnlace('');
      setOrden(images.length + 2);
      setCreatedBy('');
      fetchCarousel();
      showToast('Imagen añadida al carrusel.', 'success');
    } catch (error) {
      showToast(error.message || 'Error al subir imagen', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await carouselService.deleteImage(id);
      fetchCarousel();
    } catch (error) {
      showToast('Error al eliminar imagen', 'error');
    }
  };

  const handleOrderChange = (id, value) => {
    const val = parseInt(value, 10);
    if (isNaN(val) || val < 1 || val > 5) return;
    setImages((prev) => prev.map(img => img.id === id ? { ...img, orden: val } : img));
  };

  const handleEnlaceChange = (id, value) => {
    setImages((prev) => prev.map(img => img.id === id ? { ...img, enlaceUrl: value } : img));
  };

  const handleSaveOrder = async () => {
    const orderList = images.map(img => ({ id: img.id, orden: img.orden }));
    try {
      await carouselService.reorderImages(orderList);
      fetchCarousel();
      showToast('Orden actualizado', 'success');
    } catch (error) {
      showToast('Error al guardar el orden', 'error');
    }
  };

  const handleUpdateEnlace = async (id, enlaceUrl) => {
    try {
      await carouselService.updateImage(id, { enlaceUrl });
      fetchCarousel();
      showToast('Enlace actualizado', 'success');
    } catch (error) {
      showToast('Error al actualizar enlace', 'error');
    }
  };

  return (
    <div className="admin-carrusel-page">
      <h2>Gestión del Carrusel</h2>
      <div className="carrusel-preview">
        <h3>Vista previa</h3>
        {images.length === 0 ? (
          <p>No hay imágenes en el carrusel.</p>
        ) : (
          <div className="carrusel-thumbs">
            {images.sort((a, b) => a.orden - b.orden).map(img => (
              <div key={img.id} className="carrusel-thumb">
                <img src={typeof img.imagen_url === 'string' && img.imagen_url ? (img.imagen_url.startsWith('http') ? img.imagen_url : `http://localhost:8000${img.imagen_url}`) : '/no-image.svg'} alt="miniatura" />
                <span>Orden: {img.orden}</span>
                {img.link_url && <a href={img.link_url} target="_blank" rel="noopener noreferrer">Enlace</a>}
              </div>
            ))}
          </div>
        )}
      </div>
      <form className="carrusel-form" onSubmit={handleAddImage}>
        <h3>Añadir imagen</h3>
        <input type="file" accept=".jpg,.jpeg,.png,.svg,.webp" onChange={handleFileChange} required />
        <input type="number" min="1" max="5" placeholder="Orden (1-5)" value={orden} onChange={e => setOrden(e.target.value)} required />
        <input type="text" placeholder="Enlace (URL) opcional" value={enlace} onChange={e => setEnlace(e.target.value)} />
        <input type="text" placeholder="Creado por (opcional)" value={createdBy} onChange={e => setCreatedBy(e.target.value)} />
        <button type="submit">Añadir al Carrusel</button>
      </form>
      <div className="carrusel-list">
        <h3>Imágenes actuales</h3>
        {images.length === 0 ? (
          <p>No hay imágenes en el carrusel.</p>
        ) : (
          <table className="carrusel-table">
            <thead>
              <tr>
                <th>Miniatura</th>
                <th>Orden</th>
                <th>Enlace</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {images.sort((a, b) => a.orden - b.orden).map(img => (
                <tr key={img.id}>
                  <td><img src={img.imagenUrl ? (img.imagenUrl.startsWith('http') ? img.imagenUrl : `http://localhost:8000${img.imagenUrl}`) : ''} alt="miniatura" className="thumb-img" /></td>
                      <td><img src={typeof img.imagen_url === 'string' && img.imagen_url ? (img.imagen_url.startsWith('http') ? img.imagen_url : `http://localhost:8000${img.imagen_url}`) : '/no-image.svg'} alt="miniatura" className="thumb-img" /></td>
                  <td>
                    <input type="number" min="1" max="5" value={img.orden} onChange={e => handleOrderChange(img.id, e.target.value)} />
                  </td>
                  <td>
                    <input type="text" value={img.link_url || ''} onChange={e => handleEnlaceChange(img.id, e.target.value)} onBlur={e => handleUpdateEnlace(img.id, e.target.value)} />
                  </td>
                  <td>
                    <button className="btn-eliminar" onClick={() => handleDelete(img.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="btn-guardar" onClick={handleSaveOrder}>Guardar cambios de orden</button>
      </div>
    </div>
  );
};

export default AdminCarruselPage;


