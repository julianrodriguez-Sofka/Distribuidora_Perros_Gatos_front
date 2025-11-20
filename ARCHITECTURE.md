# 🏗️ Arquitectura del Sistema – Gatos y Perros

Este documento describe la arquitectura del **MVP del sistema distribuido de gestión de pedidos** del Equipo 3.  
El enfoque es **desacoplado, asíncrono y escalable**, diseñado para soportar alta concurrencia desde el primer día.

---

## 🎯 Objetivo Técnico

Construir un sistema donde:
- La **recepción de pedidos** sea rápida e independiente del procesamiento.
- El **procesamiento de pedidos** (inventario, pago, logística) ocurra de forma **asíncrona y resiliente**.
- El frontend muestre información **eventualmente consistente** del catálogo y estado de pedidos.

---

## 🧱 Diagrama Lógico
+-------------+ HTTP +----------------+ Mensaje +------------------+
| | --------------> | | --------------------> | |
| Frontend | | API | | Worker |
| (React) | <-------------- | (Recepción) | <-------------------- | (Procesamiento) |
| | JSON | | RabbitMQ | |
+-------------+ +----------------+ +------------------+
↑ ↑
| |
| +--> Publica a cola: pedidos.nuevos
|
+-- Consulta estado desde: +--> Actualiza estado en DB
base de datos (lectura)

---

## 📦 Componentes del Sistema

### 1. **Frontend (React)**
- Muestra catálogo de productos (con imágenes en WebP/JPEG).
- Permite añadir productos al carrito (sin reservar stock).
- Envía pedidos a la API al confirmar compra.
- Consulta estado de pedidos (lectura eventualmente consistente).
- **Accesibilidad**: cumple WCAG 2.1 Nivel A (contraste, navegación por teclado, `alt` en imágenes).

### 2. **API de Recepción (`api/`)**
- Tecnología: FastAPI (Python) o Node.js.
- Endpoint único crítico: `POST /pedidos`.
- **Solo recibe y encola** el pedido → responde en <100ms.
- **No procesa negocio**: no valida stock ni paga.
- Publica mensaje JSON en la cola `pedidos.nuevos` de RabbitMQ.

### 3. **Message Broker: RabbitMQ**
- Actúa como **buffer asíncrono** entre API y Worker.
- Cola: `pedidos.nuevos` (duradera, persistente).
- Garantiza que **ningún pedido se pierda** si el worker falla.
- Interfaz de administración en `http://localhost:15672`.

### 4. **Worker de Procesamiento (`worker/`)**
- Tecnología: Python (con `pika`) o Node.js.
- Consume mensajes de la cola `pedidos.nuevos`.
- Ejecuta pasos en secuencia:
  1. **Valida inventario** (actualización atómica en BD).
  2. **Simula procesamiento de pago**.
  3. **Actualiza estado del pedido** en la base de datos.
- Si falla, el mensaje **se reencola o se archiva** (según configuración).

### 5. **Base de Datos**
- **PostgreSQL**: almacena pedidos, productos e inventario.
- Tabla clave: `inventario(producto_id, cantidad)`.
- Actualizaciones con control de concurrencia:
  ```sql
  UPDATE inventario SET cantidad = cantidad - 1
  WHERE producto_id = $1 AND cantidad > 0;

   Estructura de Archivos en Backend (FastAPI)
   backend/
├── app/
│   ├── main.py
│   ├── routes/
│   │   └── productos.py        # ← Endpoint /api/v1/productos/catalogo
│   ├── crud/
│   │   └── producto.py         # Lógica de consulta a BD
│   └── models/
│       └── producto.py         # Pydantic response model
└── uploads/products/           # Volumen Docker (solo escritura en otras HUs)

🧪 Ejemplo de Respuesta Exitosa
{
  "Perros": {
    "Alimento": [
      {
        "id": "1",
        "nombre": "Alimento Premium para Perros",
        "precio": 24.99,
        "peso": 1500,
        "stock": 0,
        "categoria": "Perros",
        "subcategoria": "Alimento",
        "imagenUrl": "/uploads/products/alimento-perro.webp"
      }
    ],
    "Accesorios": [],
    "Productos de aseo": []
  },
  "Gatos": {
    "Alimento": [],
    "Accesorios": [],
    "Productos de aseo": []
  }
}