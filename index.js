/*
 * index.js — point d'entrée du serveur
 * --------------------------------------
 * C'est le fichier qui démarre l'application.
 * On y crée le serveur Express, on branche les routes,
 * et on écoute les requêtes HTTP (comme un site web, mais pour une API).
 *
 * Organisation du projet (modèle MVC simplifié) :
 *   Routes      → quelle URL appelle quelle fonction
 *   Controllers → la logique métier (vérifier, répondre)
 *   Models      → les requêtes SQL vers MySQL
 *   Middlewares → des contrôles qui s'exécutent AVANT le controller
 *   Config      → la connexion à la base de données
 *
 * Exemple de requête :
 *   POST http://127.0.0.1:3000/auth/login
 *   body JSON : { "username": "toto", "password": "secret" }
 */

// Express : bibliothèque qui crée un serveur web en Node.js
import express from 'express'
// dotenv : lit le fichier .env (port, mot de passe MySQL, clé secrète JWT...)
import dotenv from 'dotenv'
// cors : autorise un site web (le front) à appeler cette API depuis un autre domaine
import cors from 'cors'
import authRoutes from './Routes/auth.route.js'
// checkToken : middleware qui refuse la requête si le JWT est absent ou invalide
import checkToken from './Middlewares/auth.middleware.js';
import eventRoutes from './Routes/events.route.js'
import userRoutes from './Routes/users.route.js'
import commentRoutes from './Routes/comments.route.js'
import participantRoutes from './Routes/participants.route.js'
import cronService from './Services/cron.service.js'

cronService.testCron();
console.log("Cron started");

// Charge les variables du fichier .env dans process.env
// Exemple dans .env : SERVER_PORT=3000
dotenv.configDotenv();

// "app" est notre serveur. Toutes les routes seront enregistrées dessus.
const app = express();

// Sans cette ligne, req.body serait vide.
// Elle transforme le JSON envoyé par le client en objet JavaScript.
// Exemple reçu : { "title": "Soirée" }  →  accessible via req.body.title
app.use(express.json());

// Autoriser la connexion de mon front à mon back.
// Sans CORS, le navigateur bloque les appels entre deux origines différentes
// (par exemple front sur localhost:5173 et API sur localhost:3000).
app.use(cors());

/*
 * Montage des routes.
 * app.use("/auth", authRoutes) signifie :
 *   une requête vers /auth/login est gérée par auth.route.js
 *
 * checkToken est placé ENTRE le préfixe et les routes :
 *   app.use("/events", checkToken, eventRoutes)
 * Donc /events/... exige un token. /auth/... n'en exige pas
 * (sinon on ne pourrait jamais s'inscrire ni se connecter).
 *
 * Exemple de header attendu sur les routes protégées :
 *   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
app.use("/auth", authRoutes);
app.use("/events", checkToken, eventRoutes)
app.use("/users", checkToken, userRoutes)
app.use("/participants", checkToken, participantRoutes)
app.use("/comments", checkToken, commentRoutes)

// Route de test : GET http://127.0.0.1:PORT/  →  { "status": "Ok" }
// Utile pour vérifier que le serveur tourne.
app.use('/', (req, res) => {
    res.json({status : "Ok"});
});

// Démarre le serveur sur le port défini dans .env (SERVER_PORT).
// Le callback s'exécute une fois que le serveur écoute vraiment.
app.listen(process.env.SERVER_PORT, () => {
    console.log("http://127.0.0.1:"+process.env.SERVER_PORT);
});
