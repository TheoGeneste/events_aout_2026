/*
 * Routes/users.route.js — URLs des utilisateurs
 * ----------------------------------------------
 * Branché dans index.js sur "/users", APRÈS checkToken.
 * Donc chaque route ci-dessous exige un JWT valide.
 *
 * Tableau des URLs finales :
 *   GET    /users                  liste
 *   GET    /users/me               profil de la personne connectée
 *   GET    /users/:id              un utilisateur, ex. /users/4
 *   PATCH  /users/resetPassword    changer son mot de passe
 *   PATCH  /users/:id              modifier un utilisateur
 *   POST   /users                  en créer un
 *   DELETE /users/:id              le supprimer
 *
 * Ordre important :
 *   "/me" et "/resetPassword" sont déclarés AVANT "/:id".
 *   Express prend la première route qui correspond.
 *   Si "/:id" était en premier, une requête vers /users/me
 *   serait lue comme "l'utilisateur dont l'id vaut le texte me".
 *
 * ":id" est un paramètre : n'importe quelle valeur prend sa place.
 *   /users/12  →  req.params.id === "12"
 */

import e from "express";
import userController from '../Controllers/users.controller.js'

const router = e.Router();

router.get("/", userController.getAll);

// Route fixe : le mot "me" n'est pas un id numérique
router.get("/me", userController.getMe);

// Route dynamique : :id capture ce qui suit /users/
router.get("/:id", userController.getById);

// Route fixe, à garder avant PATCH /:id pour la même raison que /me
router.patch("/resetPassword", userController.resetPassword);

router.patch("/:id", userController.update);

router.post("/", userController.insert);

router.delete("/:id", userController.deleteUser);

export default router;
