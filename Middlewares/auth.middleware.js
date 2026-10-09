import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

function checkToken(req, res, next) {
    const headers = req.headers["authorization"];
    const token = headers && headers.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unhautorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            return res.status(403).json({ error: "Token incorrect" });
        }
        next();
    })
}

export default checkToken;