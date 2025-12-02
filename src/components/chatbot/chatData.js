/**
 * Base de conocimientos del chatbot
 * Preguntas frecuentes y respuestas predefinidas
 */

export const chatbotData = {
  greeting: "¡Hola! 👋 Soy el asistente virtual de Distribuidora Perros y Gatos. ¿En qué puedo ayudarte?",
  
  quickOptions: [
    "Horarios de atención",
    "Información de envíos",
    "Métodos de pago",
    "Devoluciones",
    "Catálogo de productos"
  ],

  responses: {
    // Horarios
    "horarios de atención": {
      answer: "📅 Nuestros horarios de atención son:\n\n• Lunes a Viernes: 8:00 AM - 6:00 PM\n• Sábados: 9:00 AM - 2:00 PM\n• Domingos y festivos: Cerrado\n\n¿Necesitas ayuda con algo más?",
      keywords: ["horario", "horarios", "atencion", "abren", "cierran", "abierto"]
    },

    // Envíos
    "información de envíos": {
      answer: "🚚 Información sobre envíos:\n\n• Costo de envío: $5.000 a todo el país\n• Tiempo de entrega: 2-5 días hábiles\n• Cobertura: Todo el territorio nacional\n• Rastreo: Recibirás un código de seguimiento por email\n\n¿Quieres saber algo más?",
      keywords: ["envio", "envios", "entrega", "despacho", "domicilio", "costo", "precio", "shipping"]
    },

    // Métodos de pago
    "métodos de pago": {
      answer: "💳 Aceptamos los siguientes métodos de pago:\n\n• Tarjetas de crédito y débito\n• Efectivo contra entrega\n• Daviplata\n• Nequi\n• Addi (Compra ahora, paga después)\n• Sistecredito\n\nTodos los pagos son 100% seguros. ¿Algo más en lo que pueda ayudarte?",
      keywords: ["pago", "pagos", "tarjeta", "credito", "debito", "efectivo", "daviplata", "nequi", "addi", "sistecredito", "payment"]
    },

    // Devoluciones
    "devoluciones": {
      answer: "🔄 Política de devoluciones:\n\n• Tienes 30 días para devolver productos\n• El producto debe estar sin abrir y en su empaque original\n• Reembolso completo o cambio de producto\n• Alimentos y productos perecederos no aplican\n\nPara iniciar una devolución, contáctanos con tu número de pedido. ¿Necesitas más información?",
      keywords: ["devolucion", "devoluciones", "devolver", "cambio", "reembolso", "return"]
    },

    // Catálogo
    "catálogo de productos": {
      answer: "🐕🐈 Nuestro catálogo incluye:\n\n• Alimentos para perros (todas las razas y edades)\n• Alimentos para gatos (gatitos y adultos)\n• Snacks y premios\n• Accesorios (collares, correas, juguetes)\n• Productos de higiene y cuidado\n\nNavega por nuestra tienda para ver todos los productos disponibles. ¿En qué más puedo ayudarte?",
      keywords: ["catalogo", "productos", "que venden", "tienen", "alimento", "comida", "accesorio"]
    },

    // Registro
    "crear cuenta": {
      answer: "👤 Para crear una cuenta:\n\n1. Haz clic en 'Registro' en el menú superior\n2. Completa el formulario con tus datos\n3. Verifica tu email (recibirás un código)\n4. ¡Listo! Ya puedes hacer pedidos\n\nCon tu cuenta podrás rastrear pedidos y guardar tus direcciones favoritas. ¿Algo más?",
      keywords: ["cuenta", "registro", "registrar", "crear", "perfil", "usuario", "sign up"]
    },

    // Rastreo
    "rastrear pedido": {
      answer: "📦 Para rastrear tu pedido:\n\n1. Inicia sesión en tu cuenta\n2. Ve a 'Mis Pedidos'\n3. Selecciona el pedido que deseas rastrear\n4. Verás el estado actual y número de guía\n\nTambién recibirás actualizaciones por email. ¿Necesitas ayuda con otra cosa?",
      keywords: ["rastrear", "rastreo", "seguimiento", "pedido", "orden", "tracking", "donde esta"]
    },

    // Contacto
    "contacto": {
      answer: "📞 Contáctanos:\n\n• Email: contacto@distribuidorapg.com\n• Teléfono: +57 (1) 234-5678\n• WhatsApp: +57 300 123 4567\n• Chat en línea: De lunes a viernes 8am-6pm\n\nEstamos aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?",
      keywords: ["contacto", "contactar", "telefono", "email", "correo", "whatsapp", "llamar"]
    },

    // Precios
    "precios": {
      answer: "💰 Información sobre precios:\n\n• Todos nuestros precios incluyen IVA\n• Ofertas y descuentos especiales cada semana\n• Descuentos por volumen en pedidos grandes\n• Programa de fidelidad: acumula puntos en cada compra\n\nNavega por la tienda para ver los precios actualizados. ¿Algo más?",
      keywords: ["precio", "precios", "costo", "costos", "cuanto", "vale", "oferta", "descuento"]
    },

    // Default
    "no_match": {
      answer: "🤔 No estoy seguro de entender tu pregunta. Aquí hay algunos temas sobre los que puedo ayudarte:\n\n• Horarios de atención\n• Información de envíos\n• Métodos de pago\n• Devoluciones\n• Catálogo de productos\n• Rastrear pedido\n• Contacto\n\n¿Cuál te interesa?",
      keywords: []
    }
  }
};

/**
 * Busca la mejor respuesta basada en palabras clave
 * @param {string} userMessage - Mensaje del usuario
 * @returns {string} Respuesta del chatbot
 */
export const findBestResponse = (userMessage) => {
  const normalizedMessage = userMessage.toLowerCase().trim();
  
  // Buscar coincidencia exacta con opciones rápidas
  for (const [key, data] of Object.entries(chatbotData.responses)) {
    if (key.toLowerCase() === normalizedMessage) {
      return data.answer;
    }
  }
  
  // Buscar por palabras clave
  let bestMatch = null;
  let maxMatches = 0;
  
  for (const [key, data] of Object.entries(chatbotData.responses)) {
    if (key === 'no_match') continue;
    
    const matches = data.keywords.filter(keyword => 
      normalizedMessage.includes(keyword)
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = data.answer;
    }
  }
  
  // Si no hay coincidencias, devolver respuesta por defecto
  return bestMatch || chatbotData.responses.no_match.answer;
};
