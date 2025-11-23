import { categoriasService } from '../../services/categorias-service';

export const fetchCategorias = () => async (dispatch) => {
  dispatch({ type: 'FETCH_CATEGORIAS_REQUEST' });
  try {
    const data = await categoriasService.getAll();
    dispatch({ type: 'FETCH_CATEGORIAS_SUCCESS', payload: data });
  } catch (err) {
    dispatch({ type: 'FETCH_CATEGORIAS_FAILURE', payload: err.message });
  }
};

export const createCategoria = (nombre) => async (dispatch) => {
  try {
    const created = await categoriasService.createCategory(nombre);
    dispatch({ type: 'CREATE_CATEGORIA_SUCCESS', payload: created });
    return created;
  } catch (err) {
    throw err;
  }
};

export const createSubcategoria = (categoriaPadreId, nombre) => async (dispatch) => {
  try {
    const created = await categoriasService.createSubcategory(categoriaPadreId, nombre);
    dispatch({ type: 'CREATE_SUBCATEGORIA_SUCCESS', payload: created });
    return created;
  } catch (err) {
    throw err;
  }
};

export const updateCategoria = (id, nombre) => async (dispatch) => {
  try {
    const updated = await categoriasService.updateCategory(id, nombre);
    dispatch({ type: 'UPDATE_CATEGORIA_SUCCESS', payload: updated });
    return updated;
  } catch (err) {
    throw err;
  }
};
