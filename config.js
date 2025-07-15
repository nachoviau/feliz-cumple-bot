require('dotenv').config();

module.exports = {
    // OpenAI Configuration
    openai: {
        apiKey: process.env.OPENAI_API_KEY || 'tu_api_key_aqui'
    },
    
    // Bot Configuration
    bot: {
        name: process.env.BOT_NAME || 'Nacho',
        delayMinSeconds: parseInt(process.env.DELAY_MIN_SECONDS) || 30,
        delayMaxSeconds: parseInt(process.env.DELAY_MAX_SECONDS) || 300
    },
    
    // WhatsApp Configuration
    whatsapp: {
        headless: true,
        puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox']
    }
}; 