// Programmer Mode Module - Number Base Conversion and Bitwise Operations

class ProgrammerMode {
    constructor() {
        this.currentBase = 10;
        this.currentValue = 0;
    }

    // Number Base Conversion
    convertToBase(value, fromBase, toBase) {
        // Convert from source base to decimal
        const decimalValue = parseInt(value.toString(), fromBase);
        
        // Convert from decimal to target base
        if (toBase === 10) {
            return decimalValue.toString();
        } else if (toBase === 16) {
            return decimalValue.toString(16).toUpperCase();
        } else if (toBase === 2) {
            return decimalValue.toString(2);
        } else if (toBase === 8) {
            return decimalValue.toString(8);
        }
        
        throw new Error('Unsupported base');
    }

    convertFromBase(value, fromBase, toBase = 10) {
        try {
            // Validate input based on base
            const validChars = {
                2: /^[01]+$/,
                8: /^[0-7]+$/,
                10: /^[0-9]+$/,
                16: /^[0-9A-Fa-f]+$/
            };

            if (!validChars[fromBase] || !validChars[fromBase].test(value)) {
                throw new Error(`Invalid characters for base ${fromBase}`);
            }

            const decimalValue = parseInt(value, fromBase);
            if (isNaN(decimalValue)) {
                throw new Error('Invalid number');
            }

            return this.convertToBase(decimalValue, 10, toBase);
        } catch (error) {
            throw new Error(`Conversion error: ${error.message}`);
        }
    }

    // Bitwise Operations
    bitwiseAND(a, b) {
        return a & b;
    }

    bitwiseOR(a, b) {
        return a | b;
    }

    bitwiseXOR(a, b) {
        return a ^ b;
    }

    bitwiseNOT(a) {
        return ~a;
    }

    shiftLeft(a, b) {
        return a << b;
    }

    shiftRight(a, b) {
        return a >> b;
    }

    unsignedShiftRight(a, b) {
        return a >>> b;
    }

    // Integer Operations
    toInteger(value) {
        return Math.floor(value);
    }

    toFixed(value, decimals = 0) {
        return value.toFixed(decimals);
    }

    // Base-specific formatting
    formatInBase(value, base) {
        const decimalValue = parseInt(value, 10);
        
        switch (base) {
            case 2:
                return decimalValue.toString(2);
            case 8:
                return decimalValue.toString(8);
            case 10:
                return decimalValue.toString(10);
            case 16:
                return decimalValue.toString(16).toUpperCase();
            default:
                throw new Error('Unsupported base');
        }
    }

    // Validate number for specific base
    isValidForBase(value, base) {
        const validChars = {
            2: /^[01]+$/,
            8: /^[0-7]+$/,
            10: /^[0-9]+$/,
            16: /^[0-9A-Fa-f]+$/
        };

        return validChars[base] ? validChars[base].test(value) : false;
    }

    // Get all base representations
    getAllRepresentations(value) {
        const decimalValue = parseInt(value, 10);
        return {
            binary: decimalValue.toString(2),
            octal: decimalValue.toString(8),
            decimal: decimalValue.toString(10),
            hex: decimalValue.toString(16).toUpperCase()
        };
    }

    // Bit manipulation utilities
    getBit(value, position) {
        return (value >> position) & 1;
    }

    setBit(value, position) {
        return value | (1 << position);
    }

    clearBit(value, position) {
        return value & ~(1 << position);
    }

    toggleBit(value, position) {
        return value ^ (1 << position);
    }

    // Count bits
    countSetBits(value) {
        let count = 0;
        let n = value;
        while (n) {
            count += n & 1;
            n >>= 1;
        }
        return count;
    }

    // Find highest set bit
    highestSetBit(value) {
        if (value === 0) return -1;
        let position = 0;
        let n = value;
        while (n > 1) {
            n >>= 1;
            position++;
        }
        return position;
    }

    // Check if number is power of 2
    isPowerOfTwo(value) {
        return value > 0 && (value & (value - 1)) === 0;
    }

    // Swap bytes
    swapBytes(value) {
        return ((value & 0xFF) << 8) | ((value >> 8) & 0xFF);
    }

    // Rotate bits
    rotateLeft(value, positions, bitWidth = 32) {
        return ((value << positions) | (value >>> (bitWidth - positions))) & ((1 << bitWidth) - 1);
    }

    rotateRight(value, positions, bitWidth = 32) {
        return ((value >>> positions) | (value << (bitWidth - positions))) & ((1 << bitWidth) - 1);
    }
}

// Export for use in calculator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgrammerMode;
}
