import express from 'express';

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    console.log(req.rawHeaders);
})
app.get("/contact", (req, res) => {
    res.send("<h1>This is my contact</h1>")
})
app.get("/about", (req, res) => {
    res.send("Ayyo Khong Toan day ne")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})