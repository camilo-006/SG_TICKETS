
class TicketController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindAddTicket(this.handleAddTicket.bind(this));
        this.view.bindTicketActions(
            this.handleResolveTicket.bind(this),
            this.handleDeleteTicket.bind(this)
        );

        this.refreshTicketList();
    }


    async refreshTicketList() {
        try {
            const tickets = await this.model.getTickets();
            this.view.displayTickets(tickets);
        } catch (error) {
            console.error("Error al cargar los tickets:", error);

        }
    }

    /**
     * @param {Object} ticketData 
     */
    async handleAddTicket(ticketData) {
        try {
            await this.model.createTicket(ticketData);
            await this.refreshTicketList();
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
