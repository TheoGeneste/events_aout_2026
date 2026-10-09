import eventModel from '../Models/events.model.js'

async function getAll(req, res) {
    try {
        const events = await eventModel.getAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des events !" })
    }
}
async function getById(req, res) {
    try {
        const id = req.params.id;
        const event = await eventModel.getById(id);
        if (!event) {
            return res.status(404).json({ error: "L'event n'existe pas !" })
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de l'event !" })
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;
        const event = await eventModel.getById(id);
        if (!event) {
            return res.status(404).json({ error: "L'event n'existe pas !" })
        }

        if (body.title) {
            event.ev_title = body.title;
        }

        if (body.description) {
            event.ev_description = body.description;
        }

        if (body.date) {
            event.ev_date = body.date;
        }

        if (body.location) {
            event.ev_location = body.location;
        }

        const updated = await eventModel.update(id, event);
        res.json({ message: "Votre modification à bien été effetctué", event });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification de l'event !" })
    }
}
async function insert(req, res) {
    try {
        const body = req.body;
        if (!body.title) {
            res.status(403).json({ error: "Le titre est obligatoire" })
        }
        const inserted = await eventModel.insert(body);
        res.status(201).json({ message: "Votre insertion à bien été effectué", event: body });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l'insertion de l'event !" })
    }
}
async function deleteevent(req, res) {
    try {
        const id = req.params.id;
        const event = await eventModel.getById(id);
        if (!event) {
            return res.status(404).json({ error: "L'event n'existe pas !" })
        }
        const deleted = await eventModel.deleteevent(id);
        res.json({message : "Votre suppression à bien été effectué", event});
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de l'event !" })
    }
}

export default {
    getAll,
    getById,
    update,
    insert,
    deleteevent
}