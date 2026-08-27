# SG Tickets - Sistema de Gestión 

Un Sistema de Gestión de Tickets (HelpDesk) diseñado específicamente para entornos universitarios. El proyecto se basa en una arquitectura Frontend puramente **MVC (Modelo-Vista-Controlador)** utilizando Vanilla JavaScript, sin frameworks adicionales.

La interfaz de usuario destaca por su diseño **Cyberpunk / Terminal UI**, utilizando paletas de colores oscuros, fuentes monoespaciadas (`Orbitron` y `Share Tech Mono`) y efectos visuales de terminal (scanlines, botones poligonales y acentos de neón).

## Características

* **Patrón de Arquitectura MVC Estricto**: Separación clara de responsabilidades entre Modelo (datos), Vista (DOM) y Controlador (lógica e intermediación).
* **Interfaz "Terminal / Sci-Fi"**: Diseño moderno, inmersivo y responsivo.
* **Flujo Asíncrono Simulado**: El Modelo está preparado con promesas (`async/await`) para simular la latencia de una base de datos y facilitar la futura integración backend.
* **Gestión de Tickets**:
  * Creación de nuevos tickets (Asunto, Descripción, Departamento).
  * Listado en tiempo real de tickets activos.
  * Resolución de tickets (cambio de estado con actualización de interfaz).
  * Eliminación de tickets.

## Stack Tecnológico

El proyecto está desarrollado completamente en el Frontend utilizando tecnologías web estándar (Vanilla):
- **HTML5**: Estructura semántica.
- **CSS3**: Estilos personalizados, variables CSS, Flexbox, Grid y `clip-path` para formas geométricas.
- **JavaScript (ES6+)**: Clases, Promesas, Async/Await.

## Estructura del Proyecto

```text
SG_TICKETS/
├── index.html            # Archivo principal de la interfaz
├── css/
│   └── style.css         # Hoja de estilos (Estética Terminal/Robótica)
└── js/
    ├── app.js            # Punto de entrada (Inicialización del MVC)
    ├── models/
    │   └── TicketModel.js # Manejo de datos y simulación asíncrona
    ├── views/
    │   └── TicketView.js  # Manipulación del DOM y captura de eventos
    └── controllers/
        └── TicketController.js # Orquestador central
```

## Instalación y Uso

Dado que es un proyecto Frontend puro (Sprint 1), no se requiere Node.js ni servidor de bases de datos.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/sg-tickets-universidad.git
   ```
2. Entra al directorio:
   ```bash
   cd sg-tickets-universidad
   ```
3. Abre el archivo `index.html` directamente en tu navegador web preferido, o utiliza una extensión como *Live Server* en VSCode.

## Roadmap (Siguientes Pasos)

- [ ] **Sprint 2 - Integración de Base de Datos**: Reemplazar la memoria temporal del `TicketModel.js` con llamadas a una API REST / Base de datos real (Ej. Firebase, Supabase, o un backend propio en Node.js/Express) utilizando `fetch()`. Los métodos del modelo ya están preparados como funciones asíncronas para hacer esta transición transparente para la Vista y el Controlador.
- [ ] Persistencia de sesión de usuario y autenticación.
- [ ] Filtrado y paginación de tickets.

## Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).
