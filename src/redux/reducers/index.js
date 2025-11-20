import { combineReducers } from 'redux';
import authReducer from './auth-reducer';
import productosReducer from './productos-reducer';
import cartReducer from './cart-reducer';
import pedidosReducer from './pedidos-reducer';
import usuariosReducer from './usuarios-reducer';
import categoriasReducer from './categorias-reducer';
import carouselReducer from './carousel-reducer';
import inventarioReducer from './inventario-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  productos: productosReducer,
  cart: cartReducer,
  pedidos: pedidosReducer,
  usuarios: usuariosReducer,
  categorias: categoriasReducer,
  carousel: carouselReducer,
  inventario: inventarioReducer,
});

export default rootReducer;
