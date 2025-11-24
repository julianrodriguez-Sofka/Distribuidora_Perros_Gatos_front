
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/index';
import ListarProductos from './listar';
import './style.css';

export const AdminProductosPage = () => {
  return (
    <div className="admin-productos-page">
      <div className="page-header">
        <h1 className="page-title">Gestión de Productos</h1>
        <Link to="/admin/productos/nuevo">
          <Button variant="primary">Crear Nuevo Producto</Button>
        </Link>
      </div>
        <ListarProductos />
    </div>
  );
};
