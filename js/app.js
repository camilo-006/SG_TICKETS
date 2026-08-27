/**
 * Archivo principal de inicialización de la aplicación.
 * Instancia el Modelo, la Vista y el Controlador.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instanciamos el Modelo
    const appModel = new TicketModel();
    
    // 2. Instanciamos la Vista
    const appView = new TicketView();
    
    // 3. Instanciamos el Controlador, inyectando Modelo y Vista
    const appController = new TicketController(appModel, appView);

    console.log("Sistema de Gestión de Tickets (MVC) inicializado correctamente.");
});
