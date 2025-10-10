import express from "express";
import usuariosRouter from "./routes/usuarios.routes.js";
import ticketsRouter from "./routes/tickets.routes.js";
import comentaiosRouter from "./routes/comentarios.routes.js";
import clientesRouter from "./routes/clientes.routes.js";

const app = express();
app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/tickets", ticketsRouter);
app.use("/comentarios", comentaiosRouter);
app.use("/clientes", clientesRouter);

app.listen(4000, () => console.log("Servidor Express escuchando en el puerto 4000"));
