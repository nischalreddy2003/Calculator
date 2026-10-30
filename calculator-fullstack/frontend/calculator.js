// Core Calculator Logic with API Integration
class Calculator {
    constructor() {
        this.inputDisplay = document.getElementById('input-display');
        this.resultDisplay = document.getElementById('result-display');
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetScreen = false;
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    backspace() {
        if (this.currentInput === '0' || this.currentInput.length === 1) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        console.log('=== appendNumber called ===');
        console.log('Number:', number);
        console.log('Before:', { currentInput: this.currentInput, shouldResetScreen: this.shouldResetScreen });
        
        if (this.currentInput === '0' || this.shouldResetScreen) {
            this.currentInput = number;
            this.shouldResetScreen = false;
        } else {
            this.currentInput += number;
        }
        this.updateDisplay();
        
        console.log('After:', { currentInput: this.currentInput, shouldResetScreen: this.shouldResetScreen });
    }

    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentInput = '0.';
            this.shouldResetScreen = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    setOperator(operator) {
        console.log('=== setOperator called ===');
        console.log('Operator:', operator);
        console.log('Before:', { currentInput: this.currentInput, previousInput: this.previousInput, operator: this.operator, shouldResetScreen: this.shouldResetScreen });
        
        if (this.operator !== null) {
            this.calculate();
        }
        this.previousInput = this.currentInput;
        this.operator = operator;
        this.shouldResetScreen = true;
        this.updateDisplay();
        
        console.log('After:', { currentInput: this.currentInput, previousInput: this.previousInput, operator: this.operator, shouldResetScreen: this.shouldResetScreen });
    }

    async calculate() {
        if (this.operator === null) return;

        const expression = `${this.previousInput} ${this.operator} ${this.currentInput}`;
        console.log('Calculating expression:', expression);
        
        try {
            const result = await calculateBasic(expression);
            console.log('API response:', result);
            this.currentInput = result.result.toString();
            this.operator = null;
            this.previousInput = '';
            this.shouldResetScreen = true;
            this.updateDisplay();
            loadHistory(); // Reload history from backend
        } catch (error) {
            console.error('Calculation error:', error);
            this.currentInput = 'Error';
            this.updateDisplay();
            alert(error.message);
        }
    }

    updateDisplay() {
        this.inputDisplay.textContent = this.currentInput;
        if (this.operator !== null) {
            this.resultDisplay.textContent = `${this.previousInput} ${this.operator}`;
        } else {
            this.resultDisplay.textContent = '';
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Event listeners for basic calculator
document.querySelectorAll('.btn-number').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        calculator.appendNumber(value);
    });
});

document.querySelectorAll('.btn-operator').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        calculator.setOperator(value);
    });
});

document.querySelectorAll('.btn-clear').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'clear') {
            calculator.clear();
        } else if (action === 'backspace') {
            calculator.backspace();
        }
    });
});

document.querySelectorAll('.btn-equals').forEach(button => {
    button.addEventListener('click', () => {
        calculator.calculate();
    });
});

// Handle decimal point
document.querySelector('.btn-number[data-value="."]').addEventListener('click', () => {
    calculator.appendDecimal();
});

// Mode switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show corresponding calculator mode
        document.querySelectorAll('.calculator-mode').forEach(calc => calc.classList.remove('active'));
        document.getElementById(`${mode}-mode`).classList.add('active');
        
        // Reset display
        calculator.clear();
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
    } else if (e.key === '.') {
        calculator.appendDecimal();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.setOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.calculate();
    } else if (e.key === 'Backspace') {
        calculator.backspace();
    } else if (e.key === 'Escape') {
        calculator.clear();
    }
});
