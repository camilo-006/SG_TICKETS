/**
 * La Vista maneja todo lo relacionado con el DOM (interfaz de usuario).
 * No contiene lógica de negocio, solo muestra datos y dispara eventos.
 */
class TicketView {
    constructor() {
        // Elementos del DOM
        this.form = document.getElementById('ticket-form');
        this.titleInput = document.getElementById('title');
        this.descriptionInput = document.getElementById('description');
        this.departmentInput = document.getElementById('department');
        
        this.ticketListContainer = document.getElementById('ticket-list');
    }

    /**
     * Enlaza el evento de envío del formulario al controlador.
     * @param {Function} handler - Función del controlador que manejará la creación
     */
    bindAddTicket(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault(); // Evita recargar la página

            const title = this.titleInput.value.trim();
            const description = this.descriptionInput.value.trim();
            const department = this.departmentInput.value.trim();

            if (title && description && department) {
                // Enviamos los datos al controlador
                handler({ title, description, department });
                // Limpiamos el formulario
                this.form.reset();
            }
        });
    }

    /**
     * Enlaza eventos de clic dentro de la lista de tickets (resolver y eliminar).
     * Utilizamos delegación de eventos.
     * @param {Function} handlerResolve - Función del controlador para resolver ticket
     * @param {Function} handlerDelete - Función del controlador para eliminar ticket
     */
    bindTicketActions(handlerResolve, handlerDelete) {
        this.ticketListContainer.addEventListener('click', event => {
            const ticketItem = event.target.closest('.ticket-item');
            if (!ticketItem) return;

            const id = ticketItem.dataset.id;

            if (event.target.classList.contains('btn-resolve')) {
                handlerResolve(id);
            } else if (event.target.classList.contains('btn-delete')) {
                handlerDelete(id);
            }
        });
    }

    /**
     * Renderiza la lista completa de tickets en el DOM.
     * @param {Array} tickets - Lista de objetos ticket a mostrar
     */
    displayTickets(tickets) {
        // Limpiamos el contenedor
        this.ticketListContainer.innerHTML = '';

        if (tickets.length === 0) {
            this.ticketListContainer.innerHTML = '<p>No hay tickets registrados en el sistema.</p>';
            return;
        }

        // Creamos la estructura HTML para cada ticket
        tickets.forEach(ticket => {
            const ticketElement = document.createElement('div');
            ticketElement.classList.add('ticket-item');
            if (ticket.status === 'resuelto') {
                ticketElement.classList.add('resolved');
            }
            ticketElement.dataset.id = ticket.id; // Guardamos el ID en el elemento DOM

            const date = new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            // Botones condicionales según el estado
            const resolveBtnHTML = ticket.status === 'pendiente' 
                ? '<button class="btn-resolve">Resolver</button>' 
                : '';

            ticketElement.innerHTML = `
                <div class="ticket-header">
                    <span class="ticket-title">${ticket.title}</span>
                    <span class="ticket-status ${ticket.status}">${ticket.status.toUpperCase()}</span>
                </div>
                <div class="ticket-body">
                    <p>${ticket.description}</p>
                </div>
                <div class="ticket-footer">
                    <span class="ticket-dept"><strong>Depto:</strong> ${ticket.department}</span>
                    <span class="ticket-date">${date}</span>
                    <div class="ticket-actions">
                        ${resolveBtnHTML}
                        <button class="btn-delete">Eliminar</button>
                    </div>
                </div>
            `;

            this.ticketListContainer.appendChild(ticketElement);
        });
    }
}
