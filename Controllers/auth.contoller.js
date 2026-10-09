import userModel from '../Models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

async function register(req, res) {
    try {
        const body = req.body;
        
        if (!body.username || !body.password || !body.email) {
            return res.status(403).json({ error: "Tout les champs sont obligatoires !" })
        }
        body.password = bcrypt.hashSync(body.password, 10);
        const registered = await userModel.insert(body);
        res.status(201).json({ message: "Vous êtes bien inscrit", registered })
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l'inscription !" })
    }
}

async function login(req, res) {
    try {
        const body = req.body;
        if (!body.username || !body.password) {
            res.status(403).json({ error: "Identifiants incorrect" });
        }

        const user = await userModel.getByUsername(body.username);

        if(!user){
            res.status(403).json({ error: "Identifiants incorrect" });
        }

        const passwordVerify = bcrypt.compareSync(body.password, user.us_password);

        if (!passwordVerify) {
            res.status(403).json({ error: "Identifiants incorrect" });
        }

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