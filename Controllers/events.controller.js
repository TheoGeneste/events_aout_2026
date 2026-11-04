/*
 * Controllers/events.controller.js — gestion des événements
 * ----------------------------------------------------------
 * Routes (toutes derrière le token) :
 *   GET    /events      liste
 *   GET    /events/:id  un événement + ses commentaires + ses participants
 *   POST   /events      création
 *   PATCH  /events/:id  modification partielle
 *   DELETE /events/:id  suppression
 *
 * Exemple de création :
 *   POST /events
 *   {
 *     "title": "Atelier Node",
 *     "description": "Découverte d'Express",
 *     "date": "2026-12-01 18:00:00",
 *     "location": "Salle 3",
 *     "owner": 2
 *   }
 */

import eventModel from '../Models/events.model.js'
import commentModel from '../Models/comments.model.js'
import usersModel from '../Models/users.model.js'

// GET /events — liste triée par date, avec le pseudo de l'organisateur
async function getAll(req, res) {
    try {
        const events = await eventModel.getAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des events !" })
    }
}

/*
 * GET /events/:id
 * On enrichit l'événement avant de répondre :
 *   event.comments     → textes laissés sur cet événement
 *   event.participants → utilisateurs inscrits (id, pseudo, email)
 */
async function getById(req, res) {
    try {
        const id = req.params.id;
        const event = await eventModel.getById(id);
        if (!event) {
            return res.status(404).json({ error: "L'event n'existe pas !" })
        }
        const comments = await commentModel.getByEventId(id);
        const participants = await usersModel.getByEventId(id);
        event.comments = comments;
        event.participants = participants;
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de l'event !" })
    }
}

/*
 * PATCH /events/:id
 * Chaque champ du body est optionnel.
 * Exemple : { "location": "Salle 5" } ne change que le lieu.
 * On recopie d'abord l'événement existant, puis on écrase les champs envoyés,
 * puis on sauvegarde l'objet complet.
 */
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

/*
 * POST /events
 * Seul le titre est contrôlé. Les autres champs partent tels quels en base.
 * Le model attend : title, description, date, location, owner.
 */
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

// DELETE /events/:id — 404 si l'id est inconnu, sinon suppression puis rappel de l'objet supprimé
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
