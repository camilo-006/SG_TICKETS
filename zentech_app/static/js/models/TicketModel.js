class TicketModel {
    constructor() {
        this.tickets = [];
    }

    async getTickets(currentUser) {
        try {
            const url = new URL('/api/tickets', window.location.origin);
            url.searchParams.append('email', currentUser.email);
            url.searchParams.append('role', currentUser.role);

            const response = await fetch(url);
            if (response.ok) {
                this.tickets = await response.json();
                return this.tickets;
            }
            return [];
        } catch (error) {
            console.error('Error fetching tickets:', error);
            return [];
        }
    }

    async createTicket(ticketData, userEmail) {
        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: ticketData.title,
                    description: ticketData.description,
                    author: userEmail,
                    // If backend supports department, add it here. Currently it maps to table.
                })
            });

            if (response.ok) {
                const newTicket = await response.json();
                this.tickets.push(newTicket);
                return newTicket;
            } else {
                throw new Error('Error al crear ticket');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async updateTicketStatus(id, newStatusId) {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_id: newStatusId })
            });

            if (response.ok) {
                const data = await response.json();
                const index = this.tickets.findIndex(t => t.id == id);
                if (index !== -1) {
                    this.tickets[index].status_id = newStatusId;
                    this.tickets[index].status = data.status; // Get new string name from API
                    return this.tickets[index];
                }
            } else {
                throw new Error('Error al actualizar ticket');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async deleteTicket(id) {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.tickets = this.tickets.filter(t => t.id != id);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    async getEstados() {
        try {
            const response = await fetch('/api/estados');
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Error fetching estados:', error);
            return [];
        }
    }

    async getRoles() {
        try {
            const response = await fetch('/api/roles');
            return response.ok ? await response.json() : [];
        } catch (e) { return []; }
    }

    async getDepartamentos() {
        try {
            const response = await fetch('/api/departamentos');
            return response.ok ? await response.json() : [];
        } catch (e) { return []; }
    }

    async createEmpleado(data) {
        try {
            const response = await fetch('/api/empleados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear empleado');
            }
            return await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    async getEmpleadosList() {
        try {
            const response = await fetch('/api/empleados');
            return response.ok ? await response.json() : [];
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async updateEmpleado(id, data) {
        try {
            const response = await fetch(`/api/empleados/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar empleado');
            }
            return await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
