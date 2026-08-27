class TicketModel {
    constructor() {
        this.tickets = [];
    }

    /**
     * Obtiene todos los tickets.
     * @returns {Promise<Array>} Lista de tickets
     */
    async getTickets() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.tickets]);
            }, 100);
        });
    }

    /**
     * Crea un nuevo ticket en la base de datos.
     * @param {Object} ticketData - Datos del ticket a crear
     * @returns {Promise<Object>} El ticket recién creado
     */
    async createTicket(ticketData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newTicket = {
                    id: Date.now().toString(),
                    title: ticketData.title,
                    description: ticketData.description,
                    department: ticketData.department,
                    status: 'pendiente',
                    createdAt: new Date().toISOString()
                };

                this.tickets.push(newTicket);
                resolve(newTicket);
            }, 100);
        });
    }

    /**
     * Actualiza el estado de un ticket (Ej: de 'pendiente' a 'resuelto').
     * @param {string} id - ID del ticket
     * @param {string} newStatus - Nuevo estado
     * @returns {Promise<Object>} Ticket actualizado
     */
    async updateTicketStatus(id, newStatus) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.tickets.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.tickets[index].status = newStatus;
                    resolve(this.tickets[index]);
                } else {
                    reject(new Error('Ticket no encontrado'));
                }
            }, 100);
        });
    }

    /**
     * Elimina un ticket de la base de datos.
     * @param {string} id - ID del ticket a eliminar
     * @returns {Promise<boolean>} Éxito de la operación
     */
    async deleteTicket(id) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.tickets = this.tickets.filter(t => t.id !== id);
                resolve(true);
            }, 100);
        });
    }
}
