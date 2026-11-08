// All-in-One Calculator - Main Controller with Backend Integration
// Integrates Basic, Scientific, Programmer modes, Unit Converter, Memory Functions, and Backend API

class AllInOneCalculator {
    constructor() {
        // Core elements
        this.display = document.getElementById('display');
        this.currentExpression = '';
        this.currentMode = 'basic';
        this.variables = { X: 0, Y: 0, Z: 0 };
        this.history = [];
        this.historyPanel = document.getElementById('history-panel');
        this.historyList = document.getElementById('history-list');

        // API instance
        this.api = new CalculatorAPI();

        // Module instances
        this.scientific = new ScientificFunctions();
        this.programmer = new ProgrammerMode();
        this.converter = new UnitConverter();
        this.memory = new MemoryFunctions();

        // Mode-specific state
        this.scientificExpression = '';
        this.programmerExpression = '';
        this.programmerBase = 10;
        this.converterCategory = 'length';
        this.converterFromUnit = 'm';
        this.converterToUnit = 'km';

        // Authentication state
        this.isAuthenticated = false;
        this.currentUser = null;

        this.initializeEventListeners();
        this.initializeConverter();
        this.initializeAuth();
        this.updateDisplay();
        this.switchMode('basic');
    }

    async initializeAuth() {
        // Check if user is already authenticated
        if (this.api.isAuthenticated()) {
            try {
                const user = await this.api.getCurrentUserInfo();
                this.isAuthenticated = true;
                this.currentUser = user;
                this.updateUserMenu();
                await this.loadUserData();
            } catch (error) {
                console.error('Failed to authenticate:', error);
                this.api.clearAuth();
                this.showAuthModal();
            }
        } else {
            this.showAuthModal();
        }
    }

    showAuthModal() {
        document.getElementById('auth-modal').classList.add('active');
    }

    hideAuthModal() {
        document.getElementById('auth-modal').classList.remove('active');
    }

    updateUserMenu() {
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');

        if (this.isAuthenticated && this.currentUser) {
            userMenu.style.display = 'flex';
            userName.textContent = this.currentUser.username;
        } else {
            userMenu.style.display = 'none';
        }
    }

    async loadUserData() {
        if (!this.isAuthenticated) return;

        try {
            const userData = await this.api.getUserData();
            
            // Load history
            if (userData.calculations) {
                this.history = userData.calculations.map(calc => ({
                    expression: calc.expression,
                    result: calc.result,
                    mode: calc.mode,
                    timestamp: new Date(calc.timestamp)
                }));
                this.updateHistoryDisplay();
            }

            // Load variables
            if (userData.variables) {
                this.variables = userData.variables;
            }

            // Load memory
            if (userData.memory !== undefined) {
                this.memory.memory = userData.memory;
                this.memory.hasMemory = userData.memory !== 0;
                this.memory.updateIndicator();
            }

        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    async saveUserData() {
        if (!this.isAuthenticated) return;

        try {
            const userData = {
                calculations: this.history.map(item => ({
                    expression: item.expression,
                    result: item.expression.split(' = ')[1] || '',
                    mode: item.mode,
                    timestamp: item.timestamp.toISOString()
                })),
                variables: this.variables,
                memory: this.memory.memory,
                favorites: []
            };

            await this.api.saveUserData(userData);
        } catch (error) {
            console.error('Failed to save user data:', error);
        }
    }

    async addCalculationToHistory(expression, result, mode) {
        if (!this.isAuthenticated) return;

        try {
            const calculation = {
                expression: `${expression} = ${result}`,
                result: result.toString(),
                mode: mode,
                timestamp: new Date().toISOString()
            };

            await this.api.addCalculation(calculation);
            this.history.unshift({
                expression: calculation.expression,
                result: result.toString(),
                mode: mode,
                timestamp: new Date()
            });
            
            if (this.history.length > 50) {
                this.history.pop();
            }
            
            this.updateHistoryDisplay();
        } catch (error) {
            console.error('Failed to add calculation to history:', error);
        }
    }

    initializeEventListeners() {
        // Mode tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => this.clear());

        // History toggle and clear
        document.getElementById('history-toggle').addEventListener('click', () => this.toggleHistory());
        document.getElementById('clear-history').addEventListener('click', () => this.clearHistory());
        document.getElementById('save-history').addEventListener('click', () => this.saveUserData());

        // Memory recall button
        document.getElementById('memory-recall').addEventListener('click', () => this.memoryRecall());

        // Equals buttons (different modes)
        document.getElementById('equals-btn').addEventListener('click', () => this.calculate());
        document.getElementById('scientific-equals').addEventListener('click', () => this.calculateScientific());
        document.getElementById('programmer-equals').addEventListener('click', () => this.calculateProgrammer());

        // Converter controls
        document.getElementById('convert-btn').addEventListener('click', () => this.convertUnits());
        document.getElementById('converter-category').addEventListener('change', (e) => this.updateConverterUnits(e.target.value));
        document.getElementById('converter-from').addEventListener('change', (e) => this.converterFromUnit = e.target.value);
        document.getElementById('converter-to').addEventListener('change', (e) => this.converterToUnit = e.target.value);

        // Base selector for programmer mode
        document.getElementById('base-select').addEventListener('change', (e) => this.changeBase(parseInt(e.target.value)));

        // Authentication events
        this.setupAuthEvents();

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // History item click
        this.historyList.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-item')) {
                this.useHistoryItem(e.target.dataset.result);
            }
        });

