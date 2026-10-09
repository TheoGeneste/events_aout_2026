import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './Routes/auth.route.js'
import checkToken from './Middlewares/auth.middleware.js';
import eventRoutes from './Routes/events.route.js'
import userRoutes from './Routes/users.route.js'
import commentRoutes from './Routes/comments.route.js'
import participantRoutes from './Routes/participants.route.js'

dotenv.configDotenv();
const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", checkToken, eventRoutes)
app.use("/users", checkToken, userRoutes)
app.use("/participants", checkToken, participantRoutes)
app.use("/comments", checkToken, commentRoutes)


app.use('/', (req, res) => {
    res.json({status : "Ok"});
});

app.listen(process.env.SERVER_PORT, () => {
    console.log("http://127.0.0.1:"+process.env.SERVER_PORT);
});