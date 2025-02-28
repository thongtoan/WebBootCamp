import express from "express";
import { dirname } from 'path'
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
var bandName = "";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// function bandNameGenerator (req, res, next) {
//   console.log(req.body)
//   bandName = req.body["street"] + req.body["pet"];
//   next();
// }
// app.use(bandNameGenerator);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
  //__dirname: ///Users/kta/Documents/Learning/Bootcamp - Web/3.4 Middleware
})

app.post("/submit", (req, res) => {
  bandName = req.body["street"] + req.body["pet"];
  res.send(`<h1>Your Band Name is:</h1> <h2>${bandName}</h2>`)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Your band name is:
// street + pet