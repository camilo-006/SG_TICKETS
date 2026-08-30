class TicketController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.currentUser = null;
        this.estados = [];

        this.view.bindAddTicket(this.handleAddTicket.bind(this));
        this.view.bindTicketActions(
            this.handleChangeStatus.bind(this),
            this.handleDeleteTicket.bind(this)
        );
        this.view.bindAddEmployee(this.handleAddEmployee.bind(this));
        this.view.bindUpdateEmployee(this.handleUpdateEmployee.bind(this));
    }

    async setUser(user) {
        this.currentUser = user;
        this.view.setUser(user);
        
        // Fetch estados once
        this.estados = await this.model.getEstados();

        const rol = (user.role || '').toLowerCase();
        if (rol === 'administrador' || rol === 'admin') {
            const roles = await this.model.getRoles();
            const deptos = await this.model.getDepartamentos();
            this.view.populateAdminSelects(roles, deptos);
            this.refreshEmployeesList();
            
            // Re-fetch on admin tab click to get latest changes
            this.view.navAdmin.addEventListener('click', () => {
                this.refreshEmployeesList();
            });
        }

        this.view.navCreate.click();
        this.refreshTicketList();
    }

    async refreshEmployeesList() {
        try {
            const empleados = await this.model.getEmpleadosList();
            const roles = await this.model.getRoles();
            const deptos = await this.model.getDepartamentos();
            
            this.view.displayEmployees(empleados);
            this.view.bindEmployeeActions(empleados, roles, deptos);
        } catch (error) {
            console.error("Error al cargar los empleados:", error);
        }
    }

    async refreshTicketList() {
        try {
            const tickets = await this.model.getTickets(this.currentUser);
            this.view.displayTickets(tickets, this.estados);
        } catch (error) {
            console.error("Error al cargar los tickets:", error);
        }
    }

    async handleAddTicket(ticketData) {
        try {
            await this.model.createTicket(ticketData, this.currentUser.email);
            await this.refreshTicketList();
            this.view.showTicketsTab();
        } catch (error) {
            console.error("Error al crear el ticket:", error);
        }
    }

    async handleAddEmployee(employeeData) {
        try {
            await this.model.createEmpleado(employeeData);
            await this.refreshEmployeesList();
        } catch (error) {
            alert(error.message);
        }
    }

    async handleUpdateEmployee(id, employeeData) {
        try {
            await this.model.updateEmpleado(id, employeeData);
            alert("Empleado actualizado exitosamente");
            await this.refreshEmployeesList();
        } catch (error) {
            alert(error.message);
        }
    }

    async handleChangeStatus(id, statusId) {
        try {
            await this.model.updateTicketStatus(id, statusId);
            await this.refreshTicketList();
        } catch (error) {
            console.error("Error al actualizar el ticket:", error);
        }
    }

    async handleDeleteTicket(id) {
        try {
            await this.model.deleteTicket(id);
            await this.refreshTicketList();
        } catch (error) {
            console.error("Error al eliminar el ticket:", error);
        }
    }
}
