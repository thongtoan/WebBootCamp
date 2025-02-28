import express from 'express';
import axios from 'axios';

const PORT = 3000;
const app = express();
const API_URL = "https://secrets-api.appbrewery.com"

app.use(express.static("public"))

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/random")
        console.log(response);
        const data = response.data
        console.log(data)
        res.render("index.ejs", { 
            secret: data.secret,
            user: data.username,
         })
    } catch (error) {
        res.send("Error:", error.response.data)
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})