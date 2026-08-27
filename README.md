# ZenTech-Solutions

Un Sistema de Gestión de Tickets (HelpDesk) de nivel empresarial diseñado para atender incidencias tecnológicas a nivel global. Abarca soporte técnico, infraestructura de redes, desarrollo de software y ciberseguridad.

El proyecto se basa en una arquitectura Frontend puramente **MVC (Modelo-Vista-Controlador)** utilizando Vanilla JavaScript, sin frameworks adicionales.

La interfaz de usuario destaca por su diseño **Cyberpunk / Terminal UI**, utilizando paletas de colores oscuros, fuentes monoespaciadas (`Orbitron` y `Share Tech Mono`) y efectos visuales de terminal (scanlines, botones poligonales y acentos de neón), ideal para un entorno altamente técnico.

## Características

* **Patrón de Arquitectura MVC Estricto**: Separación clara de responsabilidades entre Modelo (datos), Vista (DOM) y Controlador (lógica e intermediación).
* **Interfaz "Terminal / Sci-Fi"**: Diseño moderno, inmersivo y responsivo, enfocado en profesionales de tecnología.
* **Sistema de Autenticación Integrado (SPA)**: 
  * Landing page (página de bienvenida) y formularios de Login / Registro.
  * Gestión segura de ruteo y navegación utilizando la History API del navegador.
* **Jerarquía de Usuarios (Permisos y Roles)**:
  * **Clientes**: Pueden crear tickets y ver únicamente los tickets que ellos han creado en la pestaña "Mis Tickets".
  * **Agentes/Empleados**: Tienen acceso a un "Panel de Agente" para visualizar los tickets correspondientes a su departamento. Tienen permisos exclusivos para marcar tickets como Resueltos o Eliminarlos.
* **Flujo Asíncrono y Memoria Local**: El sistema utiliza variables en memoria y `LocalStorage` para persistir la creación de tickets y usuarios sin necesidad de una base de datos real o backend, manteniendo los métodos preparados con promesas (`async/await`) para la futura integración con PostgreSQL.

## Stack Tecnológico

El proyecto está desarrollado completamente en el Frontend utilizando tecnologías web estándar (Vanilla):
- **HTML5**: Estructura semántica.
- **CSS3**: Estilos personalizados, variables CSS, Flexbox, Grid y `clip-path` para formas geométricas.
- **JavaScript (ES6+)**: Clases, Promesas, Async/Await.

## Estructura del Proyecto

```text
SG_TICKETS/
├── index.html            # Interfaz SPA con Landing, Auth y App
├── css/
│   └── style.css         # Hoja de estilos (Terminal/Robótica)
├── data/
│   └── users.json        # Archivo ignorado (.gitignore) con datos sensibles de DB
└── js/
    ├── app.js            # Inyector de dependencias (MVC + Auth)
    ├── models/
    │   ├── AuthModel.js  # Lógica de Login/Registro y persistencia local
    │   └── TicketModel.js # Manejo de datos y simulación asíncrona
    ├── views/
    │   ├── AuthView.js   # Manejo de DOM para autenticación y enrutado
    │   └── TicketView.js # Manipulación del DOM y captura de eventos (Pestañas)
    └── controllers/
        ├── AuthController.js # Orquestador de autenticación
        └── TicketController.js # Orquestador central de tickets
```

## Instalación y Uso

Dado que es un proyecto Frontend puro (Sprint 1), no se requiere Node.js ni servidor de bases de datos.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/zentech-solutions.git
   ```
2. Entra al directorio:
   ```bash
   cd zentech-solutions
   ```
3. Abre el archivo `index.html` directamente en tu navegador web preferido, o utiliza una extensión como *Live Server* en VSCode.

## Roadmap (Siguientes Pasos)

- [ ] **Sprint 2 - Integración de Base de Datos**: Reemplazar la memoria temporal del `TicketModel.js` con llamadas a una API REST / Base de datos real (Ej. Firebase, Supabase, o un backend propio en Node.js/Express) utilizando `fetch()`. Los métodos del modelo ya están preparados como funciones asíncronas para hacer esta transición transparente para la Vista y el Controlador.
- [ ] Persistencia de sesión de usuario y autenticación.
- [ ] Filtrado y paginación de tickets por nivel de severidad y área.

## Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).
