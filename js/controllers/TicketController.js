class TicketController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.currentUser = null;

        // Enlace (binding) de los eventos de la vista con los métodos del controlador (solo 1 vez)
        this.view.bindAddTicket(this.handleAddTicket.bind(this));
        this.view.bindTicketActions(
            this.handleResolveTicket.bind(this),
            this.handleDeleteTicket.bind(this)
        );
    }

    /**
     * Asigna el usuario logueado y refresca la UI
     */
    setUser(user) {
        this.currentUser = user;
        this.view.setUser(user);
        
        // Regresar a la pestaña por defecto
        this.view.navCreate.click();
        
        // Actualizar la lista
        this.refreshTicketList();
    }

    /**
     * Obtiene los tickets del modelo y actualiza la vista.
     */
    async refreshTicketList() {
        try {
            const tickets = await this.model.getTickets(this.currentUser);
            this.view.displayTickets(tickets);
        } catch (error) {
            console.error("Error al cargar los tickets:", error);

        }
    }

    /**
     * Maneja la creación de un nuevo ticket desde la vista.
     * @param {Object} ticketData 
     */
    async handleAddTicket(ticketData) {
        try {
            await this.model.createTicket(ticketData, this.currentUser.email);
            // Actualizamos la vista tras agregar el ticket
            await this.refreshTicketList();
            
            // Opcional: Cambiar automáticamente a la pestaña "Mis Tickets" tras crearlo
            this.view.showTicketsTab();
        } catch (error) {
            console.error("Error al crear el ticket:", error);
        }
    }

    /**
     * Maneja la acción de marcar un ticket como resuelto.
     * @param {string} id 
     */
    async handleResolveTicket(id) {
        try {
            await this.model.updateTicketStatus(id, 'resuelto');
            await this.refreshTicketList();
        } catch (error) {
            console.error("Error al actualizar el ticket:", error);
        }
    }

    /**
     * Maneja la acción de eliminar un ticket.
     * @param {string} id 
     */
    async handleDeleteTicket(id) {
        try {
            await this.model.deleteTicket(id);
            await this.refreshTicketList();
        } catch (error) {
            console.error("Error al eliminar el ticket:", error);
        }
    }
}
