import participantModel from '../Models/participants.model.js'

async function getAll(req, res) {
    try {
        const participants = await participantModel.getAll();
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la récupération des participants" })
    }
}

async function getByUserID(req, res) {
    try {
        const userID = req.params.userID;
        const participants = await participantModel.getByUserID(userID);
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la récupération des participation par User" })
    }
}

async function getByEventID(req, res) {
    try {
        const eventID = req.params.eventID;
        const participants = await participantModel.getByEventID(eventID);
        res.json(participants); 
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de la récupération des participants par Event" })
    }
}

async function insert(req, res) {
    try {
        const body = req.body;
        if(!body.user || !body.event){
            return res.status(403).json({error : "Tout les champs sont obligatoires !"})
        }
        const inserted = await participantModel.insert(body);
        res.status(201).json({message : "Votre insertion à bien été effectué", participant : body})
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenur lors de l'insertion du participant" })
    }
}

async function deleteParticipant(req, res) {
    try {
        const userID = req.params.userID;
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