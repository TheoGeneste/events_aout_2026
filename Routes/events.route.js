/*
 * Routes/events.route.js — URLs des événements
 * ---------------------------------------------
 * Branché sur "/events" dans index.js, derrière checkToken.
 *
 *   GET    /events       liste (du plus ancien au plus récent)
 *   GET    /events/:id   détail, ex. GET /events/3
 *   PATCH  /events/:id   modification partielle
 *   POST   /events       création
 *   DELETE /events/:id   suppression
 *
 * ":" devant id veut dire "cette partie de l'URL est variable".
 * Le controller la lit avec req.params.id.
 */

import e from "express";
import eventController from '../Controllers/events.controller.js'

const router = e.Router();

router.get("/", eventController.getAll);

router.get("/:id", eventController.getById);

router.patch("/:id", eventController.update);

router.post("/", eventController.insert);

router.delete("/:id", eventController.deleteevent);

export default router;
