//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from 'express';
import { dirname } from 'path'
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})
app.post("/check", (req, res) => {
    console.log(req.body);
    if (req.body["password"] === "ILoveProgramming") {
        res.sendFile(__dirname + "/public/secret.html")
    } else {
        res.sendFile(__dirname + "/public/index.html")
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})