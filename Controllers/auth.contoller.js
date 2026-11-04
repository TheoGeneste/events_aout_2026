/*
 * Controllers/auth.contoller.js — inscription et connexion
 * ---------------------------------------------------------
 * (Le nom du fichier contient une faute : "contoller" au lieu de "controller".
 *  On le garde tel quel, sinon tous les imports casseraient.)
 *
 * Deux actions publiques, sans token :
 *   POST /auth/register  → crée un compte
 *   POST /auth/login     → vérifie le mot de passe et renvoie un JWT
 *
 * Pourquoi hasher le mot de passe ?
 *   On ne stocke jamais "secret123" en base. bcrypt le transforme en
 *   une chaîne illisible, ex. "$2b$10$aI4SAj6/EurmUB5Fhv2esO..."
 *   Même quelqu'un qui lit la base ne récupère pas le mot de passe.
 *   Le nombre 10 est le "coût" : plus il est haut, plus le hash est lent
 *   (et donc plus dur à deviner par force brute).
 *
 * try / catch : si MySQL ou bcrypt plante, on renvoie une erreur 500
 * au lieu de faire crasher tout le serveur.
 */

import userModel from '../Models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

/*
 * Inscription.
 * Corps JSON attendu :
 *   { "username": "toto", "email": "toto@exemple.com", "password": "secret123" }
 *
 * Étapes :
 *   1. Vérifier que les 3 champs sont présents
 *   2. Remplacer le mot de passe clair par son hash
 *   3. Insérer la ligne dans "users"
 *   4. Répondre 201 (Created)
 */
async function register(req, res) {
    try {
        // req.body = le JSON envoyé par le client (grâce à express.json() dans index.js)
        const body = req.body;

        // !body.username est vrai si le champ est absent, null, ou une chaîne vide ""
        if (!body.username || !body.password || !body.email) {
            // 403 ici = "requête refusée car incomplète"
            return res.status(403).json({ error: "Tout les champs sont obligatoires !" })
        }

        // hashSync est la version synchrone : elle bloque le temps du calcul, puis rend le hash.
        // On écrase body.password : à partir de là, le clair n'est plus dans l'objet.
        body.password = bcrypt.hashSync(body.password, 10);

        const registered = await userModel.insert(body);
        // 201 = ressource créée. 200 voudrait dire "OK" sans préciser la création.
        res.status(201).json({ message: "Vous êtes bien inscrit", registered })
    } catch (error) {
        // 500 = erreur interne (base injoignable, email déjà utilisé si contrainte UNIQUE, etc.)
        res.status(500).json({ error: "Une erreur est survenue lors de l'inscription !" })
    }
}

/*
 * Connexion.
 * Corps JSON attendu :
 *   { "username": "toto", "password": "secret123" }
 *
 * On répond toujours "Identifiants incorrect" que le pseudo ou le mot de passe
 * soit faux. Ainsi un attaquant ne sait pas lequel des deux est mauvais.
 *
 * Si c'est bon, on signe un JWT valable 1 heure.
 * Le client devra le renvoyer dans :
 *   Authorization: Bearer <token>
 */
async function login(req, res) {
    try {
        const body = req.body;
        if (!body.username || !body.password) {
            return res.status(403).json({ error: "Identifiants incorrect" });
        }

        // Cherche la ligne users dont le pseudo correspond. undefined si inconnu.
        const user = await userModel.getByUsername(body.username);

        if(!user){
            return res.status(403).json({ error: "Identifiants incorrect" });
        }

        // compareSync(clair, hash) recalcule un hash et le compare à celui en base.
        // On ne "déchiffre" jamais un hash bcrypt : ce n'est pas réversible.
        const passwordVerify = bcrypt.compareSync(body.password, user.us_password);

        if (!passwordVerify) {
            return res.status(403).json({ error: "Identifiants incorrect" });
        }

        // jwt.sign(payload, secret, options)
        //   payload  → données embarquées dans le token (ici tout l'objet user)
        //   secret   → clé connue seulement du serveur (JWT_SECRET dans .env)
        //   expiresIn: "1h" → le token sera refusé après une heure
        const token = jwt.sign({
            user
        },process.env.JWT_SECRET,{expiresIn : "1h"});

        res.json({message : "Vous êtes bien connecté !", token});
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la connexion !" })
    }
}

export default {
    register,
    login
}
