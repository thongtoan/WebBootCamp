import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "190392",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = result.rows.map((row) => row.country_code);
  return countries;
}

// GET HOME PAGE
app.get("/", async (req, res) => {
  const countries = await checkVisited();
  res.render("index.ejs", { 
    countries: countries,
    total: countries.length,
    color: "teal"
   })
})

// ADD country
app.post("/add", async (req, res) => {
  const country = req.body.country;
  try {
    const result = await db.query("SELECT country_code FROM countries WHERE country_name = $1", [country])
    if (result.rows.length === 0) {
      const countries = await checkVisited();
      res.render("index.ejs", { 
        countries: countries,
        total: countries.length,
        color: "teal",
        error: "Country name does not correct, try again."
       })
    }
    const countryCode = result.rows[0].country_code;
    try {
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode])
      res.redirect("/")
    } catch (err) {
      if (err.code === '23505') {
        const countries = await checkVisited();
        res.render("index.ejs", { 
          countries: countries,
          total: countries.length,
          color: "teal",
          error: "Country has already been added, try again."
         })
      }
      throw err;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    const countries = checkVisited();
    res.render("index.ejs", { 
      countries: countries,
          total: countries.length,
          color: "teal",
          error: "An unexpected error occurred, please try again."
     })
  }
})


app.post("/user", async (req, res) => {
  const input = req.body.user;
  const user = await db.query("SELECT * FROM users WHERE users.id === $1", [input]);
  console.log(user);


  res.render("index.ejs", { 
    user.id,
    user.name,
    user.color
   })
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

