# WhatsApp Feliz cumple Bot

Bot automático para responder mensajes de cumpleaños en WhatsApp usando OpenAI.

## Características

- Detección de mensajes de cumpleaños
- Respuestas personalizadas usando OpenAI GPT-3.5
- Delays aleatorios para simular comportamiento humano
- Respuestas lo mas natural que se pueda

## Requisitos

- Node.js 16+
- Cuenta de OpenAI (API key)
- WhatsApp Web
- Conexión a internet estable

## Instalación

1. **Clona el repositorio:**
```bash
git clone <tu-repo>
cd feliz-cumple-bot
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` basado en `.env.example`
   - Agrega tu API key de OpenAI

```env
OPENAI_API_KEY=tu_api_key_aqui
BOT_NAME=TuNombre
DELAY_MIN_SECONDS=30
DELAY_MAX_SECONDS=300
```

## Uso

1. **Inicia el bot:**
```bash
npm start
```

2. **Escanea el QR code** con tu WhatsApp móvil
   - Abre WhatsApp en tu teléfono
   - Ve a Menú > WhatsApp Web
   - Escanea el código QR que aparece en la terminal

3. **¡Listo!** El bot responderá automáticamente a mensajes de cumpleaños

4. **Para detener el bot:** Presiona Ctrl+C en la terminal

## Detección de Mensajes

El bot detecta mensajes que contengan:
- "feliz cumpleaños"
- "felicidades"
- "feliz" (en contexto de cumpleaños)
- Emojis de cumpleaños: 🎂🎉🎊��🎁🥳🎆🎇

## Configuración

### Variables de entorno:
- `OPENAI_API_KEY`: Tu API key de OpenAI
- `BOT_NAME`: Tu nombre (para personalización)
- `DELAY_MIN_SECONDS`: Delay mínimo (default: 30)
- `DELAY_MAX_SECONDS`: Delay máximo (default: 300)

### Delays:
- Todos los mensajes usan un delay aleatorio entre `DELAY_MIN_SECONDS` y `DELAY_MAX_SECONDS`

## Cambiar de usuario

Para usar con otro WhatsApp:

1. Detén el bot (Ctrl+C)
2. Elimina la carpeta de sesión:
```bash
rm -rf .wwebjs_auth
```
3. Reinicia el bot y escanea el nuevo QR

---

**¡Disfruta tu cumpleaños sin preocuparte por responder mensajes!**
