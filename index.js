import express from 'express'
import dotenv from 'dotenv'
dotenv.configDotenv();
const app = express();

app.use(express.json());


app.use('/', (req, res) => {
    res.json({message : "Hello world !"});
});

app.listen(process.env.PORT_APPLICATION, () => {
    console.log("http://127.0.0.1:"+process.env.PORT_APPLICATION);
});