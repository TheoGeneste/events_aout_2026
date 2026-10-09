import e from "express";    
import participantController from '../Controllers/participants.controller.js'
const router = e.Router();

router.get("/", participantController.getAll);

router.get("/user/:userID", participantController.getByUserID);

router.get("/event/:eventID", participantController.getByEventID);

router.post("/", participantController.insert);

router.delete("/:userID/:eventID", participantController.deleteParticipant);

export default router;