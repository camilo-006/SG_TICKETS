class AuthModel {
    constructor() {
        this.users = [];
    }

    async loadUsers() {
        // Now handled by backend, we don't need to load all users into memory
    }

    async login(username, password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const user = await response.json();
                return user;
            } else {
                const error = await response.json();
                throw new Error(error.error || "Login fallido");
            }
        } catch (error) {
            throw error;
        }
    }

    async registerUser(userData) {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const newUser = await response.json();
                return newUser;
            } else {
                const error = await response.json();
                throw new Error(error.error || "Error al registrar el usuario");
            }
        } catch (error) {
            throw error;
        }
    }
}
