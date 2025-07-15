class DelayManager {
    constructor(minSeconds = 30, maxSeconds = 300) {
        this.minSeconds = minSeconds;
        this.maxSeconds = maxSeconds;
    }

    /**
     * Genera un delay aleatorio para simular comportamiento humano
     * @returns {Promise<void>}
     */
    async randomDelay() {
        const delaySeconds = Math.floor(
            Math.random() * (this.maxSeconds - this.minSeconds + 1) + this.minSeconds
        );
        
        console.log(`⏰ Esperando ${delaySeconds} segundos para simular comportamiento humano...`);
        
        return new Promise(resolve => {
            setTimeout(resolve, delaySeconds * 1000);
        });
    }

    /**
     * Genera un delay más corto para respuestas rápidas
     * @returns {Promise<void>}
     */
    async quickDelay() {
        const delaySeconds = Math.floor(
            Math.random() * (this.maxSeconds - this.minSeconds + 1) + this.minSeconds
        );
        
        console.log(`⚡ Delay rápido: ${delaySeconds}s (entre ${this.minSeconds}s y ${this.maxSeconds}s)`);
        
        return new Promise(resolve => {
            setTimeout(resolve, delaySeconds * 1000);
        });
    }

    /**
     * Genera un delay basado en la longitud del mensaje
     * @param {number} messageLength - Longitud del mensaje
     * @returns {Promise<void>}
     */
    async contextualDelay(messageLength) {
        const delaySeconds = Math.floor(
            Math.random() * (this.maxSeconds - this.minSeconds + 1) + this.minSeconds
        );
        
        console.log(`⏰ Delay aleatorio: ${delaySeconds}s (entre ${this.minSeconds}s y ${this.maxSeconds}s)`);
        
        return new Promise(resolve => {
            setTimeout(resolve, delaySeconds * 1000);
        });
    }
}

module.exports = DelayManager; 