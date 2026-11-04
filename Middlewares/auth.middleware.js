/*
 * Middlewares/auth.middleware.js — garde d'authentification
 * ----------------------------------------------------------
 * Un middleware est une fonction qui s'exécute AVANT le controller.
 * Ici, elle vérifie que le client envoie un JWT (JSON Web Token) valide.
 *
 * Déroulé d'une requête protégée :
 *   1. Le client se connecte via POST /auth/login et reçoit un token.
 *   2. Il rappelle l'API avec le header :
 *        Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *   3. checkToken lit ce header, vérifie la signature et la date d'expiration.
 *   4. Si tout est bon, il stocke l'utilisateur dans req.user et appelle next().
 *   5. Le controller peut alors lire req.user (voir getMe dans users.controller.js).
 *
 * Codes HTTP utilisés :
 *   401 → pas de token (on ne sait pas qui vous êtes)
 *   403 → token présent mais refusé (mauvaise signature, expiré...)
 */

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

/*
 * Signature d'un middleware Express : (req, res, next)
 *   req  → la requête entrante (headers, body, params, url...)
 *   res  → la réponse qu'on renvoie au client
 *   next → fonction à appeler pour passer au middleware / controller suivant
 *          Si on ne l'appelle pas, la requête reste bloquée ici.
 */
function checkToken(req, res, next) {
    // Récupère le header Authorization.
    // Exemple de valeur : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const headers = req.headers["authorization"];

    // On découpe la chaîne sur l'espace.
    // "Bearer eyJhbG..." → ["Bearer", "eyJhbG..."]
    // L'index [1] est le vrai token. "headers &&" évite une erreur si le header est absent.
    const token = headers && headers.split(" ")[1];

    // Si le token n'existe pas alors message "Unhautorized"
    if (!token) {
        // return est important : sans lui, le code continuerait après l'envoi de la réponse
        return res.status(401).json({ error: "Unhautorized" });
    }

    // jwt.verify contrôle 2 choses avec la clé secrète JWT_SECRET (dans .env) :
    //   - la signature n'a pas été modifiée
    //   - le token n'est pas expiré (ici, 1 h après le login)
    // decode contient ce qu'on avait mis dans jwt.sign au moment du login,
    // c'est-à-dire { user: { us_id, us_username, us_email, us_password } }
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        // Err -> mauvaise clé secrète, token expiré, token mal formé...
        if (err) {
            return res.status(403).json({ error: "Token incorrect" });
        }
        // On accroche l'utilisateur à la requête pour les controllers suivants.
        // Exemple : req.user.us_id vaut 22
        req.user = decode.user;
        // Passer à l'instruction suivante (la route demandée)
        next();
    })
}

export default checkToken;
