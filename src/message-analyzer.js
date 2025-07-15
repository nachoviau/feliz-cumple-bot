class MessageAnalyzer {
    constructor() {
        // Patrones principales para detectar mensajes de cumpleaños
        this.birthdayPatterns = [
            // Palabras clave principales (alta confianza)
            /\b(feliz\s+cumpleaños?|feliz\s+cumple)\b/i,
            /\b(felicidades\s+(?:en\s+)?(?:tu\s+)?día)\b/i,
            /\b(que\s+tengas\s+un\s+feliz\s+cumpleaños?)\b/i,
            /\b(que\s+la\s+pases\s+super\s+en\s+tu\s+día)\b/i,
            /\b(que\s+la\s+pases\s+bien\s+en\s+tu\s+día)\b/i,
            /\b(que\s+disfrutes\s+tu\s+día)\b/i,
            
            // Solo "feliz" (alta probabilidad en contexto de cumpleaños)
            /\b(feliz)\b/i,
            /\b(cumple)\b/i,
            /\b(cumplee)\b/i,
            /\b(felizz)\b/i,

            // Emojis de cumpleaños
            /🎂|🎉|🎊|🎈|🎁|🥳|🎆|🎇/,
            
            // Combinaciones de texto + emoji
            /\b(feliz\s+cumpleaños?)\s*[🎂🎉🎊🎈🎁🥳🎆🎇]/i,
            /\b(felicidades)\s*[🎂🎉🎊🎈🎁🥳🎆🎇]/i
        ];
    }

    /**
     * Analiza si un mensaje es de cumpleaños
     * @param {string} message - El contenido del mensaje
     * @param {string} sender - Quien envía el mensaje
     * @returns {Object} - Resultado del análisis
     */
    analyzeMessage(message, sender) {
        // Ignorar mensajes vacíos o muy cortos
        if (!message || message.trim().length < 2) {
            return {
                isBirthdayMessage: false,
                reason: 'Mensaje muy corto o vacío'
            };
        }

        // Ignorar mensajes de broadcast/status
        if (sender.includes('@broadcast') || sender.includes('status')) {
            return {
                isBirthdayMessage: false,
                reason: 'Mensaje de broadcast/status'
            };
        }

        const messageLower = message.toLowerCase().trim();

        // Verificar patrones de cumpleaños
        for (const pattern of this.birthdayPatterns) {
            if (pattern.test(messageLower)) {
                const confidence = this.calculateConfidence(messageLower, pattern);
                
                return {
                    isBirthdayMessage: true,
                    confidence: confidence,
                    matchedPattern: pattern.toString(),
                    reason: 'Patrón de cumpleaños detectado'
                };
            }
        }

        return {
            isBirthdayMessage: false,
            reason: 'No es un mensaje de cumpleaños'
        };
    }

    /**
     * Calcula la confianza de que sea un mensaje de cumpleaños
     * @param {string} message - Mensaje en minúsculas
     * @param {RegExp} pattern - Patrón que coincidió
     * @returns {number} - Confianza entre 0 y 1
     */
    calculateConfidence(message, pattern) {
        let confidence = 0.6; // Base más alta porque si es tu cumpleaños, es muy probable

        // Alta confianza para patrones específicos
        if (/\b(feliz\s+cumpleaños?|feliz\s+cumple)\b/i.test(message)) {
            confidence = 0.95;
        }
        
        // Alta confianza para "felicidades"
        else if (/\b(felicidades)\b/i.test(message)) {
            confidence = 0.9;
        }
        
        // Media confianza para solo "feliz"
        else if (/\b(feliz)\b/i.test(message)) {
            confidence = 0.8;
        }

        // Bonus por emojis de cumpleaños
        if (/[🎂🎉🎊🎈🎁🥳🎆🎇]/.test(message)) {
            confidence += 0.1;
        }

        // Bonus por mensaje personalizado
        if (message.length > 15) {
            confidence += 0.05;
        }

        return Math.min(confidence, 1.0);
    }

    /**
     * Extrae información útil del mensaje
     * @param {string} message - El mensaje
     * @param {string} sender - El remitente
     * @param {Object} contact - Información del contacto
     * @returns {Object} - Información extraída
     */
    extractMessageInfo(message, sender, contact = null) {
        return {
            sender: sender,
            contact: contact || { name: 'Desconocido', number: sender },
            message: message,
            messageLength: message.length,
            hasEmojis: /[🎂🎉🎊🎈🎁🥳🎆🎇]/.test(message),
            isFormal: this.isFormalMessage(message),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Determina si el mensaje es formal o informal
     * @param {string} message - El mensaje
     * @returns {boolean} - true si es formal
     */
    isFormalMessage(message) {
        const formalIndicators = [
            /\busted\b/i,
            /\bseñor\b/i,
            /\bseñora\b/i,
            /\bpor\s+favor\b/i,
            /\bgracias\b/i
        ];

        return formalIndicators.some(pattern => pattern.test(message));
    }
}

module.exports = MessageAnalyzer; 