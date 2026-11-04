/*
 * Routes/participants.route.js — URLs des inscriptions
 * -----------------------------------------------------
 * Branché sur "/participants" dans index.js, derrière checkToken.
 *
 *   GET    /participants                      toutes les inscriptions
 *   GET    /participants/user/:userID         ex. /participants/user/2
 *   GET    /participants/event/:eventID       ex. /participants/event/5
 *   POST   /participants                      body { "user": 2, "event": 5 }
 *   DELETE /participants/:userID/:eventID     ex. /participants/2/5
 *
 * Deux paramètres dans la même URL :
 *   le 1er segment après /participants/ va dans userID
 *   le 2e va dans eventID
 * Les routes "/user/..." et "/event/..." sont déclarées avant
 * "/:userID/:eventID" pour que les mots "user" et "event"
 * ne soient pas pris pour des identifiants.
 */

import e from "express";    
import participantController from '../Controllers/participants.controller.js'
const router = e.Router();

router.get("/", participantController.getAll);

router.get("/user/:userID", participantController.getByUserID);

router.get("/event/:eventID", participantController.getByEventID);

router.post("/", participantController.insert);

router.delete("/:userID/:eventID", participantController.deleteParticipant);

export default router;
