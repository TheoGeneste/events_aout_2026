import Db from '../Config/db.js'

async function getAll() {
    const [rows] = await Db.query("SELECT ev_id, ev_title, ev_description, ev_date, ev_location, ev_owner FROM events");
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query("SELECT ev_id, ev_title, ev_description, ev_date, ev_location, ev_owner FROM events WHERE ev_id = ?", [id]);
    return rows[0];
}

async function insert(event) {
    const inserted = await Db.query("INSERT INTO events(ev_title, ev_description, ev_date, ev_location, ev_owner) VALUES (?,?,?,?,?)",
        [event.title, event.description, event.date, event.location, event.owner]);
    return inserted;
}

async function update(id,event) {
    const inserted = await Db.query("UPDATE events set ev_title = ?, ev_description = ?, ev_date = ?, ev_location = ? WHERE ev_id = ?",
        [event.ev_title, event.ev_description, event.ev_date, event.ev_location, id]);
    return inserted;
}


async function deleteevent(id) {
    const deleted = await Db.query("DELETE FROM events WHERE ev_id = ?",[id]);
    return deleted;
}

export default {
    getAll,
    getById,
    insert,
    update,
    deleteevent
}
