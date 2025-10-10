import express from "express";
import usuariosRouter from "./routes/usuarios.routes.js";
import ticketsRouter from "./routes/tickets.routes.js";
import comentariosRouter from "./routes/comentarios.routes.js";
import clientesRouter from "./routes/clientes.routes.js";

const app = express();
app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/tickets", ticketsRouter);
app.use("/comentarios", comentariosRouter);
app.use("/clientes", clientesRouter);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "✅ API HelpDesk corriendo correctamente en Render",
    version: "1.0.0",
    endpoints: {
      clientes: "/clientes",
      usuarios: "/usuarios",
      tickets: "/tickets",
      comentarios: "/comentarios"
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor Express escuchando en el puerto ${PORT}`));


