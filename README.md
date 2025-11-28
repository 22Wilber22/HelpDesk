# HelpDesk API

Sistema de gestión de tickets para soporte técnico (Call Center), desarrollado con Node.js, Express y MySQL.

## 🚀 Tecnologías
- **Backend**: Node.js + Express
- **Base de Datos**: MySQL (Railway)
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación**: Swagger UI

## ⚙️ Configuración e Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz con:
   ```env
   DB_HOST=
   DB_PORT=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   DB_WAIT_FOR_CONNECTIONS=
   DB_CONNECTION_LIMIT=
   DB_MAXIDLE=
   DB_IDLE_TIMEOUT=
   DB_QUEUE_LIMIT=
   JWT_SECRET=
   PORT=
   ```

3. **Iniciar servidor:**
   ```bash
   npm run dev
   ```
   El servidor correrá en `http://localhost:4000`.

## 📚 Documentación API (Swagger)
Una vez iniciado el servidor, visita:
👉 **[http://localhost:4000/api-docs](http://localhost:4000/api-docs)**

Aquí podrás probar todos los endpoints interactivamente.

## 👥 Roles y Permisos

El sistema maneja 4 roles con permisos granulares:

| Acción | Admin | Supervisor | Agente | Usuario (Cliente) |
|--------|-------|------------|--------|-------------------|
| **Tickets** |
| Ver Todos | ✅ | ✅ | ❌ (Solo asignados) | ❌ (Solo propios) |
| Crear | ✅ | ✅ | ✅ | ✅ |
| Editar (Estado/Agente) | ✅ | ✅ | ✅ | ❌ |
| Editar (Desc/Prioridad) | ✅ | ✅ | ✅ | ✅ (Solo propios) |
| Asignar Agente | ✅ | ✅ | ✅ | ❌ |
| Cancelar | ✅ | ✅ | ❌ | ✅ (Solo propios) |
| **Usuarios** |
| Ver Lista | ✅ | ✅ | ✅ | ❌ |
| Ver Perfil Detallado | ✅ | ✅ | ❌ (Solo propio) | ❌ (Solo propio) |
| Crear/Editar/Borrar | ✅ | ❌ | ❌ | ❌ |
| **Clientes** |
| Ver Lista | ✅ | ✅ | ✅ | ❌ |
| Crear/Editar | ✅ | ✅ | ✅ | ❌ |
| Eliminar | ✅ | ❌ | ❌ | ❌ |
| **Dashboard** |
| Ver Stats Globales | ✅ | ✅ | ❌ | ❌ |
| Ver Stats Propios | N/A | N/A | ✅ | ✅ |

## 📊 Dashboard
Endpoint: `GET /dashboard/resumen`
Devuelve estadísticas personalizadas según el rol:
- **Admin/Supervisor**: Total de tickets de la empresa.
- **Agente**: Total de tickets asignados.
- **Usuario**: Total de tickets creados.

## 📂 Estructura del Proyecto
- `src/Controllers`: Lógica de negocio.
- `src/routes`: Definición de endpoints y protección por roles.
- `config/db.js`: Conexión a base de datos.
- `config/jwt.js`: Middleware de autenticación.
