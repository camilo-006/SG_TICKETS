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
        this.navAdmin = document.getElementById('nav-admin-panel');
        
        this.viewCreate = document.getElementById('create-ticket-view');
        this.viewTickets = document.getElementById('my-tickets-view');
        this.viewAdmin = document.getElementById('admin-view');

        // Formulario de admin
        this.adminForm = document.getElementById('admin-form');
        this.empName = document.getElementById('emp-name');
        this.empLastName = document.getElementById('emp-lastname');
        this.empEmail = document.getElementById('emp-email');
        this.empPassword = document.getElementById('emp-password');
        this.empRole = document.getElementById('emp-role');
        this.empDept = document.getElementById('emp-dept');

        // Toggle para la lista de empleados
        this.toggleEmployeesBtn = document.getElementById('toggle-employees-btn');
        this.employeesContainer = document.getElementById('employees-container');

        if (this.toggleEmployeesBtn && this.employeesContainer) {
            this.toggleEmployeesBtn.addEventListener('click', () => {
                this.employeesContainer.classList.toggle('hidden');
                if (this.employeesContainer.classList.contains('hidden')) {
                    this.toggleEmployeesBtn.textContent = '[ MOSTRAR EMPLEADOS ]';
                } else {
                    this.toggleEmployeesBtn.textContent = '[ OCULTAR EMPLEADOS ]';
                }
            });
        }

        // Función de ayuda para ocultar todo
        const hideAllViews = () => {
            this.viewCreate.classList.add('hidden');
            this.viewTickets.classList.add('hidden');
            this.viewAdmin.classList.add('hidden');
            this.navCreate.style.backgroundColor = 'transparent';
            this.navCreate.style.color = 'var(--text-dim)';
            this.navTickets.style.backgroundColor = 'transparent';
            this.navTickets.style.color = 'var(--text-dim)';
            this.navAdmin.style.backgroundColor = 'transparent';
            this.navAdmin.style.color = 'var(--text-dim)';
        };

        // Lógica visual de pestañas
        this.navCreate.addEventListener('click', () => {
            hideAllViews();
            this.viewCreate.classList.remove('hidden');
            this.navCreate.style.backgroundColor = 'var(--accent)';
            this.navCreate.style.color = 'var(--bg-primary)';
        });

        this.navTickets.addEventListener('click', () => {
            hideAllViews();
            this.viewTickets.classList.remove('hidden');
            this.navTickets.style.backgroundColor = 'var(--accent)';
            this.navTickets.style.color = 'var(--bg-primary)';
        });

        this.navAdmin.addEventListener('click', () => {
            hideAllViews();
            this.viewAdmin.classList.remove('hidden');
            this.navAdmin.style.backgroundColor = 'var(--accent)';
            this.navAdmin.style.color = 'var(--bg-primary)';
        });
    }

    /**
     * Actualiza la interfaz dependiendo del usuario que acaba de iniciar sesión.
     */
    setUser(user) {
        this.currentUser = user;
        
        // Determinar qué nivel de acceso tiene el usuario
        // asumiendo que el nombre del rol pueda ser 'administrador', 'admin', 'empleado', etc.
        const rol = (this.currentUser.role || '').toLowerCase();
        
        if (rol === 'administrador' || rol === 'admin' || rol === 'empleado') {
            this.navTickets.textContent = '[ PANEL DE AGENTE ]';
            document.querySelector('#my-tickets-view h2').textContent = 'Panel de Agente - Tickets Asignados';
        } else {
            // Es Cliente, reiniciamos los textos
            this.navTickets.textContent = '[ MIS TICKETS ]';
            document.querySelector('#my-tickets-view h2').textContent = 'Mis Tickets';
        }

        // Si es administrador, mostrar la pestaña
        if (rol === 'administrador' || rol === 'admin') {
            this.navAdmin.classList.remove('hidden');
        } else {
            this.navAdmin.classList.add('hidden');
        }
    }

    /**
     * Llena los desplegables del panel de administración
     */
    populateAdminSelects(roles, departamentos) {
        this.empRole.innerHTML = '<option value="">Seleccione un rol...</option>';
        roles.forEach(r => {
            this.empRole.innerHTML += `<option value="${r.id}">${r.nombre}</option>`;
        });

        this.empDept.innerHTML = '<option value="">Seleccione un departamento...</option>';
        departamentos.forEach(d => {
            this.empDept.innerHTML += `<option value="${d.id}">${d.nombre_departamento}</option>`;
        });
    }

    /**
     * Maneja el formulario de administración
     */
    bindAddEmployee(handler) {
        if (!this.adminForm) return;
        this.adminForm.addEventListener('submit', event => {
            event.preventDefault();
            
            // Wait until emp-username exists or grab from DOM if it was just added
            const empUsernameEl = document.getElementById('emp-username');
            const data = {
                name: this.empName.value.trim(),
                lastName: this.empLastName.value.trim(),
                email: this.empEmail.value.trim(),
                password: this.empPassword.value.trim(),
                rol_id: this.empRole.value,
                departamento_id: this.empDept.value
            };
            if (data.name && data.email && data.password && data.rol_id && data.departamento_id) {
                handler(data);
                this.adminForm.reset();
                alert("Empleado creado con éxito");
            }
        });
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

    bindTicketActions(handleChangeStatus, handlerDelete) {
        this.ticketListContainer.addEventListener('click', event => {
            const ticketItem = event.target.closest('.ticket-item');
            if (!ticketItem) return;

            const id = ticketItem.dataset.id;

            if (event.target.classList.contains('btn-delete')) {
                handlerDelete(id);
            }
        });

        this.ticketListContainer.addEventListener('change', event => {
            if (event.target.classList.contains('status-select')) {
                const ticketItem = event.target.closest('.ticket-item');
                if (!ticketItem) return;
                
                const id = ticketItem.dataset.id;
                const newStatusId = event.target.value;
                handleChangeStatus(id, newStatusId);
            }
        });
    }

    displayTickets(tickets, estados = []) {
        this.ticketListContainer.innerHTML = '';

        if (tickets.length === 0) {
            this.ticketListContainer.innerHTML = '<p>No hay tickets registrados en el sistema.</p>';
            return;
        }

        tickets.forEach(ticket => {
            const ticketElement = document.createElement('div');
            ticketElement.classList.add('ticket-item');
            
            // Just for visual flair, we can use ticket.status text to set some classes
            if (ticket.status && ticket.status.toLowerCase() === 'resuelto') {
                ticketElement.classList.add('resolved');
            }
            
            ticketElement.dataset.id = ticket.id;

            let resolveSelectHTML = '';
            let deleteBtnHTML = '';

            if (this.currentUser.role === 'empleado' || this.currentUser.role === 'admin') {
                let optionsHTML = estados.map(est => {
                    const selected = est.id == ticket.status_id ? 'selected' : '';
                    return `<option value="${est.id}" ${selected}>${est.nombre_estado}</option>`;
                }).join('');
                
                resolveSelectHTML = `
                    <select class="status-select" style="padding: 0.2rem; font-size: 0.9rem;">
                        ${optionsHTML}
                    </select>
                `;
                deleteBtnHTML = '<button class="btn-delete">Eliminar</button>';
            }

            ticketElement.innerHTML = `
                <div class="ticket-header">
                    <span class="ticket-title">${ticket.title}</span>
                    <span class="ticket-status">${(ticket.status || '').toUpperCase()}</span>
                </div>
                <div class="ticket-body">
                    <p>${ticket.description}</p>
                </div>
                <div class="ticket-footer">
                    <span class="ticket-dept"><strong>Autor:</strong> ${ticket.author}</span>
                    <div class="ticket-actions">
                        ${resolveSelectHTML}
                        ${deleteBtnHTML}
                    </div>
                </div>
            `;

            this.ticketListContainer.appendChild(ticketElement);
        });
    }

    displayEmployees(empleados) {
        const tbody = document.querySelector('#employees-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (empleados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay empleados registrados</td></tr>';
            return;
        }

        empleados.forEach(emp => {
            const tr = document.createElement('tr');
            const estadoTexto = emp.nombre_estado_id === 1 ? 'Activo' : 'Inactivo';
            const estadoColor = emp.nombre_estado_id === 1 ? 'var(--green)' : 'var(--danger)';
            const nombreCompleto = `${emp.nombre} ${emp.apellido}`;
            
            tr.innerHTML = `
                <td>${nombreCompleto}</td>
                <td>${emp.username}</td>
                <td>${emp.correo}</td>
                <td>${emp.nombre_rol || 'N/A'}</td>
                <td>${emp.nombre_departamento || 'N/A'}</td>
                <td style="color: ${estadoColor}; font-weight: bold;">${estadoTexto}</td>
                <td>
                    <button class="btn-icon btn-edit-emp" data-id="${emp.id}" title="Editar">&#9998;</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    bindEmployeeActions(empleados, roles, departamentos) {
        const tbody = document.querySelector('#employees-table tbody');
        const modal = document.getElementById('edit-employee-modal');
        const closeModal = document.getElementById('close-edit-modal');
        const form = document.getElementById('edit-employee-form');
        
        if (!tbody || !modal) return;

        // Populate selects in modal
        const roleSelect = document.getElementById('edit-emp-role');
        const deptSelect = document.getElementById('edit-emp-dept');
        
        roleSelect.innerHTML = roles.map(r => `<option value="${r.id}">${r.nombre}</option>`).join('');
        deptSelect.innerHTML = departamentos.map(d => `<option value="${d.id}">${d.nombre_departamento}</option>`).join('');

        tbody.addEventListener('click', e => {
            const btn = e.target.closest('.btn-edit-emp');
            if (!btn) return;
            const empId = parseInt(btn.dataset.id);
            const emp = empleados.find(em => em.id === empId);
            if (!emp) return;

            document.getElementById('edit-emp-id').value = emp.id;
            document.getElementById('edit-emp-name').value = emp.nombre;
            document.getElementById('edit-emp-lastname').value = emp.apellido;
            document.getElementById('edit-emp-email').value = emp.correo;
            document.getElementById('edit-emp-password').value = '';
            document.getElementById('edit-emp-role').value = emp.rol_id || '';
            document.getElementById('edit-emp-dept').value = emp.departamento_id || '';
            document.getElementById('edit-emp-status').value = emp.nombre_estado_id || 1;

            modal.classList.remove('hidden');
        });

        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close when clicking outside
        window.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    bindUpdateEmployee(handler) {
        const form = document.getElementById('edit-employee-form');
        const modal = document.getElementById('edit-employee-modal');
        if (!form) return;

        form.addEventListener('submit', e => {
            e.preventDefault();
            const id = document.getElementById('edit-emp-id').value;
            const data = {
                name: document.getElementById('edit-emp-name').value.trim(),
                lastName: document.getElementById('edit-emp-lastname').value.trim(),
                email: document.getElementById('edit-emp-email').value.trim(),
                password: document.getElementById('edit-emp-password').value.trim(),
                rol_id: document.getElementById('edit-emp-role').value,
                departamento_id: document.getElementById('edit-emp-dept').value,
                estado: parseInt(document.getElementById('edit-emp-status').value)
            };
            handler(id, data).then(() => {
                modal.classList.add('hidden');
                form.reset();
            });
        });
    }
}
