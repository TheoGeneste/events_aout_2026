/*
 * Models/events.model.js — accès à la table "events"
 * ---------------------------------------------------
 * Colonnes (préfixe ev_ = "event") :
 *   ev_id          identifiant
 *   ev_title       titre, ex. "Atelier JavaScript"
 *   ev_description texte libre
 *   ev_date        date de l'événement
 *   ev_location    lieu, ex. "Salle 3"
 *   ev_owner       id de l'utilisateur qui a créé l'événement (clé vers users.us_id)
 *
 * La table "participants" fait le lien many-to-many :
 *   un user peut aller à plusieurs events
 *   un event peut avoir plusieurs users
 *   une ligne = une participation (pa_user, pa_event)
 */

import Db from '../Config/db.js'

// Tous les événements, du plus ancien au plus récent (ORDER BY ev_date),
// avec le pseudo du créateur grâce au JOIN sur users.
// Exemple de ligne renvoyée :
//   { ev_id: 1, ev_title: "Soirée", ev_description: "...", ev_date: "...",
//     ev_location: "Paris", ev_owner: 2, us_username: "lea" }
async function getAll() {
    const [rows] = await Db.query(`SELECT ev_id, ev_title, ev_description, ev_date, ev_location, ev_owner, us_username 
        FROM events
        INNER JOIN users ON us_id = ev_owner
        ORDER BY ev_date`);
    return rows;
}

// Un événement par son id. Pas de JOIN ici : on ne ramène pas le pseudo.
async function getById(id) {
    const [rows] = await Db.query("SELECT ev_id, ev_title, ev_description, ev_date, ev_location, ev_owner FROM events WHERE ev_id = ?", [id]);
    return rows[0];
}

// Crée un événement.
// event attendu par cette fonction :
//   { title: "Soirée", description: "Pizza", date: "2026-12-01", location: "Lyon", owner: 2 }
// (owner = us_id de l'organisateur)
async function insert(event) {
    const inserted = await Db.query("INSERT INTO events(ev_title, ev_description, ev_date, ev_location, ev_owner) VALUES (?,?,?,?,?)",
        [event.title, event.description, event.date, event.location, event.owner]);
    return inserted;
}

// Met à jour titre, description, date et lieu. L'owner n'est pas modifié ici.
// Les champs attendus portent les noms de colonnes : ev_title, ev_description, etc.
async function update(id, event) {
    const inserted = await Db.query("UPDATE events set ev_title = ?, ev_description = ?, ev_date = ?, ev_location = ? WHERE ev_id = ?",
        [event.ev_title, event.ev_description, event.ev_date, event.ev_location, id]);
    return inserted;
}

// Supprime un événement. Le nom de la fonction est "deleteevent" (sans majuscule),
// il est repris tel quel par le controller et la route.
async function deleteevent(id) {
    const deleted = await Db.query("DELETE FROM events WHERE ev_id = ?", [id]);
    return deleted;
}

/*
 * Événements auxquels un utilisateur est inscrit (table participants),
 * pas forcément ceux qu'il a créés.
 *
 * Deux JOIN :
 *   users → participants (us_id = pa_user)
 *   participants → events (ev_id = pa_event)
 * Puis on filtre WHERE us_id = l'utilisateur demandé.
 */
async function getByUserId(userId) {
    const [rows] = await Db.query(`SELECT ev_id, ev_title, ev_description, ev_date, ev_location, ev_owner  
        FROM users
        INNER JOIN participants ON us_id = pa_user
        INNER JOIN events ON ev_id = pa_event 
        WHERE us_id = ?;`, [userId]);
    return rows;
}

async function getParticipantForEvent(){
    const [rows] = await Db.query(`
        select ev_title, ev_date, ev_location, us_email from participants
        join users on participants.pa_user = users.us_id
        join events on participants.pa_event = events.ev_id
        WHERE ev_date = CURDATE() + INTERVAL 2 DAY`);
    return rows;
}
export default {
    getAll,
    getById,
    insert,
    update,
    deleteevent,
    getByUserId,
    getParticipantForEvent
}
