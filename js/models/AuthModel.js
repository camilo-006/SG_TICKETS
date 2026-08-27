class AuthModel {
    constructor() {
        this.users = [];
    }

    /**
     * Carga los usuarios iniciales y los combina con los guardados en LocalStorage.
     */
    async loadUsers() {
        // Usuarios por defecto (simulan la Base de Datos inicial)
        const defaultUsers = [
            {
                name: "Admin",
                lastName: "Principal",
                email: "admin@zentech.com",
                password: "admin",
                role: "empleado",
                department: "all"
            },
            {
                name: "Técnico",
                lastName: "Redes",
                email: "infra@zentech.com",
                password: "123",
                role: "empleado",
                department: "Infraestructura"
            },
            {
                name: "Usuario",
                lastName: "Demo",
                email: "cliente@empresa.com",
                password: "123",
                role: "cliente"
            }
        ];

        // Cargar usuarios de LocalStorage (nuevos registros hechos por el usuario)
        const storedUsers = JSON.parse(localStorage.getItem('zentech_users')) || [];
        
        // Combinar (Damos prioridad a LocalStorage para evitar duplicados si el usuario cambió su clave, etc)
        const emailsGuardados = storedUsers.map(u => u.email);
        const usuariosFiltrados = defaultUsers.filter(u => !emailsGuardados.includes(u.email));
        
        this.users = [...usuariosFiltrados, ...storedUsers];
    }

    /**
     * Valida credenciales contra la lista en memoria
     * @param {string} email 
     * @param {string} password 
     * @returns {Object|null} Usuario o null
     */
    async login(email, password) {
        // Simulamos retraso de red
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = this.users.find(u => u.email === email && u.password === password);
                resolve(user || null);
            }, 500);
        });
    }

    /**
     * Registra un nuevo usuario en la "BD" (LocalStorage para simular persistencia)
     * @param {Object} userData 
     */
    async registerUser(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Verificar si ya existe el correo
                const exists = this.users.find(u => u.email === userData.email);
                if (exists) {
                    reject(new Error("El correo ya está registrado en el sistema."));
                    return;
                }

                // Asignar rol por defecto
                const newUser = { ...userData, role: 'cliente' };

                // Guardarlo en memoria
                this.users.push(newUser);

                // Como es Frontend, para mantenerlo cuando se recargue la página, lo guardamos en LocalStorage
                const storedUsers = JSON.parse(localStorage.getItem('zentech_users')) || [];
                storedUsers.push(newUser);
                localStorage.setItem('zentech_users', JSON.stringify(storedUsers));

                resolve(newUser);
            }, 500);
        });
    }
}
