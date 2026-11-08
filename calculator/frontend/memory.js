// Memory Functions Module

class MemoryFunctions {
    constructor() {
        this.memory = 0;
        this.hasMemory = false;
        this.indicator = document.getElementById('memory-indicator');
    }

    // Memory Clear (MC)
    clear() {
        this.memory = 0;
        this.hasMemory = false;
        this.updateIndicator();
    }

    // Memory Recall (MR)
    recall() {
        return this.memory;
    }

    // Memory Add (M+)
    add(value) {
        this.memory += value;
        this.hasMemory = true;
        this.updateIndicator();
    }

    // Memory Subtract (M-)
    subtract(value) {
        this.memory -= value;
        this.hasMemory = true;
        this.updateIndicator();
    }

    // Memory Store (MS)
    store(value) {
        this.memory = value;
        this.hasMemory = true;
        this.updateIndicator();
    }

    // Memory Exchange (MX) - swap memory with current value
    exchange(currentValue) {
        const temp = this.memory;
        this.memory = currentValue;
        this.hasMemory = true;
        this.updateIndicator();
        return temp;
    }

    // Memory operations with current value
    operations = {
        MC: () => this.clear(),
        MR: () => this.recall(),
        M_PLUS: (value) => this.add(value),
        M_MINUS: (value) => this.subtract(value),
        MS: (value) => this.store(value),
        MX: (value) => this.exchange(value)
    };

    // Execute memory operation
    execute(operation, value = null) {
        switch (operation) {
            case 'MC':
                this.clear();
                return null;
            case 'MR':
                return this.recall();
            case 'M+':
                this.add(value);
                return null;
            case 'M-':
                this.subtract(value);
                return null;
            case 'MS':
                this.store(value);
                return null;
            case 'MX':
                return this.exchange(value);
            default:
                throw new Error('Unknown memory operation');
        }
    }

    // Get memory value with formatting
    getMemoryFormatted() {
        if (!this.hasMemory) return '0';
        return this.formatNumber(this.memory);
    }

    // Check if memory has value
    hasValue() {
        return this.hasMemory;
    }

    // Update UI indicator
    updateIndicator() {
        if (this.indicator) {
            if (this.hasMemory) {
                this.indicator.classList.add('active');
                this.indicator.textContent = 'M';
            } else {
                this.indicator.classList.remove('active');
            }
        }
    }

    // Format number for display
    formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        
        // Handle very large or very small numbers
        if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-15 && num !== 0)) {
            return num.toExponential(6);
        }
        
        // Remove trailing zeros
        return parseFloat(num.toFixed(10)).toString();
    }

    // Save memory to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('calculator_memory', JSON.stringify({
                value: this.memory,
                hasMemory: this.hasMemory,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Failed to save memory to localStorage:', error);
        }
    }

    // Load memory from localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('calculator_memory');
            if (saved) {
                const data = JSON.parse(saved);
                this.memory = data.value || 0;
                this.hasMemory = data.hasMemory || false;
                this.updateIndicator();
            }
        } catch (error) {
            console.error('Failed to load memory from localStorage:', error);
        }
    }

    // Clear memory from storage
    clearStorage() {
        try {
            localStorage.removeItem('calculator_memory');
        } catch (error) {
            console.error('Failed to clear memory from localStorage:', error);
        }
    }

    // Initialize memory (load from storage if available)
    initialize() {
        this.loadFromStorage();
    }

    // Get memory operations list for UI
    getOperationsList() {
        return [
            { key: 'MC', label: 'MC', description: 'Memory Clear' },
            { key: 'MR', label: 'MR', description: 'Memory Recall' },
            { key: 'M+', label: 'M+', description: 'Memory Add' },
            { key: 'M-', label: 'M-', description: 'Memory Subtract' },
            { key: 'MS', label: 'MS', description: 'Memory Store' },
            { key: 'MX', label: 'MX', description: 'Memory Exchange' }
        ];
    }

    // Validate memory operations
    validateOperation(operation) {
        const validOps = ['MC', 'MR', 'M+', 'M-', 'MS', 'MX'];
        return validOps.includes(operation);
    }

    // Get memory statistics
    getStatistics() {
        return {
            hasMemory: this.hasMemory,
            value: this.memory,
            formatted: this.getMemoryFormatted(),
            isZero: this.memory === 0,
            isNegative: this.memory < 0,
            isPositive: this.memory > 0
        };
    }
}

// Export for use in calculator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryFunctions;
}
