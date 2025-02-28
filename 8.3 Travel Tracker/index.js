import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

// Connect to database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "190392",
  port: 5432
})

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err.stack)
  } else {
    console.log("Connected to the database")
  }
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries")
  let countries = [];
  countries = result.rows.map((row) => row.country_code);
  console.log("Countries:", countries)
  return countries;

  // result => alot console.log(result.rows); [{country_code: 'VN'}, {country_code: 'US'}]
  // console.log(countries); [VN, US]
}

// GET HOME PAGE
app.get("/", async (req, res) => {
  const countries = await checkVisited();
  // await checkVisited() ??
  res.render("index.ejs", { countries: countries, total: countries.length })
})

// INSERT NEW COUNTRY
// input wrong country_name -> Country name does not exist, try again.
// second add same country_name => Country has already been added, try again.
app.post("/add", async (req, res) => {
    const input = req.body.country; // req.body: { country: 'Viet Nam' }
  try {
    const result = await db.query("SELECT country_code FROM countries WHERE country_name = $1", [input]);
  
    if (result.rows.length === 0) {
      const countries = await checkVisited();
      res.render("index.ejs", { 
        countries: countries, 
        total: countries.length,
        error: "Country name does not exist, try again."
      })
    } 
    const countryCode = result.rows[0].country_code;
    // Dùng if để so sánh countryCode với 1 column trong data
    // trả về đã tồn tại
    try {
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode])
      res.redirect("/")
    } catch (err) {
      if (err.code === '23505') {
        // Lỗi unique
        const countries = await checkVisited();
        res.render("index.ejs", { 
          countries: countries,
          total: countries.length,
          error: "Country has already been added, try again."
         })
      }
      throw err; // If not unique error
    } 
  } catch (err) {
    console.error("Unexpected error:", err);
    const countries = checkVisited();
    res.render("index.ejs", { 
      countries: countries,
      total: countries.length,
      error: "An unexpected error occurred, please try again."
     })
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
