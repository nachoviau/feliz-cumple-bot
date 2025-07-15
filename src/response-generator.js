const OpenAI = require('openai');

class ResponseGenerator {
    constructor(apiKey) {
        this.openai = new OpenAI({
            apiKey: apiKey
        });
    }

    /**
     * Genera una respuesta personalizada usando OpenAI
     * @param {Object} messageInfo - Información del mensaje
     * @returns {Promise<string>} - Respuesta generada
     */
    async generateResponse(messageInfo) {
        try {
            const prompt = this.buildPrompt(messageInfo);
            
            console.log('🤖 Enviando prompt a OpenAI...');
            console.log('📝 Prompt completo:');
            console.log('─'.repeat(50));
            console.log(prompt);
            console.log('─'.repeat(50));
            
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Eres un asistente que ayuda a responder mensajes de cumpleaños de manera natural y personalizada. Debes responder como si fueras la persona que recibe el mensaje, no como un bot."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 150,
                temperature: 0.8
            });

            const response = completion.choices[0].message.content.trim();
            
            console.log('🧠 Respuesta de OpenAI recibida:');
            console.log('📄 Respuesta:', response);
            console.log('🔢 Tokens usados:', completion.usage?.total_tokens || 'N/A');
            console.log('⏱️ Tiempo de respuesta:', completion.usage ? 'N/A' : 'N/A');
            
            return response;
        } catch (error) {
            console.error('❌ Error al generar respuesta con OpenAI:', error);
            throw error; // Re-lanzar el error para que se maneje en el cliente
        }
    }

    /**
     * Construye el prompt para OpenAI
     * @param {Object} messageInfo - Información del mensaje
     * @returns {string} - Prompt para OpenAI
     */
    buildPrompt(messageInfo) {
        const { contact, message, hasEmojis, isFormal } = messageInfo;
        
        return `
Contexto: Es mi cumpleaños y recibí un mensaje de felicitaciónes de ${contact.name}.

Información del remitente:
- Nombre completo: ${contact.name}
- Mensaje recibido: "${message}"
- Longitud del mensaje: ${message.length} caracteres

Instrucciones IMPORTANTES:
1. Responde de manera NATURAL y HUMANA, el objetivo es que nadie se de cuenta que eres un bot
2. NO uses emojis en la respuesta
3. no uses tantos signos de exclamacion, si usas, que sea solo al final
4. responde en el mismo estilo de escritura del mensaje original
5. no uses frases prearmadas como "voy a pasarla de diez!" parece poco natural
6. NO uses mi nombre en la respuesta, solo responde agradeciendo
7. NO uses ${contact.name} tal cual en la respuesta, usa un apodo o algo mas lunfardo.
8. centrate en los ejemplos de respuesta que te dejo a continuacion, no uses frases prearmadas
9. Contesta de forma bien argentina. 
10. usa dos "s" en gracias y dos "o" en amigo, o en abrazo, es decir amigoo, o abrazoo, etc. pero no uses todas esas palabras en la respuesta.
11. no usas comas. ni signos de puntuacion. hasta si te podes equivocar escribiendo mejor.
12. Tenes que igualar la intensidad de la respuesta al mensaje original. 
13. nadie dice "nos vemos pronto", solo se dice "nos vemoss". nunca uses "nos vemos pronto" en la respuesta.

te dejo ejemplos de respuesta:
- "graciass, te mando un abrazoo"
- "amigoo, gracias por el mensajito"
- "broder que lindo! gracias por acordarte, te mando un abrazoo"
- "gracias amigoo, te mando un abrazo!"
- "gracias queridoo, te mando un abrazoo"
- "graciass hablamos para hacer algoo"

Respuesta:`;
    }

    /**
     * Extrae un apodo del nombre completo
     * @param {string} fullName - Nombre completo
     * @returns {string} - Apodo
     */
    extractApodo(fullName) {
        if (!fullName || fullName === 'Sin nombre' || fullName === 'Contacto desconocido') {
            return 'amigo';
        }
        
        // Limpiar el nombre de caracteres extraños
        const cleanName = fullName.replace(/[^\w\s]/g, '').trim();
        
        if (!cleanName || cleanName.length < 2) {
            return 'amigo';
        }
        
        // Tomar la primera palabra del nombre
        const firstName = cleanName.split(' ')[0];
        
        // Si el nombre es muy largo o contiene números, usar apodo genérico
        if (firstName.length > 8 || /\d/.test(firstName)) {
            return 'amigo';
        }
        
        // Si el nombre es muy corto, usar apodo genérico
        if (firstName.length < 2) {
            return 'amigo';
        }
        
        return firstName.toLowerCase();
    }
}

module.exports = ResponseGenerator; 