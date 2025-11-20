import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../../../services/usuarios-service';
import { Input, Button } from '../../../components/ui/index';
import { toast } from '../../../utils/toast';
import './style.css';

export const AdminUsuariosPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading } = useSelector((state) => state.usuarios);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    try {
      dispatch({ type: 'FETCH_USERS_REQUEST' });
      const data = await usuariosService.getAllUsers();
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: data });
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    dispatch({ type: 'SET_USER_SEARCH_QUERY', payload: query });
  };

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.id.toLowerCase().includes(query) ||
      user.nombreCompleto.toLowerCase().includes(query) ||
      user.cedula.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleViewProfile = (userId) => {
    navigate(`/admin/usuarios/${userId}`);
  };

  return (
    <div className="admin-usuarios-page">
      <div className="page-header">
        <h1 className="page-title">Gestión de Usuarios</h1>
      </div>

      <div className="search-bar">
        <Input
          type="text"
          placeholder="Buscar por ID, nombre, cédula o correo"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <div className="loading">Cargando usuarios...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron usuarios.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombreCompleto}</td>
                  <td>{user.cedula}</td>
                  <td>{user.email}</td>
                  <td>{user.direccionEnvio}</td>
                  <td>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleViewProfile(user.id)}
                    >
                      Ver perfil
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

