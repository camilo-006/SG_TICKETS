/**
 * La Vista maneja todo lo relacionado con el DOM (interfaz de usuario).
 * No contiene lógica de negocio, solo muestra datos y dispara eventos.
 */
class TicketView {
    constructor() {
        this.currentUser = null;

        // Elementos del DOM
        this.form = document.getElementById('ticket-form');
        this.titleInput = document.getElementById('title');
        this.descriptionInput = document.getElementById('description');
        this.departmentInput = document.getElementById('department');
        
        this.ticketListContainer = document.getElementById('ticket-list');

        // Pestañas de navegación
        this.navCreate = document.getElementById('nav-create-ticket');
        this.navTickets = document.getElementById('nav-my-tickets');
        this.viewCreate = document.getElementById('create-ticket-view');
        this.viewTickets = document.getElementById('my-tickets-view');

        // Lógica visual de pestañas
        this.navCreate.addEventListener('click', () => {
            this.viewCreate.classList.remove('hidden');
            this.viewTickets.classList.add('hidden');
            this.navCreate.style.backgroundColor = 'var(--accent)';
            this.navCreate.style.color = 'var(--bg-primary)';
            this.navTickets.style.backgroundColor = 'transparent';
            this.navTickets.style.color = 'var(--text-dim)';
        });

        this.navTickets.addEventListener('click', () => {
            this.viewCreate.classList.add('hidden');
            this.viewTickets.classList.remove('hidden');
            this.navTickets.style.backgroundColor = 'var(--accent)';
            this.navTickets.style.color = 'var(--bg-primary)';
            this.navCreate.style.backgroundColor = 'transparent';
            this.navCreate.style.color = 'var(--text-dim)';
        });
    }

    /**
     * Actualiza la interfaz dependiendo del usuario que acaba de iniciar sesión.
     */
    setUser(user) {
        this.currentUser = user;
        
        if (this.currentUser.role === 'empleado') {
            this.navTickets.textContent = '[ PANEL DE AGENTE ]';
            document.querySelector('#my-tickets-view h2').textContent = 'Panel de Agente - Tickets Asignados';
        } else {
            // Es Cliente, reiniciamos los textos por si antes hubo un empleado logueado
            this.navTickets.textContent = '[ MIS TICKETS ]';
            document.querySelector('#my-tickets-view h2').textContent = 'Mis Tickets';
        }
    }

    /**
     * Permite al controlador forzar la vista de tickets
     */
    showTicketsTab() {
        this.navTickets.click();
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

            // Botones condicionales según el estado y el ROL del usuario
            let resolveBtnHTML = '';
            let deleteBtnHTML = '';

            // Solo los empleados pueden resolver y eliminar
            if (this.currentUser.role === 'empleado') {
                if (ticket.status === 'pendiente') {
                    resolveBtnHTML = '<button class="btn-resolve">Resolver</button>';
                }
                deleteBtnHTML = '<button class="btn-delete">Eliminar</button>';
            }

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
                        ${deleteBtnHTML}
                    </div>
                </div>
            `;

            this.ticketListContainer.appendChild(ticketElement);
        });
    }
}
