// API Client for Calculator Backend
// Handles all communication with the FastAPI backend

class CalculatorAPI {
    constructor() {
        this.baseURL = 'http://localhost:8001';
        this.token = localStorage.getItem('calculator_token');
        this.user = JSON.parse(localStorage.getItem('calculator_user') || 'null');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('calculator_token', token);
    }

    // Set user data
    setUser(user) {
        this.user = user;
        localStorage.setItem('calculator_user', JSON.stringify(user));
    }

    // Clear authentication
    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('calculator_token');
        localStorage.removeItem('calculator_user');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Make authenticated request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication endpoints
    async register(username, email, password) {
        try {
            const response = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });

            this.setToken(response.access_token);
            this.setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async login(username, password) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            this.setToken(response.access_token);
            this.setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUserInfo() {
        try {
            const response = await this.request('/auth/me');
            this.setUser(response);
            return response;
        } catch (error) {
            this.clearAuth();
            throw error;
        }
    }

    async logout() {
        this.clearAuth();
        return { message: 'Logged out successfully' };
    }

    // User data endpoints
    async getUserData() {
        return await this.request('/user/data');
    }

    async saveUserData(data) {
        return await this.request('/user/data', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Calculations endpoints
    async addCalculation(calculation) {
        return await this.request('/user/calculations', {
            method: 'POST',
            body: JSON.stringify(calculation)
        });
    }

    async getCalculations() {
        return await this.request('/user/calculations');
    }

    // Variables endpoints
    async saveVariables(variables) {
        return await this.request('/user/variables', {
            method: 'POST',
            body: JSON.stringify(variables)
        });
    }

    async getVariables() {
        return await this.request('/user/variables');
    }

    // Memory endpoints
    async saveMemory(memoryValue) {
        return await this.request('/user/memory', {
            method: 'POST',
            body: JSON.stringify(memoryValue)
        });
    }

    async getMemory() {
        return await this.request('/user/memory');
    }

    // Favorites endpoints
    async addFavorite(favorite) {
        return await this.request('/user/favorites', {
            method: 'POST',
            body: JSON.stringify(favorite)
        });
    }

    async getFavorites() {
        return await this.request('/user/favorites');
    }

    async removeFavorite(favorite) {
        return await this.request(`/user/favorites/${encodeURIComponent(favorite)}`, {
            method: 'DELETE'
        });
    }

    // Delete user data
    async deleteUserData() {
        return await this.request('/user/data', {
            method: 'DELETE'
        });
    }

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'unhealthy' };
        }
    }
}

// Export for use in calculator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculatorAPI;
}
