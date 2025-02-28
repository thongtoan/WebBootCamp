import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
// Express 4.16 > body parser đã được tích hợp vào trong express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
  console.log(`This is req: ${req}`)
});

app.post("/submit", (req, res) => {
  console.log(req.body);
  // console.log(req);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
