````markdown
# 💬 Instrucciones Técnicas para Implementar la HU: "Chatbot Max - Asistente Virtual"

**Objetivo**: Implementar un chatbot frontend interactivo que ayude a los usuarios a navegar el sitio web, responder preguntas frecuentes sobre productos, envíos, pagos y cuenta, y mejorar la experiencia de usuario con sugerencias contextuales. Este documento está pensado para ser leído y ejecutado por una IA o por un desarrollador.

---

## ⚙️ Alcance

### Frontend (React)
- Componente de chatbot flotante persistente en todas las páginas
- Base de conocimiento local con 15+ categorías de respuestas
- Sugerencias rápidas contextuales
- Interfaz conversacional con avatar "Max" (mascota perruna)
- Animaciones de "typing" para respuestas naturales

### Backend (No requerido actualmente)
- El chatbot es **100% frontend** con lógica basada en keywords
- **Evolución futura**: Conectar con OpenAI API o servicio de IA para respuestas dinámicas
- **Evolución futura**: Registrar conversaciones en BD para análisis

---

## 🧾 Arquitectura del Chatbot

### Tipo: **Rule-Based Chatbot** (Basado en Reglas)
- **Método**: Pattern matching con keywords
- **Ventajas**: No requiere backend, respuesta instantánea, sin costos de API
- **Limitaciones**: Respuestas predefinidas, no aprende de conversaciones

### Base de Conocimiento
Categorías implementadas:
1. **greetings**: Saludos iniciales
2. **productos**: Catálogo general
3. **envios**: Información de entregas
4. **pagos**: Métodos de pago
5. **cuenta**: Registro y login
6. **pedidos**: Seguimiento de órdenes
7. **contacto**: Soporte y comunicación
8. **horario**: Atención y disponibilidad
9. **perros**: Productos caninos
10. **gatos**: Productos felinos
11. **ofertas**: Promociones y descuentos
12. **ayuda**: Guía general
13. **beneficios**: Ventajas de cuenta
14. **seguridad**: Protección de datos
15. **alimentos**: Nutrición para mascotas

---

## 🎨 Componente Frontend

### **Chatbot.js** - Componente Principal

**Ubicación**: `src/components/chatbot/Chatbot.jsx` o `.js`

**Props**: Ninguno (componente autónomo)

**Estado**:
```javascript
const [isOpen, setIsOpen] = useState(false);              // Ventana abierta/cerrada
const [messages, setMessages] = useState([...]);          // Historial de mensajes
const [inputValue, setInputValue] = useState('');         // Input del usuario
const [isTyping, setIsTyping] = useState(false);          // Bot está "escribiendo"
const [showSuggestions, setShowSuggestions] = useState(true); // Mostrar botones
```

**Estructura de mensaje**:
```javascript
{
  type: 'user' | 'bot',
  text: string,
  timestamp: Date,
  suggestions?: string[]  // Solo para mensajes del bot
}
```

---

## 🧩 Funcionalidades del Chatbot

### 1. **Botón Flotante Toggle**

```jsx
<button className="chatbot-toggle" onClick={toggleChat}>
  {isOpen ? (
    <CloseIcon />
  ) : (
    <>
      <img src="/max-dog-avatar.svg" alt="Max" />
      <span className="chatbot-badge">Max</span>
    </>
  )}
</button>
```

**Comportamiento**:
- Fixed position: bottom-right (20px de margen)
- Z-index alto para flotar sobre todo
- Badge con nombre "Max" cuando está cerrado
- Animación de entrada/salida

---

### 2. **Ventana de Chat**

**Header**:
- Avatar de Max
- Nombre: "Max - Asistente Virtual"
- Estado: "En línea" con dot verde
- Botón de cerrar

**Body (Mensajes)**:
- Scroll automático al último mensaje
- Mensajes del usuario (derecha, azul)
- Mensajes del bot (izquierda, gris, con avatar)
- Timestamp en cada mensaje
- Animación de "typing" (3 dots pulsantes)

**Footer (Input)**:
- Campo de texto para escribir
- Botón de envío (disabled si input vacío)
- Soporte para Enter (envía) y Shift+Enter (salto de línea)

---

### 3. **Sistema de Respuestas**

