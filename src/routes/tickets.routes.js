import { Router } from "express";
import { getTickets, getTicketById, createTicket, cancelTicket, updateTicket } from "../Controllers/ticket.controllers.js";

const router = Router();

router.get("/", getTickets);
router.post("/", createTicket);
router.delete("/:ticket_id", cancelTicket);
router.patch("/:ticket_id", updateTicket);
router.get("/:ticket_id", getTicketById);

export default router;
