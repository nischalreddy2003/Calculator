// Unit Converter Module

class UnitConverter {
    constructor() {
        this.conversionFactors = {
            length: {
                'm': { name: 'Meters', factor: 1 },
                'km': { name: 'Kilometers', factor: 1000 },
                'cm': { name: 'Centimeters', factor: 0.01 },
                'mm': { name: 'Millimeters', factor: 0.001 },
                'mi': { name: 'Miles', factor: 1609.344 },
                'ft': { name: 'Feet', factor: 0.3048 },
                'in': { name: 'Inches', factor: 0.0254 },
                'yd': { name: 'Yards', factor: 0.9144 }
            },
            weight: {
                'kg': { name: 'Kilograms', factor: 1 },
                'g': { name: 'Grams', factor: 0.001 },
                'lb': { name: 'Pounds', factor: 0.453592 },
                'oz': { name: 'Ounces', factor: 0.0283495 },
                'ton': { name: 'Metric Tons', factor: 1000 }
            },
            temperature: {
                'C': { name: 'Celsius', factor: 1, offset: 0 },
                'F': { name: 'Fahrenheit', factor: 5/9, offset: 32 },
                'K': { name: 'Kelvin', factor: 1, offset: 273.15 }
            },
            volume: {
                'L': { name: 'Liters', factor: 1 },
                'mL': { name: 'Milliliters', factor: 0.001 },
                'gal': { name: 'Gallons', factor: 3.78541 },
                'cup': { name: 'Cups', factor: 0.236588 },
                'pt': { name: 'Pints', factor: 0.473176 },
                'qt': { name: 'Quarts', factor: 0.946353 }
            },
            time: {
                's': { name: 'Seconds', factor: 1 },
                'min': { name: 'Minutes', factor: 60 },
                'h': { name: 'Hours', factor: 3600 },
                'day': { name: 'Days', factor: 86400 },
                'week': { name: 'Weeks', factor: 604800 },
                'month': { name: 'Months', factor: 2592000 },
                'year': { name: 'Years', factor: 31536000 }
            },
            data: {
                'B': { name: 'Bytes', factor: 1 },
                'KB': { name: 'Kilobytes', factor: 1024 },
                'MB': { name: 'Megabytes', factor: 1048576 },
                'GB': { name: 'Gigabytes', factor: 1073741824 },
                'TB': { name: 'Terabytes', factor: 1099511627776 },
                'PB': { name: 'Petabytes', factor: 1125899906842624 }
            }
        };
    }

    // Convert between units
    convert(value, fromUnit, toUnit, category) {
        if (!this.conversionFactors[category]) {
            throw new Error('Invalid category');
        }

        const fromData = this.conversionFactors[category][fromUnit];
        const toData = this.conversionFactors[category][toUnit];

        if (!fromData || !toData) {
            throw new Error('Invalid unit');
        }

        let result;

        // Special handling for temperature
        if (category === 'temperature') {
            result = this.convertTemperature(value, fromUnit, toUnit);
        } else {
            // Convert to base unit, then to target unit
            const baseValue = value * fromData.factor;
            result = baseValue / toData.factor;
        }

        return result;
    }

    // Temperature conversion (special case)
    convertTemperature(value, fromUnit, toUnit) {
        // Convert to Celsius first
        let celsius;
        
        switch (fromUnit) {
            case 'C':
                celsius = value;
                break;
            case 'F':
                celsius = (value - 32) * 5/9;
                break;
            case 'K':
                celsius = value - 273.15;
                break;
            default:
                throw new Error('Invalid temperature unit');
        }

        // Convert from Celsius to target
        switch (toUnit) {
            case 'C':
                return celsius;
            case 'F':
                return celsius * 9/5 + 32;
            case 'K':
                return celsius + 273.15;
            default:
                throw new Error('Invalid temperature unit');
        }
    }

    // Get available units for a category
    getUnits(category) {
        if (!this.conversionFactors[category]) {
            return [];
        }
        return Object.keys(this.conversionFactors[category]).map(key => ({
            value: key,
            label: this.conversionFactors[category][key].name
        }));
    }

    // Get categories
    getCategories() {
        return Object.keys(this.conversionFactors).map(key => ({
            value: key,
            label: key.charAt(0).toUpperCase() + key.slice(1)
        }));
    }

    // Format result with appropriate precision
    formatResult(value) {
        if (Math.abs(value) >= 1e15 || (Math.abs(value) < 1e-15 && value !== 0)) {
            return value.toExponential(6);
        }
        
        // Remove trailing zeros
        return parseFloat(value.toFixed(10)).toString();
    }

    // Validate input
    validateInput(value) {
        const num = parseFloat(value);
        return !isNaN(num) && isFinite(num);
    }

    // Get conversion formula description
    getConversionFormula(value, fromUnit, toUnit, category) {
        if (category === 'temperature') {
            return `${value} ${fromUnit} = ? ${toUnit}`;
        }
        
        const fromData = this.conversionFactors[category][fromUnit];
        const toData = this.conversionFactors[category][toUnit];
        
        if (!fromData || !toData) return '';
        
        return `${value} ${fromUnit} × ${fromData.factor} ÷ ${toData.factor} = ? ${toUnit}`;
    }

    // Batch conversion (convert to all units in category)
    convertToAll(value, fromUnit, category) {
        const units = this.getUnits(category);
        const results = {};
        
        units.forEach(unit => {
            try {
                results[unit.value] = this.convert(value, fromUnit, unit.value, category);
            } catch (error) {
                results[unit.value] = 'Error';
            }
        });
        
        return results;
    }

    // Common conversions shortcuts
    getCommonConversions(category) {
        const common = {
            length: ['m', 'km', 'cm', 'mi', 'ft', 'in'],
            weight: ['kg', 'g', 'lb', 'oz'],
            temperature: ['C', 'F', 'K'],
            volume: ['L', 'mL', 'gal', 'cup'],
            time: ['s', 'min', 'h', 'day'],
            data: ['B', 'KB', 'MB', 'GB', 'TB']
        };
        
        return common[category] || [];
    }
}

// Export for use in calculator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnitConverter;
}