**Algoritmo de Pattern Matching**:
```javascript
const findBestResponse = (userMessage) => {
  const normalized = userMessage.toLowerCase().trim();
  
  // 1. Detectar saludos
  if (['hola', 'buenos', 'buenas'].some(w => normalized.includes(w))) {
    return knowledgeBase.greetings;
  }
  
  // 2. Buscar keywords en base de conocimiento
  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (value.keywords?.some(kw => normalized.includes(kw))) {
      return {
        text: value.response,
        suggestions: value.suggestions
      };
    }
  }
  
  // 3. Respuesta por defecto
  return defaultResponse;
};
```

**Tiempo de Respuesta Simulado**:
```javascript
setTimeout(() => {
  // Bot responde después de 800-1200ms aleatorio
  setMessages(prev => [...prev, botMessage]);
  setIsTyping(false);
}, 800 + Math.random() * 400);
```

---

### 4. **Sugerencias Rápidas**

Después de cada respuesta del bot, mostrar botones con opciones:

```jsx
<div className="message-suggestions">
  {message.suggestions.map(suggestion => (
    <button 
      className="message-suggestion-btn"
      onClick={() => handleSuggestionClick(suggestion)}
    >
      {suggestion}
    </button>
  ))}
</div>
```

**Comportamiento**:
- Solo se muestran en el último mensaje del bot
- Al hacer clic, se auto-envía como mensaje del usuario
- Ocultar mientras el bot está "typing"

---

## 📋 Base de Conocimiento Completa

### Estructura de cada categoría:
```javascript
{
  keywords: ['palabra1', 'palabra2', ...],  // Palabras clave para detectar
  response: "Texto de respuesta del bot",
  suggestions: ['Opción 1', 'Opción 2', ...]  // Botones de seguimiento
}
```

### Ejemplos de Respuestas:

**Productos**:
- Keywords: `['producto', 'productos', 'comprar', 'catálogo']`
- Respuesta: "¡Tenemos productos increíbles para todas las mascotas! 🐕🐱 Puedes ver nuestro catálogo completo en la página principal."
- Sugerencias: `['Productos para perros', 'Productos para gatos', 'Ver ofertas']`

**Envíos**:
- Keywords: `['envío', 'envio', 'entrega', 'delivery']`
- Respuesta: "¡Hacemos envíos a todo el país! 📦 Tiempos de entrega: 2-5 días hábiles."
- Sugerencias: `['Costo de envío', 'Rastrear mi pedido', 'Métodos de pago']`

**Pagos**:
- Keywords: `['pago', 'pagos', 'tarjeta', 'efectivo']`
- Respuesta: "Aceptamos tarjetas de crédito/débito, transferencias, Nequi, Daviplata, Addi Sistecredito y Efectivo 💳"
- Sugerencias: `['¿Es seguro?', 'Información de envíos', 'Crear cuenta']`

---

## 🎨 Estilos CSS (Chatbot.css)

### Variables CSS:
```css
:root {
  --chatbot-primary: #3b82f6;    /* Azul para mensajes de usuario */
  --chatbot-secondary: #f3f4f6;  /* Gris para mensajes del bot */
  --chatbot-accent: #10b981;     /* Verde para status online */
  --chatbot-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
```

### Botón Flotante:
```css
.chatbot-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: var(--chatbot-shadow);
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.chatbot-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}
```

### Ventana de Chat:
```css
.chatbot-window {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--chatbot-shadow);
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: scale(0.9) translateY(20px);
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 999;
}

.chatbot-window.open {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: all;
}
```

### Mensajes:
```css
.message.user .message-bubble {
  background: var(--chatbot-primary);
  color: white;
  border-radius: 18px 18px 4px 18px;
  margin-left: auto;
}

.message.bot .message-bubble {
  background: var(--chatbot-secondary);
  color: #1f2937;
  border-radius: 4px 18px 18px 18px;
}

.message-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.message-suggestion-btn {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.message-suggestion-btn:hover {
  background: #f9fafb;
  border-color: var(--chatbot-primary);
  color: var(--chatbot-primary);
  transform: translateY(-2px);
}
```

### Animación de Typing:
```css
.message-bubble.typing {
  padding: 16px 20px;
  display: flex;
  gap: 4px;
}

.message-bubble.typing span {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.message-bubble.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.message-bubble.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}
```

---

## 📱 Responsividad

### Mobile (< 480px):
```css
@media (max-width: 480px) {
  .chatbot-window {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  
  .chatbot-toggle {
    bottom: 16px;
    right: 16px;
    width: 56px;
    height: 56px;
  }
}
```

---

## 🔧 Integración en la App

### App.js:
```jsx
import Chatbot from './components/chatbot/Chatbot';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Todas las rutas */}
        </Routes>
        <Footer />
        
        {/* Chatbot disponible en todas las páginas */}
        <Chatbot />
      </div>
    </Router>
  );
}
```

