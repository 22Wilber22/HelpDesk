import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Importar rutas
import authRoutes from "./routes/authRoutes.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import ticketsRouter from "./routes/tickets.routes.js";
import comentariosRouter from "./routes/comentarios.routes.js";
import clientesRouter from "./routes/clientes.routes.js";

const app = express();
app.use(express.json());

// =============================
// CONFIGURACIÓN DE SWAGGER
// =============================
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HelpDesk API",
      version: "1.0.0",
      description: "Documentación interactiva de la API HelpDesk (Call Center)",
    },
    servers: [
      {
        url: "https://helpdesk-9r41.onrender.com",
        description: "Servidor de producción (Render)",
      },
      {
        url: "http://localhost:4000",
        description: "Servidor local (desarrollo)",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{
      BearerAuth: []
    }]
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============================
// RUTAS PÚBLICAS (Sin autenticación)
// =============================
app.use("/auth", authRoutes);

// =============================
// RUTAS PROTEGIDAS (Con autenticación)
// =============================
app.use("/usuarios", usuariosRouter);
app.use("/tickets", ticketsRouter);
app.use("/comentarios", comentariosRouter);
app.use("/clientes", clientesRouter);

// =============================
// RUTA RAÍZ DE PRUEBA
// =============================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "API HelpDesk corriendo correctamente con Swagger",
    version: "1.0.0",
  });
});

// =============================
// MANEJO DE ERRORES
// =============================
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// =============================
// RUTA NO ENCONTRADA
// =============================
app.use("*", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// =============================
// SERVIDOR (PUERTO DINÁMICO)
// =============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});