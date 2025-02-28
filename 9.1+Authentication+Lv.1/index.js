import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  username: 'postgres',
  host: 'localhost',
  database: 'secrets',
  password: '190392',
  port: 5432
})
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkEmail = await db.query("SELECT email FROM users WHERE email = &1", [email])
    if (checkEmail.rows.length !== 0) {
      res.send("Email already exists")
    } else {
      const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]);
    }
    console.log(result);
    res.render("secrets.ejs");
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  try {
    const checkEmail = await db.query("SELECT email FROM users WHERE email = $1", [email]);
    if (checkEmail.rows.length > 0) {
      const checkPassword = await db.query("SELECT password FROM users WHERE  email = $1", [email]);
      if (checkPassword.rows[0].password === password) {
        res.render("secrets.ejs")
      } else {
        res.send("Password is not correct. Please try again.")
      }
    } else {
      res.send("Accout does not exist. Please register first.")
    }
  } catch (err) {
    console.error(err)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