---

## ✅ Criterios de Aceptación

### AC 1: Chatbot visible en todas las páginas
- **Dado**: Usuario navega por cualquier página
- **Cuando**: Carga la página
- **Entonces**: Botón flotante de Max visible en esquina inferior derecha

### AC 2: Respuestas instantáneas a keywords
- **Dado**: Usuario escribe "envíos" o "entrega"
- **Cuando**: Envía el mensaje
- **Entonces**: Max responde información sobre envíos en < 1.5 segundos

### AC 3: Sugerencias contextuales
- **Dado**: Max responde una pregunta
- **Cuando**: Respuesta aparece
- **Entonces**: Mostrar 3-4 botones con temas relacionados

### AC 4: Historial de conversación
- **Dado**: Usuario hace múltiples preguntas
- **Cuando**: Revisa el chat
- **Entonces**: Ver todo el historial de mensajes ordenado cronológicamente

### AC 5: Animaciones fluidas
- **Dado**: Bot va a responder
- **Cuando**: Usuario espera
- **Entonces**: Mostrar animación de "typing" con 3 dots pulsantes

### AC 6: Responsive design
- **Dado**: Usuario en mobile
- **Cuando**: Abre el chat
- **Entonces**: Ventana ocupa pantalla completa

---

## 🚀 Evolución Futura (Backend)

### Fase 2: Integración con IA

**Opción A: OpenAI GPT**
```javascript
// services/chatbot-service.js
import apiClient from './api-client';

class ChatbotService {
  async sendMessage(message, conversationHistory) {
    const response = await apiClient.post('/chatbot/message', {
      message,
      history: conversationHistory
    });
    return response.data;
  }
}
```

**Backend Endpoint**:
```python
# routers/chatbot.py
@router.post("/chatbot/message")
async def chat(request: ChatRequest):
    # Llamar OpenAI API con context del negocio
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Eres Max, asistente de Distribuidora Perros y Gatos..."},
            {"role": "user", "content": request.message}
        ]
    )
    return {"response": response.choices[0].message.content}
```

### Fase 3: Analytics y Mejora Continua

**Tabla: `ChatbotConversations`**
```sql
CREATE TABLE ChatbotConversations (
    id INT PRIMARY KEY,
    usuario_id INT,
    mensaje_usuario TEXT,
    respuesta_bot TEXT,
    categoria VARCHAR(50),
    fue_util BOOLEAN,
    created_at DATETIME
);
```

**Métricas a rastrear**:
- Preguntas más frecuentes
- Satisfacción del usuario (👍/👎 en cada respuesta)
- Temas sin respuesta adecuada
- Tiempo promedio de conversación

---

## ✅ Checklist Técnico

### Frontend
- [x] Componente `Chatbot.jsx` implementado
- [x] Base de conocimiento con 15+ categorías
- [x] Botón flotante toggle
- [x] Ventana de chat con header/body/footer
- [x] Sistema de mensajes (user/bot)
- [x] Animación de "typing"
- [x] Sugerencias rápidas con botones
- [x] Auto-scroll al último mensaje
- [x] Focus en input al abrir
- [x] Enter envía mensaje
- [x] Timestamps en mensajes
- [x] Estilos CSS completos
- [x] Responsive design (mobile)
- [x] Avatar de Max
- [x] Integración en `App.js`

### Backend (Futuro)
- [ ] Endpoint `POST /api/chatbot/message` con OpenAI
- [ ] Tabla `ChatbotConversations` para analytics
- [ ] Sistema de feedback (útil/no útil)
- [ ] Dashboard de métricas de chat
- [ ] Rate limiting para prevenir abuso

---

## 🎯 Personalización de Respuestas

### Agregar nueva categoría:
```javascript
// En knowledgeBase
nuevo_tema: {
  keywords: ['keyword1', 'keyword2'],
  response: "Respuesta del bot aquí 🐾",
  suggestions: [
    "Opción relacionada 1",
    "Opción relacionada 2"
  ]
}
```

### Mejorar detección:
```javascript
// Agregar sinónimos y variaciones
envios: {
  keywords: [
    'envío', 'envio', 'envíos', 'envios',
    'entrega', 'delivery', 'domicilio',
    'despacho', 'courier', 'mensajería'
  ],
  // ...
}
```

---

**Archivo**: `HU/INSTRUCTIONS_HU_CHATBOT.md`

````
