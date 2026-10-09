import e from "express";
import eventController from '../Controllers/events.controller.js'

const router = e.Router();

router.get("/", eventController.getAll);

router.get("/:id", eventController.getById);

router.patch("/:id", eventController.update);

router.post("/", eventController.insert);

router.delete("/:id", eventController.deleteevent);

export default router;