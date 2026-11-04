/*
 * Models/users.model.js — accès à la table "users"
 * -------------------------------------------------
 * Un model ne gère PAS les réponses HTTP (pas de res.json ici).
 * Il parle uniquement à MySQL et renvoie des données au controller.
 *
 * Colonnes de la table (préfixe us_ = "user") :
 *   us_id        identifiant auto-incrémenté
 *   us_username  pseudo
 *   us_email     email
 *   us_password  mot de passe DÉJÀ hashé par bcrypt (jamais en clair)
 *
 * Le "?" dans le SQL est un paramètre préparé.
 * Il est remplacé par la valeur du tableau, de façon sûre.
 * Exemple :
 *   Db.query("... WHERE us_id = ?", [5])
 *   devient en pratique : WHERE us_id = 5
 *   sans coller la valeur dans la chaîne (protection contre l'injection SQL).
 *
 * Db.query renvoie un tableau [résultat, infos].
 * Pour un SELECT, résultat est la liste des lignes → on écrit const [rows] = ...
 */

import Db from '../Config/db.js';

// Crée un utilisateur.
// user attendu : { username: "toto", email: "toto@exemple.com", password: "$2b$10$..." }
async function insert(user) {
    const inserted = await Db.query("INSERT INTO users(us_username,us_email,us_password) VALUES (?,?,?)",
        [user.username, user.email, user.password]);
    // inserted[0] contient notamment insertId (l'id généré par MySQL)
    return inserted;
}

// Cherche un utilisateur par son pseudo. Utilisé au login.
// Retourne le premier objet trouvé, ou undefined s'il n'existe pas.
// On inclut us_password ici car le controller doit comparer le hash.
async function getByUsername(username) {
    const [rows] = await Db.query("SELECT us_id, us_username,us_email, us_password FROM users WHERE us_username = ?", [username]);
    return rows[0];
}

// Liste tous les utilisateurs, SANS le mot de passe (on ne l'expose pas dans une liste).
async function getAll() {
    const [rows] = await Db.query("SELECT us_id, us_username,us_email FROM users");
    return rows;
}

// Un seul utilisateur par son id. rows[0] car le WHERE ne doit renvoyer qu'une ligne.
async function getById(id) {
    const [rows] = await Db.query("SELECT us_id, us_username,us_email, us_password FROM users WHERE us_id = ?", [id]);
    return rows[0];
}

// Supprime l'utilisateur dont l'id est passé.
// Attention : s'il a des événements / commentaires liés, MySQL peut refuser
// à cause des clés étrangères.
async function deleteUser(id) {
    const deleted = await Db.query("DELETE FROM users WHERE us_id = ?", [id]);
    return deleted;
}

// Met à jour pseudo, email et mot de passe d'un utilisateur existant.
// Les noms de champs ici sont ceux de la BASE (us_username), pas ceux du body HTTP.
async function update(id, user) {
    const updated = await Db.query("UPDATE users set us_username = ?, us_email=?, us_password=? WHERE us_id = ?",
        [user.us_username, user.us_email, user.us_password, id]);
    return updated;
}

/*
 * Participants d'un événement.
 * INNER JOIN ne garde que les users qui ont une ligne dans "participants"
 * pour cet événement.
 *
 * Exemple : eventId = 4
 *   users.id 1 "lea"  + participants (user 1, event 4)  → gardée
 *   users.id 2 "max"  + aucune participation à l'event 4 → ignorée
 */
async function getByEventId(eventId) {
    const [rows] = await Db.query(`SELECT us_id, us_username, us_email
        FROM users
        INNER JOIN participants ON pa_user = us_id
        WHERE pa_event = ?`, [eventId])
    return rows;
}

// On exporte un objet : le controller fait userModel.getAll(), userModel.insert(), etc.
export default {
    getAll,
    getById,
    update,
    deleteUser,
    insert,
    getByUsername,
    getByEventId
}
