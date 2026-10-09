import e from "express";
import userController from '../Controllers/users.controller.js'

const router = e.Router();

router.get("/", userController.getAll);

router.get("/:id", userController.getById);

router.patch("/:id", userController.update);

router.post("/", userController.insert);

router.delete("/:id", userController.deleteUser);

export default router;