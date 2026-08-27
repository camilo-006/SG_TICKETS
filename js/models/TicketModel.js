class TicketModel {
    constructor() {
        this.tickets = [];
    }

    /**
     * Obtiene los tickets de un usuario específico.
     * @param {Object} currentUser - Objeto del usuario actual (con rol y departamento)
     * @returns {Promise<Array>} Lista de tickets
     */
    async getTickets(currentUser) {
        // Simulando latencia de red hacia la base de datos
        return new Promise((resolve) => {
            setTimeout(() => {
                if (currentUser.role === 'empleado') {
                    // Administrador supremo ve todos
                    if (currentUser.department === 'all') {
                        resolve([...this.tickets]);
                    } else {
                        // El empleado solo ve los tickets asignados a su departamento
                        resolve(this.tickets.filter(t => t.department === currentUser.department));
                    }
                } else {
                    // El cliente solo ve los tickets que él mismo creó
                    resolve(this.tickets.filter(t => t.author === currentUser.email));
                }
            }, 100);
        });
    }

    /**
     * Crea un nuevo ticket en la base de datos.
     * @param {Object} ticketData - Datos del ticket a crear
     * @param {string} userEmail - Autor del ticket
     * @returns {Promise<Object>} El ticket recién creado
     */
    async createTicket(ticketData, userEmail) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newTicket = {
                    id: Date.now().toString(), // Generación de ID temporal
                    author: userEmail,
                    title: ticketData.title,
                    description: ticketData.description,
                    department: ticketData.department,
                    status: 'pendiente', // Por defecto todos inician como pendientes
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
