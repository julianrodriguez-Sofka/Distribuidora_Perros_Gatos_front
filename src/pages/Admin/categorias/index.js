import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategorias, createCategoria, createSubcategoria, updateCategoria } from '../../../redux/actions/categorias-actions';
import { useToast } from '../../../hooks/use-toast';
import './style.css';

const AdminCategoriasPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items: categorias = [], isLoading: loading } = useSelector(state => state.categorias || { items: [], isLoading: false });

  const [newNombre, setNewNombre] = useState('');
  const [parentForSub, setParentForSub] = useState('');
  const [newSubNombre, setNewSubNombre] = useState('');

  useEffect(() => {
    dispatch(fetchCategorias());
  }, [dispatch]);

  const onCreateCategoria = async () => {
    const nombre = newNombre.trim();
    if (!nombre || nombre.length < 2) return toast.error('Ingrese un nombre válido (mínimo 2 caracteres)');
    try {
      await dispatch(createCategoria(nombre));
      setNewNombre('');
      toast.success('Categoría creada');
      dispatch(fetchCategorias());
    } catch (err) {
      // backend may send structured error
      const code = err?.response?.data?.error || err?.error;
      if (code === 'nombre_duplicado') toast.error('Nombre de categoría ya existe');
      else toast.error(err?.message || 'Error al crear categoría');
    }
  };

  const onCreateSub = async () => {
    const nombre = newSubNombre.trim();
    if (!parentForSub) return toast.error('Seleccione una categoría padre');
    if (!nombre || nombre.length < 2) return toast.error('Ingrese un nombre válido (mínimo 2 caracteres)');
    try {
      await dispatch(createSubcategoria(parentForSub, nombre));
      setNewSubNombre('');
      toast.success('Subcategoría creada');
      dispatch(fetchCategorias());
    } catch (err) {
      const code = err?.response?.data?.error || err?.error;
      if (code === 'nombre_duplicado') toast.error('Nombre de subcategoría ya existe');
      else toast.error(err?.message || 'Error al crear subcategoría');
    }
  };

  const onRename = async (id, nombre) => {
    const value = (nombre || '').trim();
    if (!value || value.length < 2) return toast.error('Nombre inválido (mínimo 2 caracteres)');
    try {
      await dispatch(updateCategoria(id, value));
      toast.success('Categoría actualizada');
      dispatch(fetchCategorias());
    } catch (err) {
      const code = err?.response?.data?.error || err?.error;
      if (code === 'nombre_duplicado') toast.error('Nombre ya existe');
      else toast.error(err?.message || 'Error al actualizar');
    }
  };

  return (
    <div className="admin-categorias-page">
      <h2>Gestión de Categorías</h2>

      <div className="form-inline">
        <input value={newNombre} onChange={e => setNewNombre(e.target.value)} placeholder="Nueva categoría" />
        <button onClick={onCreateCategoria}>Crear</button>
      </div>

      <div className="form-inline">
        <select value={parentForSub} onChange={e => setParentForSub(e.target.value)}>
          <option value="">Seleccionar categoría padre</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <input value={newSubNombre} onChange={e => setNewSubNombre(e.target.value)} placeholder="Nueva subcategoría" />
        <button onClick={onCreateSub}>Crear subcategoría</button>
      </div>

      {loading ? <div>Cargando...</div> : (
        <div>
          {(categorias || []).map(cat => (
            <div className="categoria-block" key={cat.id}>
              <div className="categoria-header">
                <div>
                  <strong>{cat.nombre}</strong>
                  <div className="categoria-meta">ID: {cat.id}</div>
                </div>
                <div>
                  <InlineRename initial={cat.nombre} onSave={(name) => onRename(cat.id, name)} />
                </div>
              </div>
              <ul className="subcategoria-list">
                {(cat.subcategorias || []).map(sub => (
                  <li key={sub.id}>{sub.nombre} <small className="categoria-meta">(ID: {sub.id})</small></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InlineRename = ({ initial, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);

  useEffect(() => setValue(initial), [initial]);

  return (
    <div>
      {editing ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={value} onChange={e => setValue(e.target.value)} />
          <button onClick={() => { onSave(value); setEditing(false); }}>Guardar</button>
          <button onClick={() => { setValue(initial); setEditing(false); }}>Cancelar</button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)}>Editar</button>
      )}
    </div>
  );
};

export default AdminCategoriasPage;
export { AdminCategoriasPage };





