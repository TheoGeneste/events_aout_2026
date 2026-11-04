/*
 * Routes/auth.route.js — URLs publiques d'authentification
 * ---------------------------------------------------------
 * Un Router Express est un mini-groupe de routes.
 * Dans index.js il est branché sur "/auth", donc les chemins ici
 * se collent après ce préfixe :
 *
 *   router.post('/register', ...)  →  POST /auth/register
 *   router.post('/login', ...)     →  POST /auth/login
 *
 * Ces deux routes ne passent PAS par checkToken :
 * on ne possède pas encore de token au moment de s'inscrire ou de se connecter.
 *
 * Le verbe HTTP compte :
 *   POST sert à envoyer des données (le JSON du formulaire).
 *   Un GET /auth/login ne matcherait aucune ligne ci-dessous.
 */

// "e" est simplement Express. On aurait pu écrire : import express from "express"
import e from "express";
import authController from '../Controllers/auth.contoller.js'

// Crée un routeur vide, puis on y ajoute les routes une par une.
const router = e.Router();

// Quand une requête POST arrive sur /register, Express appelle authController.register
router.post('/register', authController.register);

router.post('/login', authController.login);

// index.js importe ce router : import authRoutes from './Routes/auth.route.js'
export default router;
