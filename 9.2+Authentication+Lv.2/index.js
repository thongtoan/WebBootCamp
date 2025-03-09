import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;
const saltRounds = 10;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "300900",
  port: 5432,
});
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
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      // Password Hashing
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          res.send("Error hashing password")
        } else {
          console.log("Hashed Password:", hash);
          const result = await db.query("INSERT INTO secrets (user, password) VALUE ($1, $2)", [email, hash]);
          res.render("secrets.ejs");
        }
      });
    } 
    } catch (err) {
      console.log(err);
    }
});

// app.post("/login", async (req, res) => {
//   const email = req.body.username;
//   const loginPassword = req.body.password;
//   const result = await db.query("SELECT password FROM users WHERE email = $1", [email])
//   const storedHashedPassword = result.rows[0].password;
//   if (storedHashedPassword.length === 0) {
//     res.send("Account does not exist. Please register!")
//   } else {
//     bcrypt.compare(loginPassword, storedHashedPassword, async (err, result) => {
//       if (err) {
//         res.send("Error compare passwords:", err)
//       } else if (result) {
//         res.render("secrets.ejs")
//       } else {
//         res.send("Password is not correct")
//       }
//     })
//   }
// })

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;
  console.log("email", email);
  console.log("password", loginPassword);
  try {
  const result = await db.query("SELECT password FROM users WHERE email = $1", [email])
  // const storedHashedPassword = result.rows[0].password;
  if (result.rows.length === 0) {
    res.send("Account does not exist. Please register!")
  } else {
    const user = result.rows[0];
    const storedHashedPassword = user.password;
  console.log("storedHashedPassword", storedHashedPassword);

    const isMatch = bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
      // console.log("isMatch", isMatch);
  console.log("result", result);

      if (err) {
        res.send(err)
        // res.send chỉ nhận một params
      } else if (result) {
        res.render("secrets.ejs")
      } else {
        res.send("Password is not correct")
      }
    })
  }
  } catch (err) {
  console.log(err);
  }
})



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
