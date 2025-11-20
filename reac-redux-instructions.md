# Lineamientos de Programación en React con TypeScript Estricto

- Responde siempre en español
- El código siempre debe de estar en inglés

Esta es una guía detallada para organizar un proyecto React con TypeScript estricto, siguiendo buenas prácticas de estructura y nomenclatura.

## 1. Tecnologías Base

- **React**: Versión actualizada con Hooks
- **TypeScript**: Implementación estricta sin uso de `any`
- **Enrutamiento**: React Router DOM
- **Gestión de Estado**:
  - Redux Toolkit para estado global y compartido

## 2. Configuración de TypeScript Estricto

Para garantizar un tipado estricto, tu `tsconfig.json` debe incluir:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

## 3. Buenas Prácticas de TypeScript

- **Evitar `any` completamente**: Usar `unknown` cuando sea necesario un tipo flexible
- **Definir interfaces o types para todo**: Props, estados, respuestas de API, etc.
- **Usar genéricos** para funciones y componentes reutilizables
- **Implementar tipos para funciones asíncronas** claramente

```typescript
// ❌ Evitar
const fetchData = async () => {
  const response = await fetch("/api/data");
  return await response.json();
};

// ✅ Correcto
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
}

const fetchUsuarios = async (): Promise<Usuario[]> => {
  const response = await fetch("/api/usuarios");
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return (await response.json()) as Usuario[];
};
```

## 4. Estructura de Carpetas y Archivos

### 4.1 Nomenclatura

- **Formato de archivos y carpetas**: kebab-case (ej: `mi-componente`, `pagina-inicio`)
- **Extensiones**:
  - `.tsx` para componentes React
  - `.ts` para archivos de TypeScript sin JSX
  - `.css` para estilos

### 4.2 Estructura Raíz del Proyecto

```text
proyecto/
├── public/                 # Archivos estáticos accesibles públicamente
│   ├── favicon.ico         # Favicon
│   └── assets/             # Otros activos estáticos (imágenes, fuentes, etc.)
├── src/                    # Código fuente de la aplicación
│   ├── components/         # Componentes compartidos
│   ├── hooks/              # Hooks globales compartidos
│   ├── pages/              # Páginas/vistas de la aplicación
│   ├── routes/             # Configuración de rutas con react-router-dom
│   ├── types/              # Tipos globales
│   ├── styles/             # Estilos globales
│   ├── services/           # Servicios para llamadas a API
│   ├── store/              # Gestión de estado (Redux Toolkit)
│   ├── utils/              # Funciones utilitarias
│   ├── App.tsx             # Componente principal de la aplicación
│   ├── main.tsx            # Punto de entrada (con React 18+ y ReactDOM.createRoot)
│   └── vite-env.d.ts       # Declaraciones de tipos para Vite (si aplica)
├── index.html              # Archivo HTML principal
├── package.json            # Dependencias del proyecto
├── tsconfig.json           # Configuración de TypeScript
├── vite.config.ts          # Configuración de Vite (o el bundler que uses)
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Documentación del proyecto
```

### 4.3 Estructura de Componentes

Cada componente sigue esta estructura:

```text
components/
├── ui/                     # Componentes de UI básicos
│   ├── boton/
│   │   ├── index.tsx       # Componente principal
│   │   ├── style.css       # Estilos específicos del componente
│   │   ├── index.types.ts  # Tipos específicos del componente
│   │   ├── index.hooks.ts  # Hooks específicos del componente (opcional)
│   │   └── index.utils.ts  # Utilidades específicas (opcional)
│   ├── tarjeta/
│   │   ├── index.tsx
│   │   └── ...
├── formularios/            # Componentes de formularios
│   ├── campo-texto/
│   │   ├── index.tsx
│   │   └── ...
│   ├── selector/
│   │   ├── index.tsx
│   │   └── ...
├── diseño/                 # Componentes de layout
│   ├── encabezado/
│   │   ├── index.tsx
│   │   └── ...
│   ├── pie-pagina/
│   │   ├── index.tsx
│   │   └── ...
└── caracteristicas/        # Componentes de características específicas
    ├── tabla-usuarios/
    │   ├── index.tsx
    │   └── ...
    ├── grafico-ventas/
    │   ├── index.tsx
    │   └── ...
```

