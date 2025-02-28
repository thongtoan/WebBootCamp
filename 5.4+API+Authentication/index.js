import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "khongtoan";
const yourPassword = "humanbeing";
const yourAPIKey = "db0746cd-8753-47b6-9d80-bb3fdf93c8a5";
const yourBearerToken = "276d013d-bbef-4b94-b02a-10927ed49565";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  try {
    const response = await axios.get("https://secrets-api.appbrewery.com/random");
    // console.log(response);
    const result = response.data;
    // console.log(response.data);
    res.render("index.ejs", { content: JSON.stringify(result)})
    console.log(`${API_URL}all?page=2`)
  } catch (error) {
    console.error("Failed to make requeset:", error.message);
    res.render("index.ejs", {
      error: error.message,
    })
  }
});

app.get("/basicAuth", async (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint

  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  try {
    const response = await axios.get(API_URL + "/all?page=2", {
      auth: {
        username: yourUsername,
        password: yourPassword,
      },
    });
    const result = response.data;
    res.render("index.ejs", { content: JSON.stringify(result) });
  } catch (error) {
    res.status(404).send(error.message);
    }
  })

  


app.get("/apiKey", async (req, res) => {
  
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  try {
    
    const response = await axios.get(`${API_URL}filter`, {
      params: {
        score: 5,
        apiKey: yourAPIKey,
      }
    })
    const data = response.data;
    res.render("index.ejs", { content: JSON.stringify(data) })
  } catch (error) {
    console.error("Fail to make request:", error.message);
    res.render("index.ejs", { 
      error: error.message
     })
  }
});

app.get("/bearerToken", async (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
  try {
    const response = await axios.get(`${API_URL}secrets/2`, {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`
      }
    })
    const data = response.data;
    res.render("index.ejs", { content: JSON.stringify(data) })
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { error: error.message })
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
