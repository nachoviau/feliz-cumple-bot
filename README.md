# WhatsApp Birthday Bot 🎉

Bot automático para responder mensajes de cumpleaños en WhatsApp usando OpenAI.

## 🚀 Características

- ✅ **Detección inteligente** de mensajes de cumpleaños
- ✅ **Respuestas personalizadas** usando OpenAI GPT-3.5
- ✅ **Delays aleatorios** para simular comportamiento humano
- ✅ **Extracción de nombres** de contactos
- ✅ **Respuestas de respaldo** si OpenAI falla

## 📋 Requisitos

- Node.js 16+
- Cuenta de OpenAI (API key)
- WhatsApp Web

## 🔧 Instalación

1. **Clona el repositorio:**
```bash
git clone <tu-repo>
cd whatsapp-birthday-bot
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura OpenAI:**
   - Ve a [OpenAI Platform](https://platform.openai.com/)
   - Crea una cuenta y obtén tu API key
   - Crea un archivo `.env` con:
```env
OPENAI_API_KEY=tu_api_key_aqui
BOT_NAME=TuNombre
DELAY_MIN_SECONDS=30
DELAY_MAX_SECONDS=300
```

## 🎯 Uso

1. **Inicia el bot:**
```bash
npm start
```

2. **Escanea el QR code** con tu WhatsApp móvil

3. **¡Listo!** El bot responderá automáticamente a mensajes de cumpleaños

## 🔍 Detección de Mensajes

El bot detecta mensajes que contengan:
- "feliz cumpleaños"
- "felicidades"
- "feliz" (en contexto de cumpleaños)
- Emojis de cumpleaños: 🎂🎉🎊🎈🎁🥳🎆🎇

## ⚙️ Configuración

### Variables de entorno:
- `OPENAI_API_KEY`: Tu API key de OpenAI
- `BOT_NAME`: Tu nombre (para personalización)
- `DELAY_MIN_SECONDS`: Delay mínimo (default: 30)
- `DELAY_MAX_SECONDS`: Delay máximo (default: 300)

### Delays inteligentes:
- **Mensajes cortos** (<10 chars): 15-45 segundos
- **Mensajes medios** (10-30 chars): 30-75 segundos  
- **Mensajes largos** (>30 chars): 75-105 segundos

## 🧠 Respuestas con OpenAI

El bot genera respuestas personalizadas usando:
- Nombre del remitente
- Contenido del mensaje original
- Tono (formal/informal)
- Emojis (si el mensaje original los tiene)

## 🔄 Respuestas de respaldo

Si OpenAI falla, usa respuestas predefinidas:
- "¡Gracias [nombre]! 😊"
- "¡Muchas gracias por acordarte! 🎉"
- "¡Gracias por las felicitaciones! 🎂"

## 📁 Estructura del proyecto

```
src/
├── index.js              # Punto de entrada
├── whatsapp-client.js    # Cliente de WhatsApp
├── message-analyzer.js   # Análisis de mensajes
├── response-generator.js # Generación con OpenAI
└── delay-manager.js      # Gestión de delays

config.js                 # Configuración
.env                      # Variables de entorno
```

## 🛠️ Desarrollo

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Ver logs detallados
DEBUG=whatsapp-web.js node src/index.js
```

## 💡 Ejemplos de uso

### Mensaje recibido:
```
De: Juan Pérez
Contenido: ¡Feliz cumpleaños! 🎉
```

### Respuesta generada:
```
¡Gracias Juan! 🎉 Me alegra mucho que te hayas acordado
```

## ⚠️ Notas importantes

- **No uses en grupos** (solo chats privados)
- **Configura delays apropiados** para tu contexto
- **Monitorea el uso de OpenAI** para controlar costos
- **Prueba primero** con mensajes de prueba

## 🆘 Solución de problemas

### Error de conexión:
- Verifica tu conexión a internet
- Asegúrate de que WhatsApp Web funcione

### Error de OpenAI:
- Verifica tu API key
- Revisa tu saldo en OpenAI
- El bot usará respuestas de respaldo

### Bot no responde:
- Verifica que esté conectado
- Revisa los logs en la consola
- Reinicia el bot si es necesario

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs en la consola
2. La configuración en `config.js`
3. Tu API key de OpenAI

---

**¡Disfruta tu cumpleaños sin preocuparte por responder mensajes!** 🎂✨ 