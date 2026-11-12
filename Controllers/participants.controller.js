/*
 * Controllers/participants.controller.js — inscriptions aux événements
 * ---------------------------------------------------------------------
 * Une "participation" = un utilisateur inscrit à un événement.
 *
 * Routes :
 *   GET    /participants                     toutes les inscriptions
 *   GET    /participants/user/:userID        celles d'un utilisateur
 *   GET    /participants/event/:eventID      celles d'un événement
 *   POST   /participants                     inscrire quelqu'un
 *   DELETE /participants/:userID/:eventID    désinscrire
 *
 * Exemple d'inscription :
 *   POST /participants
 *   { "user": 2, "event": 5 }
 *
 * Exemple de suppression :
 *   DELETE /participants/2/5
 *   → retire l'utilisateur 2 de l'événement 5 uniquement
 */

import participantModel from '../Models/participants.model.js'
import mailService from '../Services/mail.service.js'

async function getAll(req, res) {
    try {
        const participants = await participantModel.getAll();
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la récupération des participants" })
    }
}

// GET /participants/user/2 → événements auxquels l'utilisateur 2 est inscrit
async function getByUserID(req, res) {
    try {
        // Le nom :userID dans la route doit correspondre exactement à req.params.userID
        const userID = req.params.userID;
        const participants = await participantModel.getByUserID(userID);
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la récupération des participation par User" })
    }
}

// GET /participants/event/5 → utilisateurs inscrits à l'événement 5
async function getByEventID(req, res) {
    try {
        const eventID = req.params.eventID;
        const participants = await participantModel.getByEventID(eventID);
        res.json(participants); 
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la récupération des participants par Event" })
    }
}

// POST /participants — user ET event sont obligatoires
async function insert(req, res) {
    try {
        const body = req.body;
        if(!req.user || !body.event){
            return res.status(403).json({error : "Tout les champs sont obligatoires !"})
        }
        const inserted = await participantModel.insert({user : req.user.us_id, event : body.event});
        const data = await participantModel.getDataByUserIDAndEventID(req.user.us_id, body.event);
        console.log(data    );
        console.log(data[0].us_email, data[0].ev_title, data[0].ev_date, data[0].ev_location);
        if(data){
            await mailService.eventConfirm(data[0].us_email, data[0].ev_title, data[0].ev_date, data[0].ev_location);
        }
        res.status(201).json({message : "Votre insertion à bien été effectué", participant : body})
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de l'insertion du participant", error : error.message })
        console.error(error);
    }
}

/*
 * DELETE /participants/:userID/:eventID
 * Les deux ids sont dans l'URL, pas dans le body.
 * Pour /participants/2/5 :
 *   req.params.userID  === "2"
 *   req.params.eventID === "5"
 */
async function deleteParticipant(req, res) {
    try {
        const userID = req.user.us_id;
        const eventID = req.params.eventID;
        const deleted = await participantModel.deleteParticipant(userID, eventID);
        res.json({message : "Votre suppression à bien été effectué", participant : {user : userID, event :eventID}})
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la suppression du participant" })
    }
}

export default {
    getAll,
    getByEventID,
    getByUserID,
    insert,
    deleteParticipant
}