### 4.4 Estructura de Páginas

Las páginas representan vistas completas que serán enrutadas por React Router:

```text
pages/
├── inicio/
│   ├── index.tsx           # Componente principal de la página de inicio
│   ├── style.css           # Estilos específicos de la página
│   ├── index.types.ts      # Tipos específicos de la página
│   ├── index.hooks.ts      # Hooks específicos de la página
│   └── index.utils.ts      # Utilidades específicas (opcional)
├── usuarios/
│   ├── index.tsx           # Lista de usuarios
│   ├── detalle/
│   │   ├── index.tsx       # Detalle de usuario (para ruta /usuarios/:id)
│   │   └── ...
│   └── ...
└── ...
```

### 4.5 Configuración de Rutas

```text
routes/
├── index.tsx               # Configuración principal de rutas
├── protected-route.tsx     # Componente para rutas protegidas (si aplica)
└── route-utils.ts          # Utilidades para enrutamiento
```

Ejemplo de configuración de rutas con React Router:

```typescript
// routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "../components/diseño/layout";
import Inicio from "../pages/inicio";
import NotFound from "../pages/not-found";

// Carga perezosa para rutas menos frecuentes
const Usuarios = lazy(() => import("../pages/usuarios"));
const DetalleUsuario = lazy(() => import("../pages/usuarios/detalle"));
const Configuracion = lazy(() => import("../pages/configuracion"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Inicio />,
      },
      {
        path: "usuarios",
        element: (
          <Suspense fallback={<div>Cargando...</div>}>
            <Usuarios />
          </Suspense>
        ),
      },
      {
        path: "usuarios/:id",
        element: (
          <Suspense fallback={<div>Cargando...</div>}>
            <DetalleUsuario />
          </Suspense>
        ),
      },
      {
        path: "configuracion",
        element: (
          <Suspense fallback={<div>Cargando...</div>}>
            <Configuracion />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export const Router: FC = () => {
  return <RouterProvider router={router} />;
};
```

### 4.6 Estructura para Redux Toolkit

```text
store/
├── index.ts                # Configuración del store
├── features/               # Estado organizado por características
│   ├── usuarios/
│   │   ├── usuarios-slice.ts
│   │   └── usuarios-selectors.ts
│   ├── productos/
│   │   ├── productos-slice.ts
│   │   └── productos-selectors.ts
└── hooks/                  # Hooks personalizados para el estado
    ├── use-app-dispatch.ts
    └── use-app-selector.ts
```

### 4.7 Estructura de Servicios

```text
services/
├── api-client.ts           # Cliente base para API
├── usuarios/
│   └── usuarios-service.ts # Métodos para interactuar con APIs de usuarios
├── productos/
│   └── productos-service.ts
```

### 4.8 Manejo de Variables de Entorno

React proporciona soporte para variables de entorno prefijadas con `REACT_APP_`.

#### Estructura de Archivos para Variables de Entorno

```text
├── .env                    # Variables compartidas en todos los entornos (no commitear)
├── .env.local              # Variables locales para desarrollo (no commitear)
├── .env.development        # Variables específicas de desarrollo (se puede commitear)
├── .env.production         # Variables específicas de producción (se puede commitear)
├── .env.test               # Variables específicas para pruebas (se puede commitear)
```

