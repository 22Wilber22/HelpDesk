import { Router } from "express";
import { getUser, getUserById, postUser, deleteUser, patchUser } from "../Controllers/usuarios.controller.js";

const router = Router();

router.get("/", getUser);
router.post("/", postUser);
router.delete("/:usuario_id", deleteUser);
router.patch("/:usuario_id", patchUser);
router.get("/:usuario_id", getUserById);

export default router;
