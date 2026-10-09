import commentModel from '../Models/comments.model.js'

async function getAll(req, res) {
    try {
        const comments = await commentModel.getAll();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des comments !" })
    }
}
async function getById(req, res) {
    try {
        const id = req.params.id;
        const comment = await commentModel.getById(id);
        if (!comment) {
            return res.status(404).json({ error: "Le comment n'existe pas !" })
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du comment !" })
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;
        const comment = await commentModel.getById(id);
        if (!comment) {
            return res.status(404).json({ error: "Le comment n'existe pas !" })
        }

        if(body.comment){
            comment.co_comment = body.comment;
        }
        const updated = await commentModel.update(id, comment);
        res.json({ message: "Votre modification à bien été effetctué", comment });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification du comment !" })
    }
}
async function insert(req, res) {
    try {
        const body = req.body;
        if (!body.comment) {
            res.status(403).json({ error: "Le commentaire est obligatoire" })
        }
        const inserted = await commentModel.insert(body);
        res.status(201).json({ message: "Votre insertion à bien été effectué", comment: body });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l'insertion du comment !" })
    }
}
async function deleteComment(req, res) {
    try {
        const id = req.params.id;
        const comment = await commentModel.getById(id);
        if (!comment) {
            return res.status(404).json({ error: "Le comment n'existe pas !" })
        }
        const deleted = await commentModel.deleteComment(id);
        res.json({message : "Votre suppression à bien été effectué", comment});
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression du comment !" })
    }
}

export default {
    getAll,
    getById,
    update,
    insert,
    deleteComment
}