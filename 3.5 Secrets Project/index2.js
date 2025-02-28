import express from 'express';
import { dirname } from 'path'
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
let userIsAuthorised = false;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function passwordCheck (req, res, next) {
    console.log(req.body);
    let password = req.body["password"]
    if (password === "ILoveProgramming") {
        userIsAuthorised = true;
    } else {
        userIsAuthorised = false;
    }
    console.log(userIsAuthorised)
    next();
}

app.use(passwordCheck);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})
app.post("/check", (req, res) => {
    if (userIsAuthorised) {
        res.sendFile(__dirname + "/public/secret.html")
        // res.redirect("/secret")
    } else {
        // res.sendFile(__dirname + "/public/index.html")
        res.redirect("/")

    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})