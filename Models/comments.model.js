import Db from '../Config/db.js'

async function getAll() {
    const [rows] = await Db.query("SELECT co_id, co_comment, co_user, co_event FROM comments");
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query("SELECT co_id, co_comment, co_user, co_event FROM comments WHERE co_id = ?", [id]);
    return rows[0];
}

async function insert(comment) {
    const inserted = await Db.query("INSERT INTO comments(co_comment, co_user, co_event ) VALUES (?,?,?)",
        [comment.comment, comment.user, comment.event]);
    return inserted;
}

async function update(id, comment) {
    const inserted = await Db.query("UPDATE comments set co_comment = ? WHERE co_id = ?",
        [comment.co_comment, id]);
    return inserted;
}


async function deleteComment(id) {
    const deleted = await Db.query("DELETE FROM comments WHERE co_id = ?", [id]);
    return deleted;
}

async function getByUserId(userId) {
    const [rows] = await Db.query(`SELECT co_comment, co_id, co_event 
        FROM comments 
        INNER JOIN users ON users.us_id = comments.co_user 
        WHERE us_id = ?`, [userId]);
    return rows;
}

// Pour récupérer tout les commentaires associé a un evenement en particulier
async function getByEventId(eventId) {
    // JE SELECTIONNE co_comment, co_id, co_user
    // DEPUIS LA TABLE COMMENTS
    // JE JOINS LA TABLE EVENTS 
    // OU ev_id = ?
    const [rows] = await Db.query(`SELECT co_comment, co_id, co_user
        FROM comments 
        INNER JOIN events ON events.ev_id = comments.co_event 
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
