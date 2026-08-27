class AuthView {
    constructor() {
        this.landingSection = document.getElementById('landing-section');
        this.authSection = document.getElementById('auth-section');
        this.appSection = document.getElementById('app-section');

        this.loginView = document.getElementById('login-view');
        this.registerView = document.getElementById('register-view');

        // Formularios
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');

        // Links para alternar vistas
        this.btnStart = document.getElementById('btn-start');
        this.goToRegisterBtn = document.getElementById('go-to-register');
        this.goToLoginBtn = document.getElementById('go-to-login');

        // Link para Logout
        this.logoutBtn = document.getElementById('logout-btn');

        // Mensajes de error
        this.loginError = document.getElementById('login-error');
        this.registerError = document.getElementById('register-error');

        // Enlazar botones de navegación
        this.btnStart.addEventListener('click', () => {
            window.location.hash = '#login';
        });

        this.goToRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#register';
        });

        this.goToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#login';
        });
    }

    showLanding() {
        this.authSection.classList.add('hidden');
        this.appSection.classList.add('hidden');
        this.landingSection.classList.remove('hidden');
        this.logoutBtn.classList.add('hidden');
    }

    showLogin() {
        this.landingSection.classList.add('hidden');
        this.registerView.classList.add('hidden');
        this.appSection.classList.add('hidden');
        this.authSection.classList.remove('hidden');
        this.loginView.classList.remove('hidden');
        this.logoutBtn.classList.add('hidden');
        this.clearErrors();
        this.loginForm.reset(); // Limpia los campos
    }

    showRegister() {
        this.landingSection.classList.add('hidden');
        this.loginView.classList.add('hidden');
        this.registerView.classList.remove('hidden');
        this.authSection.classList.remove('hidden');
        this.clearErrors();
        this.registerForm.reset(); // Limpia los campos
    }

    showApp() {
        this.landingSection.classList.add('hidden');
        this.authSection.classList.add('hidden');
        this.appSection.classList.remove('hidden');
        this.logoutBtn.classList.remove('hidden');
        
        // Empujamos #app al historial para que el botón "atrás" pueda funcionar
        if(window.location.hash !== '#app') {
            window.location.hash = '#app';
        }
    }

    bindLogout(handler) {
        this.logoutBtn.addEventListener('click', () => {
            handler();
        });
    }

    showLoginError(msg) {
        this.loginError.textContent = msg;
        this.loginError.classList.remove('hidden');
    }

    showRegisterError(msg) {
        this.registerError.textContent = msg;
        this.registerError.classList.remove('hidden');
    }

    clearErrors() {
        this.loginError.classList.add('hidden');
        this.registerError.classList.add('hidden');
    }

    bindLogin(handler) {
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            handler(email, password);
        });
    }

    bindRegister(handler) {
        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value.trim();
            const lastName = document.getElementById('reg-lastname').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            
            handler({ name, lastName, email, password });
        });
    }
}