#### Tipado de Variables de Entorno

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";

    // Variables de entorno personalizadas
    REACT_APP_API_URL: string;
    REACT_APP_VERSION: string;
    REACT_APP_AUTH_DOMAIN: string;
  }
}
```

#### Uso en Código

```typescript
const apiUrl = process.env.REACT_APP_API_URL;
```

#### Validación de Variables de Entorno

```typescript
// utils/env-validation.ts
export function validateEnv(): void {
  const requiredEnvVars = ["REACT_APP_API_URL", "REACT_APP_AUTH_DOMAIN"];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Faltan las siguientes variables de entorno: ${missingEnvVars.join(", ")}`
    );
  }
}

// En archivo principal
import { validateEnv } from "./utils/env-validation";

validateEnv();
```

## 5. Gestión de Estado con Redux Toolkit

Redux Toolkit ofrece una forma más sencilla y efectiva de implementar Redux, reduciendo el boilerplate y aplicando buenas prácticas de forma predeterminada.

### 5.1. Configuración del Store

```typescript
// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import usuariosReducer from "./features/usuarios/usuarios-slice";
import productosReducer from "./features/productos/productos-slice";
import autenticacionReducer from "./features/autenticacion/autenticacion-slice";

export const store = configureStore({
  reducer: {
    usuarios: usuariosReducer,
    productos: productosReducer,
    autenticacion: autenticacionReducer,
  },
  // Middleware opcional, devTools, etc.
});

// Exportar tipos para usar en toda la aplicación
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 5.2. Creación de un Slice

```typescript
// store/features/usuarios/usuarios-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { usuariosService } from "../../../services/usuarios/usuarios-service";
import type { Usuario } from "../../../types/usuario";

interface UsuariosState {
  usuarios: Usuario[];
  usuarioSeleccionado: Usuario | null;
  cargando: boolean;
  error: string | null;
}

const initialState: UsuariosState = {
  usuarios: [],
  usuarioSeleccionado: null,
  cargando: false,
  error: null,
};

// Thunks asíncronos
export const obtenerUsuarios = createAsyncThunk(
  "usuarios/obtenerUsuarios",
  async (_, { rejectWithValue }) => {
    try {
      return await usuariosService.obtenerTodos();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  }
);

export const agregarUsuario = createAsyncThunk(
  "usuarios/agregarUsuario",
  async (usuario: Omit<Usuario, "id">, { rejectWithValue }) => {
    try {
      return await usuariosService.crear(usuario);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  }
);

// Slice
const usuariosSlice = createSlice({
  name: "usuarios",
  initialState,
  reducers: {
    seleccionarUsuario: (state, action: PayloadAction<string>) => {
      state.usuarioSeleccionado =
        state.usuarios.find((u) => u.id === action.payload) || null;
    },
    limpiarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener usuarios
      .addCase(obtenerUsuarios.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerUsuarios.fulfilled, (state, action) => {
        state.usuarios = action.payload;
        state.cargando = false;
      })
      .addCase(obtenerUsuarios.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string;
      })
      // Agregar usuario
      .addCase(agregarUsuario.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(agregarUsuario.fulfilled, (state, action) => {
        state.usuarios.push(action.payload);
        state.cargando = false;
      })
      .addCase(agregarUsuario.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string;
      });
  },
});

// Exportar acciones y reducer
export const { seleccionarUsuario, limpiarError } = usuariosSlice.actions;
export default usuariosSlice.reducer;
```

### 5.3. Hooks Personalizados para Redux

```typescript
// store/hooks/use-app-dispatch.ts
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../index";

// Usar este custom hook en lugar de useDispatch directamente
export const useAppDispatch = () => useDispatch<AppDispatch>();

// store/hooks/use-app-selector.ts
import { useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../index";

// Usar este custom hook en lugar de useSelector directamente
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 5.4. Selectores

```typescript
// store/features/usuarios/usuarios-selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../index";

// Selector base
const selectUsuariosState = (state: RootState) => state.usuarios;

// Selectores derivados
export const selectUsuarios = createSelector(
  selectUsuariosState,
  (usuariosState) => usuariosState.usuarios
);

export const selectUsuarioSeleccionado = createSelector(
  selectUsuariosState,
  (usuariosState) => usuariosState.usuarioSeleccionado
);

export const selectUsuariosCargando = createSelector(
  selectUsuariosState,
  (usuariosState) => usuariosState.cargando
);

export const selectUsuariosError = createSelector(
  selectUsuariosState,
  (usuariosState) => usuariosState.error
);

export const selectUsuariosActivos = createSelector(
  selectUsuarios,
  (usuarios) => usuarios.filter((usuario) => usuario.activo)
);
```

### 5.5. Uso en Componentes

```typescript
// Componente que usa Redux
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  obtenerUsuarios,
  seleccionarUsuario,
} from "../../store/features/usuarios/usuarios-slice";
import {
  selectUsuarios,
  selectUsuariosCargando,
  selectUsuariosError,
  selectUsuariosActivos,
} from "../../store/features/usuarios/usuarios-selectors";

export const ListaUsuarios: FC = () => {
  const dispatch = useAppDispatch();

  // Estado local para UI
  const [mostrarSoloActivos, setMostrarSoloActivos] = useState(false);

  // Seleccionar estado de Redux
  const usuarios = useAppSelector(selectUsuarios);
  const usuariosActivos = useAppSelector(selectUsuariosActivos);
  const cargando = useAppSelector(selectUsuariosCargando);
  const error = useAppSelector(selectUsuariosError);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    dispatch(obtenerUsuarios());
  }, [dispatch]);

  // Manejar errores
  if (error) return <div className="error">Error: {error}</div>;
  if (cargando) return <div className="loading">Cargando...</div>;

  // Determinar qué lista mostrar
  const listaFiltrada = mostrarSoloActivos ? usuariosActivos : usuarios;

  return (
    <div className="usuarios-lista">
      <div className="controles">
        <label>
          <input
            type="checkbox"
            checked={mostrarSoloActivos}
            onChange={() => setMostrarSoloActivos(!mostrarSoloActivos)}
          />
          Mostrar solo usuarios activos
        </label>
      </div>

      <ul>
        {listaFiltrada.map((usuario) => (
          <li
            key={usuario.id}
            onClick={() => dispatch(seleccionarUsuario(usuario.id))}
          >
            {usuario.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## 6. Principios SOLID para React

### 6.1 Responsabilidad Única (S)

- Cada componente debe tener una sola razón para cambiar
- Separa la lógica de negocio de la presentación
- Extrae lógica compleja a hooks personalizados

```typescript
// ❌ Mal: Componente hace demasiadas cosas
function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // Renderizado con lógica mezclada
}

// ✅ Bien: Separar responsabilidades
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return { users, loading };
}

function UserPage() {
  const { users, loading } = useUsers();
  // Solo renderizado
}
```

### 6.2 Abierto/Cerrado (O)

- Componentes extensibles sin modificar su código interno
- Usa composición con children y render props para extender funcionalidad

```typescript
// ✅ Bien: Componente extensible mediante composición
interface CardProps {
  title: string;
  children: ReactNode;
  renderFooter?: () => ReactNode;
}

function Card({ title, children, renderFooter }: CardProps) {
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      <div className="card-body">{children}</div>
      {renderFooter && <div className="card-footer">{renderFooter()}</div>}
    </div>
  );
}

