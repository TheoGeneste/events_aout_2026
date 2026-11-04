/*
 * Routes/comments.route.js — URLs des commentaires
 * -------------------------------------------------
 * Branché sur "/comments" dans index.js, derrière checkToken.
 *
 *   GET    /comments       tous les commentaires
 *   GET    /comments/:id   un seul, ex. GET /comments/8
 *   PATCH  /comments/:id   changer le texte
 *   POST   /comments       en créer un
 *   DELETE /comments/:id   le supprimer
 *
 * Les commentaires d'un événement précis ne sont pas une route à part :
 * ils sont ajoutés à la réponse de GET /events/:id (voir events.controller.js).
 */

import e from "express";
import commentController from '../Controllers/comments.controller.js'

const router = e.Router();

router.get("/", commentController.getAll);

router.get("/:id", commentController.getById);

router.patch("/:id", commentController.update);

router.post("/", commentController.insert);

router.delete("/:id", commentController.deleteComment);

export default router;
