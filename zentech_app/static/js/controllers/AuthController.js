class AuthController {
    constructor(model, view, onLoginSuccess) {
        this.model = model;
        this.view = view;
        this.onLoginSuccess = onLoginSuccess; // Callback para iniciar la App principal

        // Enlazar eventos de la vista
        this.view.bindLogin(this.handleLogin.bind(this));
        this.view.bindRegister(this.handleRegister.bind(this));
        this.view.bindLogout(this.handleLogout.bind(this));

        // Escuchar cambios en la URL (Botón "Atrás" del navegador)
        window.addEventListener('hashchange', this.handleHashChange.bind(this));

        // Iniciar flujo de Auth
        this.init();
    }

    async init() {
        // Cargar los usuarios desde el JSON
        await this.model.loadUsers();

        // Manejar la URL inicial
        this.handleHashChange();
    }

    handleHashChange() {
        const hash = window.location.hash;

        // Protección: Si intentan navegar a #app sin estar logueados (ej. recargar la página), devolver al inicio
        if ((hash === '#app' || hash === '#tickets') && !this.isLoggedIn) {
            window.location.hash = '#welcome';
            return;
        }

        if (hash === '#login') {
            this.view.showLogin();
        } else if (hash === '#register') {
            this.view.showRegister();
        } else if (hash === '#app' || hash === '#tickets') {
            // Ya estamos logueados y la app está visible, no hacer nada para no romper.
            this.view.showApp();
        } else {
            // Default: Landing / Welcome
            this.view.showLanding();
        }
    }

    handleLogout() {
        this.isLoggedIn = false;
        console.log("Sesión cerrada.");
        window.location.hash = '#login';
    }

    async handleLogin(username, password) {
        this.view.clearErrors();
        try {
            const user = await this.model.login(username, password);
            if (user) {
                // Éxito, iniciamos la app
                this.isLoggedIn = true;
                this.view.showApp();
                this.onLoginSuccess(user);
            }
        } catch (error) {
            this.view.showLoginError(`[ ERROR ] ${error.message}`);
        }
    }

    async handleRegister(userData) {
        this.view.clearErrors();
        try {
            await this.model.registerUser(userData);
            // Registro exitoso, volvemos al login
            alert("Registro exitoso. Ahora puede iniciar sesión.");
            this.view.showLogin();
            // Limpiar formulario de registro
            document.getElementById('register-form').reset();
        } catch (error) {
            this.view.showRegisterError(`[ ERROR ] ${error.message}`);
        }
    }
}
