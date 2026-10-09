import Db from '../Config/db.js'

async function getAll() {
    const [rows] = await Db.query("SELECT pa_user, pa_event FROM participants");
    return rows;
}

async function getByEventID(eventID) {
    const [rows] = await Db.query("SELECT pa_user, pa_event FROM participants WHERE pa_event = ?", [eventID]);
    return rows;
}

async function getByUserID(userID) {
    const [rows] = await Db.query("SELECT pa_user, pa_event FROM participants WHERE pa_user = ?", [userID]);
    return rows;
}

async function insert(participant) {
    const inserted = await Db.query("INSERT INTO participants (pa_user, pa_event) VALUES (?,?) ", [participant.user, participant.event]);
    return inserted;
}


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