import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "300900",
  port: 5432,
});

const app = express();
const port = 3000;

db.connect();

let quiz = [];
db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
  // console.log(`Quiz list: ${quiz}`)
  console.log("Quiz list:", quiz)
    
  }
  db.end();
});
/*
1. ${quiz} trong template literals:
	•	Khi bạn sử dụng ${quiz} trong một chuỗi template (template literal), JavaScript tự động gọi phương thức .toString() trên giá trị quiz.
	•	Với một mảng như quiz, phương thức .toString() trả về chuỗi dạng danh sách các phần tử, được phân tách bởi dấu phẩy. Tuy nhiên, nếu các phần tử là đối tượng, 
  kết quả .toString() trên từng phần tử sẽ là [object Object] (đây là chuỗi mặc định cho các đối tượng trong JavaScript).

  2. quiz in trực tiếp:
	•	Khi bạn truyền quiz trực tiếp vào console.log, Node.js (hoặc trình duyệt) sẽ in cấu trúc đầy đủ của mảng, bao gồm cả các đối tượng bên trong.
	•	Đây là hành vi đặc biệt của console.log, nó cố gắng hiển thị một cách chi tiết cấu trúc dữ liệu hơn là gọi .toString().
*/

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
