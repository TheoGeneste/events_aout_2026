/*
 * Models/comments.model.js — accès à la table "comments"
 * -------------------------------------------------------
 * Un commentaire appartient à un utilisateur ET à un événement.
 *
 * Colonnes (préfixe co_ = "comment") :
 *   co_id      identifiant
 *   co_comment le texte, ex. "Super soirée !"
 *   co_user    id de l'auteur (users.us_id)
 *   co_event   id de l'événement (events.ev_id)
 */

import Db from '../Config/db.js'

// Tous les commentaires de la base, sans filtre.
async function getAll() {
    const [rows] = await Db.query("SELECT co_id, co_comment, co_user, co_event FROM comments");
    return rows;
}

// Un commentaire par son id. undefined si l'id n'existe pas.
async function getById(id) {
    const [rows] = await Db.query("SELECT co_id, co_comment, co_user, co_event, us_username FROM comments INNER JOIN users ON comments.co_user = users.us_id WHERE co_id = ?", [id]);
    return rows[0];
}

// Ajoute un commentaire.
// comment attendu : { comment: "J'y serai !", user: 2, event: 5 }
async function insert(comment) {
    const inserted = await Db.query("INSERT INTO comments(co_comment, co_user, co_event ) VALUES (?,?,?)",
        [comment.comment, comment.user, comment.event]);
    return inserted;
}

// On ne modifie que le texte. L'auteur et l'événement restent les mêmes.
async function update(id, comment) {
    const inserted = await Db.query("UPDATE comments set co_comment = ? WHERE co_id = ?",
        [comment.co_comment, id]);
    return inserted;
}

// Supprime un commentaire par son id.
async function deleteComment(id) {
    const deleted = await Db.query("DELETE FROM comments WHERE co_id = ?", [id]);
    return deleted;
}

// Tous les commentaires écrits par un utilisateur.
// Le JOIN sur users sert à filtrer via us_id (équivalent de WHERE co_user = ?).
async function getByUserId(userId) {
    const [rows] = await Db.query(`SELECT co_comment, co_id, co_event 
        FROM comments 
        INNER JOIN users ON users.us_id = comments.co_user 
        WHERE us_id = ?`, [userId]);
    return rows;
}

// Pour récupérer tous les commentaires associés à un événement en particulier.
// Exemple : eventId = 5 → uniquement les avis laissés sur l'événement 5.
async function getByEventId(eventId) {
    // JE SELECTIONNE co_comment, co_id, co_user
    // DEPUIS LA TABLE COMMENTS
    // JE JOINS LA TABLE EVENTS (comments.co_event = events.ev_id)
    // OU ev_id = l'événement demandé
    const [rows] = await Db.query(`SELECT co_comment, co_id, co_user, us_username
        FROM comments 
        INNER JOIN events ON events.ev_id = comments.co_event 
        INNER JOIN users ON users.us_id = comments.co_user
        WHERE ev_id = ?`, [eventId]);
    return rows;
}

export default {
    getAll,
    getById,
    insert,
    update,
    deleteComment,
    getByUserId,
    getByEventId
}
