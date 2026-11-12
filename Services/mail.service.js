import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


/*
 * createTransport = "ouvre une connexion configurée vers le serveur SMTP".
 * On le crée une seule fois au chargement du module (pas à chaque mail).
 *
 * Gmail :
 *   host smtp.gmail.com, port 587, secure: false → STARTTLS
 *   auth.user = ton Gmail
 *   auth.pass = mot de passe d'APPLICATION (pas le mdp du compte)
 *
 * Variante équivalente avec le raccourci Nodemailer :
 *   nodemailer.createTransport({
 *     service: "gmail",
 *     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
 *   })
 */
// création d'un transporteur pour envoyer des emails
const tranporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

async function welcome(receverEmail){

    const mail = await tranporter.sendMail({
        from: process.env.MAIL_FROM,
        to: receverEmail,
        subject: 'Bienvenue sur notre plateforme',
        text: `Bienvenue sur notre plateforme`,
        html: `
        <p>Bienvenue sur notre plateforme</p>
        <a href="${process.env.FRONTEND_URL}/login">Se connecter</a>
        `,
    });

    console.log("mail sent successfully");
    return mail;
}

async function resetPassword(receverEmail, resetToken) {

    /*
   * sendMail envoie un vrai message via Gmail.
   * - text : version plain texte (clients mail simples)
   * - html : version avec un vrai lien cliquable
   * resetUrl contient déjà le token, ex. :
   *   http://localhost:5173/reset-password?token=a1b2c3...
   *
   * "to" doit être l'email du user en base (celui qui a demandé le reset).
   * Tu peux t'envoyer un mail à toi-même pour tester.
   */
    const mail = await tranporter.sendMail({
        from: process.env.MAIL_FROM,
        to: receverEmail,
        subject: 'réinitialisation de votre mot de passe',
        text: `Clique ici pour réinitiliser ton mot de passe: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        html: `
        <p>Clique ici pour réinitiliser ton mot de passe: 
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Réinitialiser</a>
        </p>
        `,
    });

    console.log("mail sent successfully");
    return mail;
}

async function eventConfirm(receverEmail, eventName, eventDate, eventLocation) {

    console.log(receverEmail, eventName, eventDate, eventLocation);
    const mail = await tranporter.sendMail({
        from: process.env.MAIL_FROM,
        to: receverEmail,
        subject: 'Confirmation de votre inscription à l\'événement',
        text: `Vous êtes inscrit à l'événement ${eventName} le ${eventDate} à ${eventLocation}`,
        html: `
        <p>Vous êtes inscrit à l'événement ${eventName} le ${eventDate} à ${eventLocation}</p>
        `,
    });

    console.log("mail sent successfully");
    return mail;
}

async function rappelEvent(receverEmail, eventName, eventDate, eventLocation){
    const mail = await tranporter.sendMail({
        from: process.env.MAIL_FROM,
        to: receverEmail,
        subject: 'Rappel de votre événement',
        text: `Rappel de votre événement ${eventName} le ${eventDate} à ${eventLocation}`,
        html: `
        <p>Rappel de votre événement ${eventName} le ${eventDate} à ${eventLocation}</p>
        `,
    });
    console.log("mail sent successfully");
    return mail;
}
export default { resetPassword, welcome, eventConfirm, rappelEvent };