/**
 * Archivo principal de inicialización de la aplicación.
 * Instancia los sistemas MVC.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Instanciamos el MVC de Tickets (una sola vez)
    const appModel = new TicketModel();
    const appView = new TicketView();
    const appController = new TicketController(appModel, appView);

    // 2. Instanciamos el sistema de Autenticación
    const authModel = new AuthModel();
    const authView = new AuthView();
    
    const authController = new AuthController(authModel, authView, (loggedInUser) => {
        // Callback que se ejecuta SOLO cuando el Login es exitoso.
        console.log(`Bienvenido, ${loggedInUser.name} ${loggedInUser.lastName}`);
        
        // Le pasamos el usuario al controlador de tickets, lo que actualizará la UI
        appController.setUser(loggedInUser);
    });
});