// Uso
<Card title="Usuario" renderFooter={() => <Button>Ver más</Button>}>
  <UserProfile data={userData} />
</Card>;
```

### 6.3 Sustitución de Liskov (L)

- Los componentes hijos deben poder sustituir a sus padres sin alterar el comportamiento
- Respeta los contratos de props en componentes de la misma familia

```typescript
// Interfaz base que define el contrato
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

// Componente base
function Button({ onClick, disabled, children }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// Componente derivado que respeta el contrato
interface PrimaryButtonProps extends ButtonProps {
  size?: "small" | "medium" | "large";
}

function PrimaryButton({
  onClick,
  disabled,
  children,
  size = "medium",
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary btn-${size}`}
    >
      {children}
    </button>
  );
}
```

### 6.4 Segregación de Interfaces (I)

- Define props específicas en lugar de props genéricas
- Prefiere múltiples componentes especializados sobre uno complejo

```typescript
// ❌ Mal: Interfaz monolítica con muchas props opcionales
interface TableProps {
  data: any[];
  sortable?: boolean;
  filterable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  onRowClick?: (row: any) => void;
  // ... muchas más props
}

// ✅ Bien: Interfaces segregadas y componentes compuestos
interface BaseTableProps {
  data: any[];
}

interface SortableProps {
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

function SortableTable({
  data,
  onSort,
  sortColumn,
  sortDirection,
}: BaseTableProps & SortableProps) {
  // Implementación de tabla ordenable
}

function PaginatedTable({
  data,
  pageSize,
  currentPage,
}: BaseTableProps & PaginationProps) {
  // Implementación de tabla paginada
}

// Uso mediante composición
<TableContainer>
  <SortableTable
    data={data}
    onSort={handleSort}
    sortColumn="name"
    sortDirection="asc"
  />
  <TablePagination
    pageSize={10}
    currentPage={1}
    totalItems={data.length}
    onPageChange={handlePageChange}
  />
</TableContainer>;
```

### 6.5 Inversión de Dependencias (D)

- Depende de abstracciones, no implementaciones concretas
- Utiliza inyección de dependencias vía props o Redux

```typescript
// ❌ Mal: Dependencia directa a implementación
function UserList() {
  useEffect(() => {
    fetch("/api/users").then(/* ... */);
  }, []);
}

// ✅ Bien: Inversión de dependencias con inyección vía props
interface UserListProps {
  fetchUsers: () => Promise<User[]>;
}

function UserList({ fetchUsers }: UserListProps) {
  useEffect(() => {
    fetchUsers().then(/* ... */);
  }, [fetchUsers]);
}
```

## 7. Prácticas de Clean Code para React

### 7.1 Nomenclatura

- **Componentes**: PascalCase y nombres descriptivos (`UserProfileCard`, no `Card`)
- **Funciones**: camelCase y verbos para acciones (`handleSubmit`, `fetchUserData`)
- **Hooks**: camelCase con prefijo `use` (`useFormValidation`, `useAuth`)
- **Constantes**: UPPER_SNAKE_CASE para valores verdaderamente constantes
- **Variables de estado**: nombre + verbo setter (`user`, `setUser`)

### 7.2 Estructura de Componentes

- Declaraciones de imports organizadas (externos, internos, estilos)
- Declaraciones de types/interfaces antes del componente
- Hooks al inicio del cuerpo del componente
- Funciones auxiliares dentro del componente para funcionalidad relacionada
- Renderizado con retorno temprano para casos especiales

```typescript
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Tipos antes del componente
interface UserCardProps {
  userId: string;
  showDetails: boolean;
}

export const UserCard: FC<UserCardProps> = ({ userId, showDetails }) => {
  // Hooks agrupados al inicio
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Retorno temprano para casos especiales
  if (loading) {
    return <div className="user-card--loading">Cargando...</div>;
  }

  if (!userData) {
    return <div className="user-card--error">Usuario no encontrado</div>;
  }

  // Funciones auxiliares dentro del componente
  const toggleExpand = (): void => {
    setIsExpanded((prev) => !prev);
  };

  // JSX limpio y legible
  return (
    <div className="user-card">
      <h3>{userData.name}</h3>
      {showDetails && (
        <button onClick={toggleExpand}>
          {isExpanded ? "Ocultar detalles" : "Mostrar detalles"}
        </button>
      )}
      {isExpanded && showDetails && (
        <div className="user-details">
          <p>Email: {userData.email}</p>
          <p>Rol: {userData.role}</p>
        </div>
      )}
    </div>
  );
};
```

### 7.3 Organización de Importaciones

```typescript
// Bibliotecas externas
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Componentes
import { Button } from "../../components/ui/button";
import { ErrorMessage } from "../../components/ui/error-message";

// Hooks, tipos y utilidades
import { useUsuarios } from "./index.hooks";
import type { UsuarioPageProps } from "./index.types";
import { formatearDatos } from "./index.utils";

// Gestión de estado
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { obtenerUsuarios } from "../../store/features/usuarios/usuarios-slice";
import { selectUsuarios } from "../../store/features/usuarios/usuarios-selectors";

// Estilos
import "./style.css";
```

### 7.4 Componentes Puros vs Contenedores

- **Componentes Puros**: Sin estado, solo rendering basado en props
- **Componentes Contenedores**: Manejan estado y lógica, delegan presentación

```typescript
// Componente puro (presentacional)
interface UserCardProps {
  name: string;
  email: string;
  role: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function UserCard({
  name,
  email,
  role,
  isExpanded,
  onToggleExpand,
}: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <button onClick={onToggleExpand}>
        {isExpanded ? "Ocultar detalles" : "Mostrar detalles"}
      </button>
      {isExpanded && (
        <div className="user-details">
          <p>Email: {email}</p>
          <p>Rol: {role}</p>
        </div>
      )}
    </div>
  );
}

// Componente contenedor
function UserCardContainer({ userId }: { userId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    fetchUserData(userId).then((data) => setUserData(data));
  }, [userId]);

  if (!userData) return <div>Cargando...</div>;

  return (
    <UserCard
      name={userData.name}
      email={userData.email}
      role={userData.role}
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
    />
  );
}
```

### 7.5 Props

- Desestructura props para claridad
- Define valores por defecto explícitamente
- Usa TypeScript para validación
- Evita pasar demasiadas props (más de 5-7 es señal de refactor)

### 7.6 Manejo de Estado

#### Prioridades en la Gestión de Estado

1. **Estado Local** - Para componentes aislados (useState, useReducer)
2. **Estado Global** - Redux Toolkit para estado compartido entre componentes

#### Estado Local con Hooks de React

```typescript
function FormularioSimple() {
  const [nombre, setNombre] = useState("");

  return <input value={nombre} onChange={(e) => setNombre(e.target.value)} />;
}
```

#### Estado Complejo

Usa useReducer para lógica de estado compleja:

```typescript
// Definir tipo de estado
interface FormState {
  nombre: string;
  email: string;
  edad: number;
  errores: Record<string, string>;
}

// Definir tipos de acciones
type FormAction =
  | { type: "UPDATE_FIELD"; field: string; value: string | number }
  | { type: "VALIDATE_FORM" }
  | { type: "RESET_FORM" };

// Definir estado inicial
const initialState: FormState = {
  nombre: "",
  email: "",
  edad: 0,
  errores: {},
};

// Crear función reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "VALIDATE_FORM":
      // Implementar lógica de validación
      const errores: Record<string, string> = {};
      if (!state.nombre) errores.nombre = "El nombre es requerido";
      if (!state.email) errores.email = "El email es requerido";
      return { ...state, errores };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

// Usar en componente
function FormularioComplejo() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: "UPDATE_FIELD",
      field: name,
      value: name === "edad" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "VALIDATE_FORM" });
    // Continuar con envío si no hay errores
  };

  return <form onSubmit={handleSubmit}>{/* Campos del formulario */}</form>;
}
```

### 7.7 Efectos Secundarios

- Mantén los efectos enfocados en una sola responsabilidad
- Implementa limpieza adecuada con la función de retorno
- Especifica dependencias de forma explícita, sin eslint-disable
- Extrae efectos complejos a hooks personalizados

```typescript
// ✅ Bien: Efectos separados por responsabilidad
useEffect(() => {
  const fetchData = async () => {
    try {
      const userData = await fetchUserData(userId);
      setUser(userData);
    } catch (error) {
      setError(error);
    }
  };

  fetchData();
}, [userId]);

useEffect(() => {
  document.title = user?.name || "Usuario";
  return () => {
    document.title = "React App";
  };
}, [user?.name]);

useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

### 7.8 Renderizado Condicional

- Usa operadores ternarios para condiciones simples
- Utiliza variables para condiciones complejas
- Considera extraer componentes para reducir anidamiento

```typescript
// Condición simple
{
  isLoggedIn ? <ProfilePage /> : <LoginPage />;
}

// Para condiciones más complejas
const renderContent = () => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!data) {
    return <EmptyState message="No hay datos disponibles" />;
  }

  return <DataTable data={data} />;
};

return <div className="container">{renderContent()}</div>;
```

### 7.9 Manejo de Listas

- Usa keys únicas y estables (no índices del array)
- Extrae componentes de elementos de lista
- Memoiza listas largas con useMemo para evitar recálculos costosos

```typescript
// ✅ Bien: Uso correcto de keys y componente extraído
interface User {
  id: string;
  name: string;
  email: string;
}

// Componente para cada elemento de la lista
const UserListItem: FC<{ user: User }> = ({ user }) => (
  <li className="user-item">
    <h3>{user.name}</h3>
    <p>{user.email}</p>
  </li>
);

// Componente de lista con memoización
const UserList: FC<{ users: User[] }> = ({ users }) => {
  // Memoiza para evitar recrear la lista en cada render
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  return (
    <ul className="user-list">
      {sortedUsers.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
```

### 7.10 Evita Prop Drilling

- Usa Redux para datos que necesitan ser accedidos por múltiples componentes en diferentes niveles

```typescript
// En lugar de pasar props a través de múltiples niveles de componentes:

// Componente en un nivel profundo
const UserActions: FC = () => {
  // Acceder directamente al estado global
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <span>Bienvenido, {user.name}</span>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

// Usar este componente en cualquier lugar de la aplicación
// sin necesidad de pasar props desde componentes padres
```

### 7.11 Optimización de Rendimiento

- Usa useMemo para componentes que reciben las mismas props frecuentemente
- Implementa `useCallback` para funciones pasadas como props
- Usa `useMemo` para cálculos costosos
- Evita renderizados innecesarios identificando re-renders excesivos

```typescript
// Optimización usando useMemo
function UserList({ users }: { users: User[] }) {
  // Memoización de cálculos costosos
  const sortedUsers = useMemo(() => {
    console.log("Recalculando usuarios ordenados");
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // Memoización de callbacks
  const handleUserClick = useCallback((userId: string) => {
    console.log(`Usuario clickeado: ${userId}`);
    // Lógica adicional...
  }, []);

  // Memoización del componente UserCard
  const UserCards = useMemo(() => {
    return sortedUsers.map((user) => (
      <UserCard
        key={user.id}
        user={user}
        onClick={() => handleUserClick(user.id)}
      />
    ));
  }, [sortedUsers, handleUserClick]);

  return <div>{UserCards}</div>;
}
```

## 8. Patrones de Diseño Recomendados

### 8.1 Composición vs Herencia

- Favorece la composición sobre la herencia
- Usa children y render props para compartir funcionalidad

```typescript
// ✅ Bien: Composición con render props y children
interface CollapsibleProps {
  title: string;
  children: ReactNode;
  renderFooter?: () => ReactNode;
}

function Collapsible({ title, children, renderFooter }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible">
      <div className="collapsible-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>{title}</h3>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && <div className="collapsible-content">{children}</div>}

      {isOpen && renderFooter && (
        <div className="collapsible-footer">{renderFooter()}</div>
      )}
    </div>
  );
}

// Uso
<Collapsible
  title="Información del Usuario"
  renderFooter={() => <Button onClick={handleSave}>Guardar cambios</Button>}
>
  <UserForm data={userData} onChange={handleFormChange} />
</Collapsible>;
```

### 8.2 Patrón de Presentación/Contenedor

- Separa la lógica (contenedor) de la presentación (componentes UI)
- Mejora la reusabilidad y testabilidad

```typescript
// Componente de presentación
interface UserFormProps {
  user: User;
  loading: boolean;
  onSubmit: (user: User) => void;
  onChange: (field: string, value: string) => void;
}

function UserForm({ user, loading, onSubmit, onChange }: UserFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={user.name}
        onChange={(e) => onChange("name", e.target.value)}
        disabled={loading}
      />
      {/* Más campos */}
      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}

// Componente contenedor
function UserFormContainer({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  const handleChange = (field: string, value: string) => {
    if (user) {
      setUser({ ...user, [field]: value });
    }
  };

  const handleSubmit = async (updatedUser: User) => {
    setLoading(true);
    try {
      await updateUser(updatedUser);
      // Manejar éxito
    } catch (error) {
      // Manejar error
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <UserForm
      user={user}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
```

### 8.3 Custom Hooks

- Extrae lógica reutilizable a hooks personalizados
- Nombra los hooks claramente según su propósito
- Mantén los hooks simples y enfocados

```typescript
// Custom hook para manejar formularios
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setFieldValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const setFieldTouched = (field: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  };

  const setFieldError = (field: keyof T, error: string | undefined) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldValue(name as keyof T, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFieldTouched(name as keyof T);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    reset,
  };
}

// Uso
function LoginForm() {
  const form = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación y envío
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      {form.touched.email && form.errors.email && (
        <div className="error">{form.errors.email}</div>
      )}

      <input
        type="password"
        name="password"
        value={form.values.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />

      <button type="submit">Login</button>
    </form>
  );
}
```

### 8.4 Manejo de Errores

- Implementa boundaries de error para recuperación elegante
- Usa patrones de renderizado condicional para estados de error
- Centraliza la lógica de manejo de errores

```typescript
// Error Boundary
class ErrorBoundary extends React.Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error capturado:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Hook para manejo de errores en operaciones asíncronas
function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    asyncFn()
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, deps);

  return { data, loading, error };
}

// Uso de Error Boundary
function App() {
  return (
    <ErrorBoundary
      fallback={
        <div className="error-page">
          Algo salió mal. Por favor refresca la página.
        </div>
      }
    >
      <UserProfile userId="123" />
    </ErrorBoundary>
  );
}

// Uso de hook de error asíncrono
function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    loading,
    error,
  } = useAsync(() => fetchUserProfile(userId), [userId]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>Usuario no encontrado</div>;

  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## 9. Ejemplo de Implementación de Componente con Tipado Estricto

```typescript
// components/ui/boton/index.tsx
import { FC } from "react";
import "./style.css";
import type { BotonProps } from "./index.types";

export const Boton: FC<BotonProps> = ({
  children,
  variante = "primario",
  tamaño = "medio",
  deshabilitado = false,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`boton boton-${variante} boton-${tamaño} ${className}`.trim()}
      disabled={deshabilitado}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// components/ui/boton/index.types.ts
export type VarianteBoton = "primario" | "secundario" | "terciario" | "peligro";
export type TamañoBoton = "pequeño" | "medio" | "grande";

export interface BotonProps {
  children: ReactNode;
  variante?: VarianteBoton;
  tamaño?: TamañoBoton;
  deshabilitado?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

// Ejemplo de uso del componente
// pages/usuario/index.tsx
import { ReactElement } from "react";
import { Boton } from "../../components/ui/boton";
import { useNavigate } from "react-router-dom";
import type { UsuariosPageProps } from "./index.types";
import "./style.css";

export default function UsuariosPage({
  initialData,
}: UsuariosPageProps): ReactElement {
  const navigate = useNavigate();

  const handleNuevoUsuario = (): void => {
    navigate("/usuarios/nuevo");
  };

  const handleVerDetalle = (id: string): void => {
    navigate(`/usuarios/${id}`);
  };

  return (
    <div className="usuarios-page">
      <header className="page-header">
        <h1>Gestión de Usuarios</h1>
        <Boton variante="primario" tamaño="medio" onClick={handleNuevoUsuario}>
          Nuevo Usuario
        </Boton>
      </header>

      <div className="usuarios-list">
        {initialData.map((usuario) => (
          <div key={usuario.id} className="usuario-card">
            <h3>{usuario.nombre}</h3>
            <p>{usuario.email}</p>
            <Boton
              variante="secundario"
              tamaño="pequeño"
              onClick={() => handleVerDetalle(usuario.id)}
            >
              Ver Detalles
            </Boton>
          </div>
        ))}
      </div>
    </div>
  );
}

// pages/usuario/index.types.ts
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
}

export interface UsuariosPageProps {
  initialData: Usuario[];
}
```

## 10. Ejemplo de Servicio para API

```typescript
// services/api-client.ts
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptores para manejo de tokens, errores, etc.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Manejo centralizado de errores
    if (error.response?.status === 401) {
      // Redireccionar a login o refrescar token
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// services/usuarios/usuarios-service.ts
import apiClient from "../api-client";
import type { Usuario } from "../../types/usuario";

interface CrearUsuarioDTO {
  nombre: string;
  email: string;
  password: string;
}

interface ActualizarUsuarioDTO {
  nombre?: string;
  email?: string;
  activo?: boolean;
}

export const usuariosService = {
  async obtenerTodos(): Promise<Usuario[]> {
    const response = await apiClient.get<Usuario[]>("/usuarios");
    return response.data;
  },

  async obtenerPorId(id: string): Promise<Usuario> {
    const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  async crear(usuario: CrearUsuarioDTO): Promise<Usuario> {
    const response = await apiClient.post<Usuario>("/usuarios", usuario);
    return response.data;
  },

  async actualizar(
    id: string,
    cambios: ActualizarUsuarioDTO
  ): Promise<Usuario> {
    const response = await apiClient.patch<Usuario>(`/usuarios/${id}`, cambios);
    return response.data;
  },

  async eliminar(id: string): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`);
  },
};
```

## 11. Principios Adicionales

### 11.1 DRY - Don't Repeat Yourself

- Extrae código duplicado a funciones o componentes reutilizables
- Identifica patrones repetitivos y abstráelos
- Utiliza hooks personalizados para lógica reutilizable

### 11.2 KISS - Keep It Simple, Stupid

- Prefiere soluciones simples sobre complejas
- Divide problemas grandes en pequeños manejables
- No sobre-ingenies soluciones

### 11.3 YAGNI - You Aren't Gonna Need It

- No implementes funcionalidades hasta que realmente las necesites
- Evita la "programación anticipada" de características
- Enfócate en los requisitos actuales, no en posibles necesidades futuras