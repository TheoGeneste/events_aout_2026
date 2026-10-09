import e from "express";
import commentController from '../Controllers/comments.controller.js'

const router = e.Router();

router.get("/", commentController.getAll);

router.get("/:id", commentController.getById);

router.patch("/:id", commentController.update);

router.post("/", commentController.insert);

router.delete("/:id", commentController.deleteComment);

export default router;