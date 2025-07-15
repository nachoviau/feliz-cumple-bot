const WhatsAppClient = require('./whatsapp-client');

async function main() {
    console.log('🚀 Iniciando WhatsApp Birthday Bot...');
    
    const whatsappClient = new WhatsAppClient();
    
    try {
        await whatsappClient.initialize();
        
        // Mantener el proceso corriendo
        process.on('SIGINT', () => {
            console.log('\n👋 Cerrando bot...');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar el bot:', error);
        process.exit(1);
    }
}

main(); 