// Scientific Functions Module

class ScientificFunctions {
    constructor() {
        this.functions = {
            'sin': Math.sin,
            'cos': Math.cos,
            'tan': Math.tan,
            'asin': Math.asin,
            'acos': Math.acos,
            'atan': Math.atan,
            'log': Math.log10,
            'ln': Math.log,
            'sqrt': Math.sqrt,
            'abs': Math.abs,
            'exp': Math.exp,
            'π': Math.PI,
            'e': Math.E,
            'factorial': this.factorial,
            'rand': Math.random
        };
    }

    factorial(n) {
        if (n < 0) throw new Error('Factorial of negative number');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    applyFunction(funcName, value) {
        if (this.functions[funcName]) {
            const result = this.functions[funcName](value);
            if (typeof result === 'number' && !isNaN(result)) {
                return result;
            }
            throw new Error('Invalid result');
        }
        throw new Error(`Unknown function: ${funcName}`);
    }

    applyPower(base, exponent) {
        return Math.pow(base, exponent);
    }

    applySquare(value) {
        return Math.pow(value, 2);
    }

    applyCube(value) {
        return Math.pow(value, 3);
    }

    applyNthRoot(value, n) {
        if (value < 0 && n % 2 === 0) {
            throw new Error('Cannot take even root of negative number');
        }
        return Math.pow(value, 1 / n);
    }

    applyReciprocal(value) {
        if (value === 0) throw new Error('Division by zero');
        return 1 / value;
    }

    // Convert degrees to radians for trig functions
    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    // Enhanced trig functions with degree/radian support
    sinWithMode(value, useDegrees = false) {
        const radianValue = useDegrees ? this.degreesToRadians(value) : value;
        return Math.sin(radianValue);
    }

    cosWithMode(value, useDegrees = false) {
        const radianValue = useDegrees ? this.degreesToRadians(value) : value;
        return Math.cos(radianValue);
    }

    tanWithMode(value, useDegrees = false) {
        const radianValue = useDegrees ? this.degreesToRadians(value) : value;
        return Math.tan(radianValue);
    }

    // Inverse trig functions with degree/radian support
    asinWithMode(value, useDegrees = false) {
        const result = Math.asin(value);
        return useDegrees ? this.radiansToDegrees(result) : result;
    }

    acosWithMode(value, useDegrees = false) {
        const result = Math.acos(value);
        return useDegrees ? this.radiansToDegrees(result) : result;
    }

    atanWithMode(value, useDegrees = false) {
        const result = Math.atan(value);
        return useDegrees ? this.radiansToDegrees(result) : result;
    }
}

// Export for use in calculator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScientificFunctions;
}
