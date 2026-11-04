/*
 * Models/participants.model.js — table de liaison "participants"
 * ---------------------------------------------------------------
 * Cette table ne décrit pas une personne : elle dit
 * "cet utilisateur participe à cet événement".
 *
 * Colonnes (préfixe pa_ = "participant") :
 *   pa_user   id de l'utilisateur
 *   pa_event  id de l'événement
 *
 * Il n'y a pas de pa_id : la paire (user + event) identifie la participation.
 * Exemple de ligne : { pa_user: 2, pa_event: 5 }
 *   → l'utilisateur 2 est inscrit à l'événement 5.
 */

import Db from '../Config/db.js'

// Toutes les inscriptions, tous événements confondus.
async function getAll() {
    const [rows] = await Db.query("SELECT pa_user, pa_event FROM participants");
    return rows;
}

// Qui est inscrit à cet événement ? (liste de paires user/event)
async function getByEventID(eventID) {
    const [rows] = await Db.query("SELECT pa_user, pa_event FROM participants WHERE pa_event = ?", [eventID]);
    return rows;
}

// À quels événements cet utilisateur est-il inscrit ?
async function getByUserID(userID) {
    const [rows] = await Db.query("SELECT pa_user, pa_event FROM participants WHERE pa_user = ?", [userID]);
    return rows;
}

// Inscrit un utilisateur à un événement.
// participant attendu : { user: 2, event: 5 }
async function insert(participant) {
    const inserted = await Db.query("INSERT INTO participants (pa_user, pa_event) VALUES (?,?) ", [participant.user, participant.event]);
    return inserted;
}

// Désinscrit un utilisateur d'un événement précis.
// Les deux conditions sont nécessaires : supprimer seulement par user
// enlèverait toutes ses inscriptions.
async function deleteParticipant(userID, eventID) {
    const deleted = await Db.query("DELETE FROM participants WHERE pa_user = ? AND pa_event = ?",[userID, eventID]);
    return deleted;
}

export default {
    getAll,
    getByEventID,
    getByUserID,
    insert,
    deleteParticipant
}
