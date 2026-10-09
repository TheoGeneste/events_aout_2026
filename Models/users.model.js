import Db from '../Config/db.js';

async function insert(user) {
    const inserted = await Db.query("INSERT INTO users(us_username,us_email,us_password) VALUES (?,?,?)",
        [user.username, user.email, user.password]);
    return inserted;
}

async function getByUsername(username) {
    const [rows] = await Db.query("SELECT us_id, us_username,us_email, us_password FROM users WHERE us_username = ?", [username]);
    return rows[0];
}

async function getAll() {
    const [rows] = await Db.query("SELECT us_id, us_username,us_email FROM users");
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query("SELECT us_id, us_username,us_email, us_password FROM users WHERE us_id = ?", [id]);
    return rows[0];
}

async function deleteUser(id) {
    const deleted = await Db.query("DELETE FROM users WHERE us_id = ?", [id]);
    return deleted;
}

async function update(id, user) {
    const updated = await Db.query("UPDATE users set us_username = ?, us_email=?, us_password=? WHERE us_id = ?",
        [user.us_username, user.us_email, user.us_password, id]);
    return updated;
}

async function getByEventId(eventId) {
    const [rows] = await Db.query(`SELECT us_id, us_username, us_email
        FROM users
        INNER JOIN participants ON pa_user = us_id
        WHERE pa_event = ?`, [eventId])
    return rows;
}

export default {
    getAll,
    getById,
    update,
    deleteUser,
    insert,
    getByUsername,
    getByEventId
}