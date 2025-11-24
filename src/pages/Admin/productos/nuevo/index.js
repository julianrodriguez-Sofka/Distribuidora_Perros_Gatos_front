import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import productosService from "../../../../services/productos-service";
import { useToast } from "../../../../hooks/use-toast";
import '../style.css';

const categorias = {
  Perros: ["Alimento", "Juguetes", "Accesorios", "Higiene"],
  Gatos: ["Alimento", "Rascadores", "Arena", "Accesorios"],
};

const MAX_IMAGE_SIZE = 10485760; // 10 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];

const NuevoProductoPage = () => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    peso: "",
    categoria: "Perros",
    subcategoria: "Alimento",
    imagenFile: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagenFile") {
      setForm((prev) => ({ ...prev, imagenFile: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre || form.nombre.length < 2) newErrors.nombre = "Mínimo 2 caracteres";
    if (!form.descripcion || form.descripcion.length < 10) newErrors.descripcion = "Mínimo 10 caracteres";
    if (!form.precio || isNaN(form.precio) || Number(form.precio) <= 0) newErrors.precio = "Precio debe ser > 0";
    if (!form.peso || isNaN(form.peso) || !Number.isInteger(Number(form.peso)) || Number(form.peso) < 1) newErrors.peso = "Peso debe ser entero ≥ 1";
    if (!form.categoria || !categorias[form.categoria]) newErrors.categoria = "Selecciona categoría";
    if (!form.subcategoria || !categorias[form.categoria].includes(form.subcategoria)) newErrors.subcategoria = "Selecciona subcategoría";
    if (!form.imagenFile) newErrors.imagenFile = "Imagen requerida";
    else {
      if (!ALLOWED_IMAGE_TYPES.includes(form.imagenFile.type) || form.imagenFile.size > MAX_IMAGE_SIZE) {
        newErrors.imagenFile = "Formato o tamaño de imagen no válido. Usa JPG, PNG, SVG o WebP (máx. 10 MB).";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Por favor, completa todos los campos obligatorios.", "error");
      return;
    }
    setIsLoading(true);
    try {
      // Build payload mapping to backend expected fields
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        peso_gramos: Number(form.peso),
        // backend may accept category names or ids; using the selected value
        categoria: form.categoria,
        subcategoria: form.subcategoria,
        imagenFile: form.imagenFile,
      };

      const response = await productosService.createProduct(payload);
      if (response?.status === "error" && response.message?.includes("nombre")) {
        showToast("Ya existe un producto con ese nombre.", "error");
        setIsLoading(false);
        return;
      }
      showToast("Producto creado exitosamente", "success");
      navigate("/admin/productos");
    } catch (error) {
      if (!error?._toastsShown) showToast(error?.message || "Error al crear producto.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-productos-listar">
      <h2 className="page-title">Crear Nuevo Producto</h2>
      <div style={{ marginTop: 16 }} />
      <div className="form-producto">
        <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
          <div>
            <label>Nombre del producto</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>

          <div>
            <label>Descripción detallada</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required minLength={10} />
            {errors.descripcion && <span className="error-text">{errors.descripcion}</span>}
          </div>

          <div>
            <label>Precio</label>
            <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} required min={0.01} />
            {errors.precio && <span className="error-text">{errors.precio}</span>}
          </div>

          <div>
            <label>Peso en gramos</label>
            <input name="peso" type="number" value={form.peso} onChange={handleChange} required min={1} />
            <small>Ingresa el peso en gramos (ej: 500 para 500g)</small>
            {errors.peso && <span className="error-text">{errors.peso}</span>}
          </div>

          <div>
            <label>Categoría</label>
            <select name="categoria" value={form.categoria} onChange={handleChange} required>
              {Object.keys(categorias).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categoria && <span className="error-text">{errors.categoria}</span>}
          </div>

          <div>
            <label>Subcategoría</label>
            <select name="subcategoria" value={form.subcategoria} onChange={handleChange} required>
              {categorias[form.categoria].map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {errors.subcategoria && <span className="error-text">{errors.subcategoria}</span>}
          </div>

          <div>
            <label>Imagen</label>
            <input name="imagenFile" type="file" accept=".jpg,.jpeg,.png,.svg,.webp" onChange={handleChange} required />
            {errors.imagenFile && <span className="error-text">{errors.imagenFile}</span>}
          </div>

          <div style={{ marginTop: 8 }}>
            <button type="submit" className="btn-editar" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoProductoPage;