        // Dynamic button handling for all modes
        this.setupDynamicButtons();
    }

    setupAuthEvents() {
        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchAuthTab(tab.dataset.tab));
        });

        // Login form
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Register form
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });

        // Close auth modal
        document.getElementById('close-auth').addEventListener('click', () => this.hideAuthModal());

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tab}-form`);
        });
        // Clear error messages
        document.getElementById('login-error').textContent = '';
        document.getElementById('register-error').textContent = '';
    }

    async handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            const response = await this.api.login(username, password);
            this.isAuthenticated = true;
            this.currentUser = response.user;
            this.updateUserMenu();
            this.hideAuthModal();
            await this.loadUserData();
            errorDiv.textContent = '';
        } catch (error) {
            errorDiv.textContent = error.message || 'Login failed';
        }
    }

    async handleRegister() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorDiv = document.getElementById('register-error');

        try {
            const response = await this.api.register(username, email, password);
            this.isAuthenticated = true;
            this.currentUser = response.user;
            this.updateUserMenu();
            this.hideAuthModal();
            await this.loadUserData();
            errorDiv.textContent = '';
        } catch (error) {
            errorDiv.textContent = error.message || 'Registration failed';
        }
    }

    async handleLogout() {
        try {
            await this.api.logout();
            this.isAuthenticated = false;
            this.currentUser = null;
            this.updateUserMenu();
            this.showAuthModal();
            this.clear();
            this.history = [];
            this.updateHistoryDisplay();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    setupDynamicButtons() {
        // Basic mode buttons
        document.querySelectorAll('#basic-panel .number-btn').forEach(btn => {
            btn.addEventListener('click', () => this.appendNumber(btn.dataset.num));
        });
        document.querySelectorAll('#basic-panel .operator-btn').forEach(btn => {
            btn.addEventListener('click', () => this.appendOperator(btn.dataset.op));
        });
        document.querySelectorAll('#basic-panel .function-btn').forEach(btn => {
            btn.addEventListener('click', () => this.appendFunction(btn.dataset.func));
        });
        document.querySelectorAll('#basic-panel .variable-btn').forEach(btn => {
            btn.addEventListener('click', () => this.appendVariable(btn.dataset.var));
        });
        document.querySelectorAll('#basic-panel .assign-btn').forEach(btn => {
            btn.addEventListener('click', () => this.assignVariable(btn.dataset.var));
        });

        // Scientific mode buttons
        document.querySelectorAll('#scientific-panel .number-btn').forEach(btn => {
            btn.addEventListener('click', () => this.appendScientificNumber(btn.dataset.num));
        });
        document.querySelectorAll('#scientific-panel .operator-btn').forEach(btn => {
            btn.addEventListener('click', () => this.appendScientificOperator(btn.dataset.op));
        });
        document.querySelectorAll('#scientific-panel .function-btn').forEach(btn => {
            btn.addEventListener('click', () => this.appendScientificFunction(btn.dataset.func));
        });
        document.querySelectorAll('#scientific-panel .sci-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleScientificButton(btn.dataset.func));
        });

        // Programmer mode buttons
        document.querySelectorAll('#programmer-panel .number-btn').forEach(btn => {
            btn.addEventListener('click', () => this.appendProgrammerNumber(btn.dataset.num));
        });
        document.querySelectorAll('#programmer-panel .operator-btn').forEach(btn => {
            btn.addEventListener('click', () => this.appendProgrammerOperator(btn.dataset.op));
        });
        document.querySelectorAll('#programmer-panel .prog-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleProgrammerButton(btn.dataset.func));
        });
    }

    initializeConverter() {
        this.updateConverterUnits('length');
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update mode panels
        document.querySelectorAll('.mode-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${mode}-panel`);
        });

        // Clear display when switching modes
        this.clear();
    }

    // Basic Mode Methods
    appendNumber(num) {
        if (this.currentExpression === '0') {
            this.currentExpression = num;
        } else if (this.currentExpression === '') {
            this.currentExpression = num;
        } else {
            this.currentExpression += num;
        }
        this.updateDisplay();
    }

    appendOperator(op) {
        if (op === 'backspace') {
            this.currentExpression = this.currentExpression.slice(0, -1);
        } else if (op === '√') {
            this.currentExpression += '√(';
        } else if (op === '^') {
            this.currentExpression += '^';
        } else {
            this.currentExpression += op;
        }
        this.updateDisplay();
    }

    appendFunction(func) {
        this.currentExpression += func;
        this.updateDisplay();
    }

    appendVariable(varName) {
        this.currentExpression += varName;
        this.updateDisplay();
    }

    assignVariable(varName) {
        try {
            const result = this.evaluateExpression(this.currentExpression);
            this.variables[varName] = result;
            this.addToHistory(`${this.currentExpression} = ${varName}`, 'basic');
            this.currentExpression = '';
            this.updateDisplay();
            this.saveUserData();
        } catch (error) {
            this.showError('Invalid expression for variable assignment');
        }
    }

    calculate() {
        try {
            const result = this.evaluateExpression(this.currentExpression);
            const historyEntry = `${this.currentExpression} = ${result}`;
            this.addToHistory(historyEntry, 'basic');
            this.currentExpression = result.toString();
            this.updateDisplay();
            this.addCalculationToHistory(this.currentExpression, result, 'basic');
        } catch (error) {
            this.showError(error.message);
        }
    }

    evaluateExpression(expression) {
        // Replace variables with their values
        let processedExpr = expression;
        Object.keys(this.variables).forEach(varName => {
            const regex = new RegExp(`\\b${varName}\\b`, 'g');
            processedExpr = processedExpr.replace(regex, this.variables[varName]);
        });

        // Convert display symbols to math symbols
        processedExpr = processedExpr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/√/g, 'sqrt');

        // Validate expression
        if (!this.isValidExpression(processedExpr)) {
            throw new Error('Invalid expression');
        }

        // Parse and evaluate using recursive descent parser
        const parser = new ExpressionParser(processedExpr);
        return parser.parse();
    }

    isValidExpression(expr) {
        let parenCount = 0;
        for (let char of expr) {
            if (char === '(') parenCount++;
            if (char === ')') parenCount--;
            if (parenCount < 0) return false;
        }
        return parenCount === 0;
    }

    // Scientific Mode Methods
    appendScientificNumber(num) {
        if (this.scientificExpression === '0') {
            this.scientificExpression = num;
        } else if (this.scientificExpression === '') {
            this.scientificExpression = num;
        } else {
            this.scientificExpression += num;
        }
        this.updateDisplay();
    }

    appendScientificOperator(op) {
        if (op === 'backspace') {
            this.scientificExpression = this.scientificExpression.slice(0, -1);
        } else {
            this.scientificExpression += op;
        }
        this.updateDisplay();
    }

    appendScientificFunction(func) {
        this.scientificExpression += func;
        this.updateDisplay();
    }

    handleScientificButton(func) {
        switch (func) {
            case 'sin':
            case 'cos':
            case 'tan':
            case 'asin':
            case 'acos':
            case 'atan':
            case 'log':
            case 'ln':
            case 'sqrt':
            case 'abs':
                this.scientificExpression += `${func}(`;
                break;
            case 'π':
                this.scientificExpression += 'π';
                break;
            case 'e':
                this.scientificExpression += 'e';
                break;
            case '^2':
                this.scientificExpression += '^2';
                break;
            case '^3':
                this.scientificExpression += '^3';
                break;
            case '^':
                this.scientificExpression += '^';
                break;
            case 'yroot':
                this.scientificExpression += 'root(';
                break;
            case 'factorial':
                this.scientificExpression += '!';
                break;
            case 'exp':
                this.scientificExpression += 'exp(';
                break;
            case '1/x':
                this.scientificExpression = `1/(${this.scientificExpression})`;
                break;
            case 'rand':
                this.scientificExpression += Math.random().toString();
                break;
        }
        this.updateDisplay();
    }

    calculateScientific() {
        try {
            const result = this.evaluateScientificExpression(this.scientificExpression);
            const historyEntry = `${this.scientificExpression} = ${result}`;
            this.addToHistory(historyEntry, 'scientific');
            this.scientificExpression = result.toString();
            this.updateDisplay();
            this.addCalculationToHistory(this.scientificExpression, result, 'scientific');
        } catch (error) {
            this.showError(error.message);
        }
    }

    evaluateScientificExpression(expression) {
        let processedExpr = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/asin\(/g, 'Math.asin(')
            .replace(/acos\(/g, 'Math.acos(')
            .replace(/atan\(/g, 'Math.atan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/abs\(/g, 'Math.abs(')
            .replace(/exp\(/g, 'Math.exp(')
            .replace(/!/g, '')
            .replace(/root\(/g, 'Math.pow(');

        // Handle factorial separately
        if (expression.includes('!')) {
            processedExpr = this.handleFactorial(processedExpr);
        }

        // Handle nth root
        if (expression.includes('root(')) {
            processedExpr = this.handleNthRoot(processedExpr);
        }

        try {
            const result = new Function('Math', `return ${processedExpr}`)(Math);
            if (typeof result !== 'number' || isNaN(result)) {
                throw new Error('Invalid result');
            }
            return result;
        } catch (error) {
            throw new Error('Invalid scientific expression');
        }
    }

    handleFactorial(expr) {
        return expr.replace(/(\d+)!/g, (match, num) => {
            return `(${this.factorial(parseInt(num))})`;
        });
    }

    handleNthRoot(expr) {
        return expr.replace(/root\(([^,]+),\s*([^\)]+)\)/g, 'Math.pow($1, 1/$2)');
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

    // Programmer Mode Methods
    appendProgrammerNumber(num) {
        if (this.programmerExpression === '0') {
            this.programmerExpression = num;
        } else if (this.programmerExpression === '') {
            this.programmerExpression = num;
        } else {
            this.programmerExpression += num;
        }
        this.updateDisplay();
    }

    appendProgrammerOperator(op) {
        if (op === 'backspace') {
            this.programmerExpression = this.programmerExpression.slice(0, -1);
        } else {
            this.programmerExpression += op;
        }
        this.updateDisplay();
    }

    handleProgrammerButton(func) {
        switch (func) {
            case 'AND':
            case 'OR':
            case 'XOR':
            case 'NOT':
            case 'SHL':
            case 'SHR':
                this.programmerExpression += ` ${func} `;
                break;
            case '(':
            case ')':
                this.programmerExpression += func;
                break;
            case 'clear':
                this.programmerExpression = '';
                break;
        }
        this.updateDisplay();
    }

    calculateProgrammer() {
        try {
            const result = this.evaluateProgrammerExpression(this.programmerExpression);
            const historyEntry = `${this.programmerExpression} = ${result}`;
            this.addToHistory(historyEntry, 'programmer');
            this.programmerExpression = result.toString();
            this.updateDisplay();
            this.addCalculationToHistory(this.programmerExpression, result, 'programmer');
        } catch (error) {
            this.showError(error.message);
        }
    }

    evaluateProgrammerExpression(expression) {
        let processedExpr = expression;
        
        // Handle bitwise operations
        processedExpr = processedExpr
            .replace(/\bAND\b/g, '&')
            .replace(/\bOR\b/g, '|')
            .replace(/\bXOR\b/g, '^')
            .replace(/\bNOT\b/g, '~')
            .replace(/\bSHL\b/g, '<<')
            .replace(/\bSHR\b/g, '>>');

        try {
            const tokens = processedExpr.match(/\d+|[A-F]|[+\-*/&|^~()<>]/g);
            if (!tokens) throw new Error('Invalid expression');

            let result = this.simpleProgrammerEval(tokens);
            return result;
        } catch (error) {
            throw new Error('Invalid programmer expression');
        }
    }

    simpleProgrammerEval(tokens) {
        let result = parseInt(tokens[0], this.programmerBase);
        let i = 1;

        while (i < tokens.length) {
            const op = tokens[i];
            const nextNum = parseInt(tokens[i + 1], this.programmerBase);

            switch (op) {
                case '+': result += nextNum; break;
                case '-': result -= nextNum; break;
                case '*': result *= nextNum; break;
                case '/': 
                    if (nextNum === 0) throw new Error('Division by zero');
                    result = Math.floor(result / nextNum); 
                    break;
                case '&': result &= nextNum; break;
                case '|': result |= nextNum; break;
                case '^': result ^= nextNum; break;
                case '<<': result <<= nextNum; break;
                case '>>': result >>= nextNum; break;
                default: throw new Error('Unsupported operation');
            }
            i += 2;
        }

        return result;
    }

    changeBase(newBase) {
        this.programmerBase = newBase;
        if (this.programmerExpression) {
            try {
                const decimalValue = parseInt(this.programmerExpression, this.programmerBase);
                this.programmerExpression = this.programmer.convertToBase(decimalValue, this.programmerBase, newBase);
                this.updateDisplay();
            } catch (error) {
                this.programmerExpression = '';
                this.updateDisplay();
            }
        }
    }

    // Unit Converter Methods
    updateConverterUnits(category) {
        this.converterCategory = category;
        const units = this.converter.getUnits(category);
        
        const fromSelect = document.getElementById('converter-from');
        const toSelect = document.getElementById('converter-to');
        
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';
        
        units.forEach(unit => {
            const fromOption = document.createElement('option');
            fromOption.value = unit.value;
            fromOption.textContent = unit.label;
            fromSelect.appendChild(fromOption);
            
            const toOption = document.createElement('option');
            toOption.value = unit.value;
            toOption.textContent = unit.label;
            toSelect.appendChild(toOption);
        });
        
        this.converterFromUnit = units[0]?.value || 'm';
        this.converterToUnit = units[1]?.value || 'km';
        fromSelect.value = this.converterFromUnit;
        toSelect.value = this.converterToUnit;
    }

    convertUnits() {
        const value = parseFloat(document.getElementById('converter-value').value);
        const fromUnit = document.getElementById('converter-from').value;
        const toUnit = document.getElementById('converter-to').value;
        const category = document.getElementById('converter-category').value;

        if (isNaN(value)) {
            this.showError('Please enter a valid number');
            return;
        }

        try {
            const result = this.converter.convert(value, fromUnit, toUnit, category);
            const formattedResult = this.converter.formatResult(result);
            document.getElementById('converter-result').value = formattedResult;
            
            const historyEntry = `${value} ${fromUnit} = ${formattedResult} ${toUnit}`;
            this.addToHistory(historyEntry, 'converter');
            this.addCalculationToHistory(historyEntry, formattedResult, 'converter');
        } catch (error) {
            this.showError(error.message);
        }
    }

    // Memory Functions
    memoryRecall() {
        const memoryValue = this.memory.recall();
        this.currentExpression = memoryValue.toString();
        this.updateDisplay();
    }

    memoryStore(value) {
        this.memory.store(value);
        this.saveUserData();
    }

    memoryAdd(value) {
        this.memory.add(value);
        this.saveUserData();
    }

    memorySubtract(value) {
        this.memory.subtract(value);
        this.saveUserData();
    }

    // History Functions
    addToHistory(entry, mode) {
        this.history.unshift({
            expression: entry,
            mode: mode,
            timestamp: new Date()
        });
        if (this.history.length > 50) {
            this.history.pop();
        }
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.historyList.innerHTML = '';
        this.history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.dataset.result = item.expression.split(' = ')[1];
            
            const modeSpan = document.createElement('span');
            modeSpan.className = 'history-mode';
            modeSpan.textContent = item.mode;
            
            div.appendChild(modeSpan);
            div.appendChild(document.createTextNode(item.expression));
            
            this.historyList.appendChild(div);
        });
    }

    useHistoryItem(result) {
        this.currentExpression = result;
        this.updateDisplay();
    }

    toggleHistory() {
        this.historyPanel.classList.toggle('active');
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        this.saveUserData();
    }

    // Utility Functions
    clear() {
        this.currentExpression = '';
        this.scientificExpression = '';
        this.programmerExpression = '';
        this.updateDisplay();
    }

    updateDisplay() {
        let displayValue = '0';
        
        switch (this.currentMode) {
            case 'basic':
                displayValue = this.currentExpression || '0';
                break;
            case 'scientific':
                displayValue = this.scientificExpression || '0';
                break;
            case 'programmer':
                displayValue = this.programmerExpression || '0';
                break;
            case 'converter':
                return;
        }
        
        this.display.value = displayValue;
    }

    showError(message) {
        this.display.value = 'Error';
        this.display.style.color = '#ff6b6b';
        setTimeout(() => {
            this.display.style.color = '#fff';
            this.clear();
        }, 2000);
    }

    handleKeyboard(e) {
        const key = e.key;

        if (this.currentMode === 'converter') return;

        if (key >= '0' && key <= '9') {
            this.handleNumberInput(key);
        }
        else if (key === '.') {
            this.handleNumberInput('.');
        }
        else if (['+', '-', '*', '/', '^', '%'].includes(key)) {
            this.handleOperatorInput(key);
        }
        else if (key === '(' || key === ')') {
            this.handleFunctionInput(key);
        }
        else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            this.handleEquals();
        }
        else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clear();
        }
        else if (key === 'Backspace') {
            this.handleBackspace();
        }
        else if (key === 'F1') {
            e.preventDefault();
            this.switchMode('basic');
        }
        else if (key === 'F2') {
            e.preventDefault();
            this.switchMode('scientific');
        }
        else if (key === 'F3') {
            e.preventDefault();
            this.switchMode('programmer');
        }
        else if (key === 'F4') {
            e.preventDefault();
            this.switchMode('converter');
        }
    }

    handleNumberInput(num) {
        switch (this.currentMode) {
            case 'basic': this.appendNumber(num); break;
            case 'scientific': this.appendScientificNumber(num); break;
            case 'programmer': this.appendProgrammerNumber(num); break;
        }
    }

    handleOperatorInput(op) {
        switch (this.currentMode) {
            case 'basic': this.appendOperator(op); break;
            case 'scientific': this.appendScientificOperator(op); break;
            case 'programmer': this.appendProgrammerOperator(op); break;
        }
    }

    handleFunctionInput(func) {
        switch (this.currentMode) {
            case 'basic': this.appendFunction(func); break;
            case 'scientific': this.appendScientificFunction(func); break;
            case 'programmer': this.handleProgrammerButton(func); break;
        }
    }

    handleEquals() {
        switch (this.currentMode) {
            case 'basic': this.calculate(); break;
            case 'scientific': this.calculateScientific(); break;
            case 'programmer': this.calculateProgrammer(); break;
        }
    }

    handleBackspace() {
        switch (this.currentMode) {
            case 'basic':
                this.currentExpression = this.currentExpression.slice(0, -1);
                this.updateDisplay();
                break;
            case 'scientific':
                this.scientificExpression = this.scientificExpression.slice(0, -1);
                this.updateDisplay();
                break;
            case 'programmer':
                this.programmerExpression = this.programmerExpression.slice(0, -1);
                this.updateDisplay();
                break;
        }
    }
}

// Expression Parser for Basic Mode (safe evaluation)
class ExpressionParser {
    constructor(expression) {
        this.expression = expression;
        this.position = 0;
    }

    parse() {
        const result = this.parseExpression();
        if (this.position < this.expression.length) {
            throw new Error('Unexpected token');
        }
        return result;
    }

    parseExpression() {
        let left = this.parseTerm();

        while (this.position < this.expression.length) {
            const char = this.expression[this.position];
            if (char === '+' || char === '-') {
                this.position++;
                const right = this.parseTerm();
                left = char === '+' ? left + right : left - right;
            } else {
                break;
            }
        }

        return left;
    }

    parseTerm() {
        let left = this.parseFactor();

        while (this.position < this.expression.length) {
            const char = this.expression[this.position];
            if (char === '*' || char === '/') {
                this.position++;
                const right = this.parseFactor();
                if (char === '*') {
                    left = left * right;
                } else {
                    if (right === 0) throw new Error('Division by zero');
                    left = left / right;
                }
            } else {
                break;
            }
        }

        return left;
    }

    parseFactor() {
        let base = this.parseUnary();

        if (this.position < this.expression.length && this.expression[this.position] === '^') {
            this.position++;
            const exponent = this.parseFactor();
            base = Math.pow(base, exponent);
        }

        return base;
    }

    parseUnary() {
        if (this.position < this.expression.length) {
            const char = this.expression[this.position];
            if (char === '-') {
                this.position++;
                return -this.parseUnary();
            } else if (char === '+') {
                this.position++;
                return this.parseUnary();
            }
        }
        return this.parsePrimary();
    }

    parsePrimary() {
        if (this.position >= this.expression.length) {
            throw new Error('Unexpected end of expression');
        }

        const char = this.expression[this.position];

        if (char >= '0' && char <= '9' || char === '.') {
            return this.parseNumber();
        }

        if (char === '(') {
            this.position++;
            const result = this.parseExpression();
            if (this.position >= this.expression.length || this.expression[this.position] !== ')') {
                throw new Error('Missing closing parenthesis');
            }
            this.position++;
            return result;
        }

        if (this.expression.substr(this.position, 4) === 'sqrt') {
            this.position += 4;
            if (this.position < this.expression.length && this.expression[this.position] === '(') {
                this.position++;
                const result = this.parseExpression();
                if (this.position >= this.expression.length || this.expression[this.position] !== ')') {
                    throw new Error('Missing closing parenthesis');
                }
                this.position++;
                if (result < 0) throw new Error('Cannot take square root of negative number');
                return Math.sqrt(result);
            }
        }

        throw new Error(`Unexpected character: ${char}`);
    }

    parseNumber() {
        let numStr = '';
        while (this.position < this.expression.length) {
            const char = this.expression[this.position];
            if ((char >= '0' && char <= '9') || char === '.') {
                numStr += char;
                this.position++;
            } else {
                break;
            }
        }
        const num = parseFloat(numStr);
        if (isNaN(num)) {
            throw new Error('Invalid number');
        }
        return num;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AllInOneCalculator();
});
