const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const MessageAnalyzer = require('./message-analyzer');
const ResponseGenerator = require('./response-generator');
const DelayManager = require('./delay-manager');
const config = require('../config');

class WhatsAppClient {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: config.whatsapp.headless,
                args: config.whatsapp.puppeteerArgs
            }
        });
        
        this.messageAnalyzer = new MessageAnalyzer();
        this.responseGenerator = new ResponseGenerator(config.openai.apiKey);
        this.delayManager = new DelayManager(config.bot.delayMinSeconds, config.bot.delayMaxSeconds);
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Evento cuando se genera el QR code
        this.client.on('qr', (qr) => {
            console.log('QR Code recibido, escanea con WhatsApp:');
            qrcode.generate(qr, { small: true });
            console.log('\n💡 Escanea el QR code con tu WhatsApp móvil');
            console.log('📱 Ve a WhatsApp > Menú > WhatsApp Web');
        });

        // Evento cuando el cliente está listo
        this.client.on('ready', () => {
            console.log('¡Cliente WhatsApp conectado y listo!');
        });

        // Evento cuando llega un mensaje
        this.client.on('message', async (message) => {
            console.log('📨 Mensaje recibido:');
            console.log('  De:', message.from);
            console.log('  Contenido:', message.body);
            console.log('  Timestamp:', message.timestamp);
            
            // Obtener información del contacto
            const contact = await this.getContactInfo(message.from);
            console.log('  Nombre:', contact.name);
            console.log('  Número:', contact.number);
            
            // Analizar si es un mensaje de cumpleaños
            const analysis = this.messageAnalyzer.analyzeMessage(message.body, message.from);
            const messageInfo = this.messageAnalyzer.extractMessageInfo(message.body, message.from, contact);
            
            console.log('🔍 Análisis del mensaje:');
            console.log('  ¿Es de cumpleaños?', analysis.isBirthdayMessage);
            console.log('  Razón:', analysis.reason);
            
            if (analysis.isBirthdayMessage) {
                console.log('🎉 ¡Mensaje de cumpleaños detectado!');
                console.log('  Confianza:', analysis.confidence);
                console.log('  Patrón detectado:', analysis.matchedPattern);
                console.log('  Información extraída:', messageInfo);
                
                // TODO: Aquí vamos a generar y enviar la respuesta
                this.handleBirthdayMessage(message, analysis, messageInfo);
            }
        });

        // Evento de autenticación
        this.client.on('authenticated', () => {
            console.log('Cliente autenticado');
        });

        // Evento de autenticación fallida
        this.client.on('auth_failure', (msg) => {
            console.error('Error de autenticación:', msg);
        });
    }

    async initialize() {
        try {
            console.log('Iniciando cliente WhatsApp...');
            await this.client.initialize();
        } catch (error) {
            console.error('Error al inicializar el cliente:', error);
        }
    }

    async sendMessage(to, message) {
        try {
            await this.client.sendMessage(to, message);
            console.log(`Mensaje enviado a ${to}: ${message}`);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    }

    /**
     * Simula que está escribiendo antes de enviar un mensaje
     * @param {string} to - Destinatario del mensaje
     * @param {string} message - Mensaje a enviar
     * @returns {Promise<void>}
     */
    async sendMessageWithTyping(to, message) {
        try {
            console.log('⌨️ Simulando escritura...');
            
            // Obtener el chat
            const chat = await this.client.getChatById(to);
            if (!chat) {
                console.log('⚠️ No se pudo obtener el chat, enviando sin typing...');
                await this.client.sendMessage(to, message);
                return;
            }
            
            // Activar el chat
            await chat.sendSeen();
            console.log('✅ Chat activado');
            
            // Intentar activar el estado de typing usando la API
            let typingActivated = false;
            
            try {
                // Método 1: Usar sendStateTyping del cliente
                await this.client.sendStateTyping(to);
                console.log('✅ Estado de typing activado con sendStateTyping');
                typingActivated = true;
            } catch (error1) {
                console.log('⚠️ sendStateTyping falló, intentando método alternativo...');
                
                try {
                    // Método 2: Usar sendStateTyping del chat
                    await chat.sendStateTyping();
                    console.log('✅ Estado de typing activado con chat.sendStateTyping');
                    typingActivated = true;
                } catch (error2) {
                    console.log('⚠️ Método alternativo también falló, continuando sin typing...');
                }
            }
            
            // Calcular tiempo de escritura basado en la longitud del mensaje
            const baseTime = 2000; // 2 segundos base
            const charTime = message.length * 150; // 150ms por carácter
            const typingTime = Math.min(baseTime + charTime, 15000); // Máximo 15 segundos
            
            console.log(`⏱️ Simulando escritura por ${typingTime}ms (${message.length} caracteres)`);
            
            // Esperar el tiempo calculado
            await new Promise(resolve => setTimeout(resolve, typingTime));
            
            // Intentar desactivar el estado de typing
            if (typingActivated) {
                try {
                    await this.client.clearState(to);
                    console.log('✅ Estado de typing desactivado');
                } catch (clearError) {
                    console.log('⚠️ No se pudo desactivar el estado de typing');
                }
            }
            
            // Enviar el mensaje usando la API
            console.log('📤 Enviando mensaje...');
            await this.client.sendMessage(to, message);
            console.log(`✅ Mensaje enviado a ${to}: "${message}"`);
            
        } catch (error) {
            console.error('❌ Error al enviar mensaje con typing:', error);
            console.log('🔄 Intentando envío normal...');
            
            // Fallback: enviar sin typing
            try {
                await this.client.sendMessage(to, message);
                console.log(`✅ Mensaje enviado (fallback) a ${to}: "${message}"`);
            } catch (fallbackError) {
                console.error('❌ Error en fallback también:', fallbackError);
            }
        }
    }

    /**
     * Maneja un mensaje de cumpleaños detectado
     * @param {Object} message - Objeto del mensaje de WhatsApp
     * @param {Object} analysis - Resultado del análisis
     * @param {Object} messageInfo - Información extraída del mensaje
     */
    async handleBirthdayMessage(message, analysis, messageInfo) {
        console.log('🤖 Procesando mensaje de cumpleaños...');
        
        // Generar respuesta con OpenAI
        console.log('🧠 Generando respuesta con OpenAI...');
        const response = await this.responseGenerator.generateResponse(messageInfo);
        
        console.log('💬 Respuesta generada:', response);
        console.log('📝 Información del mensaje:');
        console.log('   - Remitente:', messageInfo.contact.name);
        console.log('   - Mensaje original:', messageInfo.message);
        console.log('   - Longitud:', messageInfo.messageLength, 'caracteres');
        console.log('   - Tiene emojis:', messageInfo.hasEmojis ? 'Sí' : 'No');
        console.log('   - Es formal:', messageInfo.isFormal ? 'Sí' : 'No');
        
        // Aplicar delay contextual
        console.log('⏰ Aplicando delay contextual...');
        await this.delayManager.contextualDelay(messageInfo.messageLength);
        
        // Envío automático activado
        console.log('📤 Enviando respuesta automáticamente...');
        
        // Verificar si la respuesta contiene dos mensajes separados
        const messages = this.splitResponse(response);
        
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i].trim();
            if (msg) {
                await this.sendMessageWithTyping(message.from, msg);
                console.log(`✅ Mensaje ${i + 1} enviado: "${msg}"`);
                
                // Pequeño delay entre mensajes si hay más de uno
                if (i < messages.length - 1) {
                    await this.delayManager.quickDelay();
                }
            }
        }
        
        console.log('✅ Proceso completado - Respuesta enviada automáticamente');
        console.log('🎉 ¡Bot funcionando al 100%!');
    }

    /**
     * Obtiene información del contacto
     * @param {string} contactId - ID del contacto
     * @returns {Object} - Información del contacto
     */
    async getContactInfo(contactId) {
        try {
            const contact = await this.client.getContactById(contactId);
            
            return {
                name: contact.pushname || contact.name || 'Sin nombre',
                number: contact.number || contactId,
                isGroup: contact.isGroup || false,
                isMe: contact.isMe || false
            };
        } catch (error) {
            console.error('Error al obtener información del contacto:', error);
            return {
                name: 'Contacto desconocido',
                number: contactId,
                isGroup: false,
                isMe: false
            };
        }
    }

    /**
     * Divide una respuesta en múltiples mensajes
     * @param {string} response - Respuesta completa
     * @returns {Array} - Array de mensajes separados
     */
    splitResponse(response) {
        // Buscar patrones que indiquen dos mensajes separados
        const patterns = [
            /(.+?)\n\n(.+)/,  // Doble salto de línea
            /(.+?)\n(.+)/,     // Salto de línea simple
            /(.+?)\s{2,}(.+)/, // Múltiples espacios
            /(.+?)\|\|(.+)/,   // Separador ||
            /(.+?)\|\s*(.+)/   // Separador | con espacios
        ];
        
        for (const pattern of patterns) {
            const match = response.match(pattern);
            if (match) {
                return [match[1].trim(), match[2].trim()];
            }
        }
        
        // Si no encuentra separadores, devolver como un solo mensaje
        return [response];
    }


}

module.exports = WhatsAppClient; 