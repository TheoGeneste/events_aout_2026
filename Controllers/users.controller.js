/*
 * Controllers/users.controller.js — gestion des utilisateurs
 * -----------------------------------------------------------
 * Toutes ces routes sont protégées par checkToken (voir index.js).
 * Le controller :
 *   - lit l'URL (req.params) et le JSON (req.body)
 *   - appelle le model
 *   - choisit le code HTTP et le JSON de réponse
 *
 * Rappel des codes utilisés ici :
 *   200 (défaut de res.json) → succès
 *   201 → créé
 *   403 → données manquantes ou ancien mot de passe faux
 *   404 → cet id n'existe pas
 *   500 → plantage inattendu (SQL, etc.)
 *
 * Exemple : GET /users/3
 *   req.params.id vaut "3" (toujours une chaîne, MySQL la convertit)
 */

import userModel from "../Models/users.model.js";
import commentModel from '../Models/comments.model.js'
import eventModel from '../Models/events.model.js'
import bcrypt from 'bcrypt';

// GET /users  → tableau de tous les utilisateurs (sans mot de passe)
async function getAll(req, res) {
    try {
        const users = await userModel.getAll();
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des users" })
    }
}

/*
 * GET /users/:id
 * Renvoie l'utilisateur PLUS ses participations et ses commentaires.
 * On les accroche sur l'objet avant de l'envoyer :
 *   user.events = [...]
 *   user.comments = [...]
 */
async function getById(req, res) {
    try {
        // :id dans la route devient req.params.id
        const id = req.params.id;
        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ erreur: "Le user n'existe pas" });
        }
        // Je vais chercher tous les événements où ce user participe
        const events = await eventModel.getByUserId(id);
        // Je vais chercher tous les commentaires écrits par ce user
        const comments = await commentModel.getByUserId(id);
        user.comments = comments;
        user.events = events;
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du user" })
    }
}

/*
 * PATCH /users/:id
 * PATCH = modification partielle : on n'envoie que les champs à changer.
 * Exemple de body : { "email": "nouveau@mail.com" }
 * Les champs absents gardent leur ancienne valeur, car on part de l'objet
 * déjà lu en base puis on ne remplace que ce qui est fourni.
 *
 * Si un mot de passe est fourni, on le hash avant de l'enregistrer.
 */
async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;
        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ erreur: "Le user n'existe pas" });
        }

        if (body.email) {
            user.us_email = body.email;
        }

        if (body.username) {
            user.us_username = body.username;
        }

        if (body.password) {
            user.us_password = bcrypt.hashSync(body.password, 10);
        }

        const updated = await userModel.update(id, user);
        res.json({ message: "Votre modification à bien été effectué", user });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification du users" })
    }
}

/*
 * POST /users
 * Création d'un utilisateur par un client déjà connecté.
 * Contrairement à /auth/register, le mot de passe n'est PAS hashé ici
 * avant l'insert : le body est passé tel quel au model.
 * Body attendu : { "username": "lea", "email": "lea@mail.com", "password": "secret" }
 */
async function insert(req, res) {
    try {
        const body = req.body;
        if (!body.username || !body.email || !body.password) {
            return res.status(403).json({ error: "Tout les champs sont requis !" })
        }
        const inserted = await userModel.insert(body);
        res.status(201).json({ message: "Votre ajout d'utilisateur à bien été fait", user: body })
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l'insertion du user" })
    }
}

// DELETE /users/:id — vérifie que l'utilisateur existe, puis le supprime.
async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ erreur: "Le user n'existe pas" });
        }
        const deleted = await userModel.deleteUser(id);
        res.json({ message: "Votre suppression à bien été faites", user });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression du user" })
    }
}

/*
 * GET /users/me
 * "me" = l'utilisateur du token, pas un id dans l'URL.
 * checkToken a déjà rempli req.user avec le contenu du JWT.
 * Exemple de req.user juste après le login :
 *   {
 *     "us_id": 22,
 *     "us_username": "toto",
 *     "us_email": "toto@exemple.com",
 *     "us_password": "$2b$10$aI4SAj6/EurmUB5Fhv2esOfVBZ6Zo6cS0rbj0Tm/TlezudY.DeNu."
 *   }
 * On y ajoute ensuite events et comments, comme dans getById.
 */
async function getMe(req, res) {
    try {
        const userConnected = req.user;
        // Je vais chercher tous les événements où ce user participe
        const events = await eventModel.getByUserId(userConnected.us_id);
        // Je vais chercher tous les commentaires écrits par ce user
        const comments = await commentModel.getByUserId(userConnected.us_id);
        userConnected.comments = comments;
        userConnected.events = events;
        res.json(userConnected);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du profile" })
    }
}

/*
 * PATCH /users/resetPassword
 * Change le mot de passe de la personne connectée (req.user), pas d'un id quelconque.
 * Body attendu :
 *   {
 *     "old_password": "secret123",
 *     "new_password": "nouveau456",
 *     "confirm_password": "nouveau456"
 *   }
 * old_password est comparé au hash. confirm_password est lu mais pas vérifié ici.
 */
async function resetPassword(req, res) {
    try {
        const user = req.user;
        // Décomposition : équivalent à
        //   const old_password = req.body.old_password; etc.
        const { old_password, new_password, confirm_password } = req.body;

        const verifyPassword = bcrypt.compareSync(old_password, user.us_password);
        if (verifyPassword == false) {
            // Écriture équivalente : if (!verifyPassword)
            return res.status(403).json({ error: "Ancien mot de passe ne correspond pas." })
        }

        const hashPassword = bcrypt.hashSync(new_password, 10);

        user.us_password = hashPassword;
        const updatedUser = userModel.update(user.us_id, user);
        res.status(201).json({ message: "Votre mot de passe à bien été changé" })
    } catch (error) {
        res.status(500).json({error : "Une erreur est survenue lors de la modification du mot de passe"})
    }
}

export default {
    getAll,
    getById,
    update,
    insert,
    deleteUser,
    getMe,
    resetPassword
}
