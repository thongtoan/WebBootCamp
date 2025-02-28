import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

const recipeJSON =
  '[{"id": "0001","type": "taco","name": "Chicken Taco","price": 2.99,"ingredients": {"protein": {"name": "Chicken","preparation": "Grilled"},  "salsa": {"name": "Tomato Salsa","spiciness": "Medium"},  "toppings": [{"name": "Lettuce",  "quantity": "1 cup",  "ingredients": ["Iceberg Lettuce"]  },      {"name": "Cheese",  "quantity": "1/2 cup",  "ingredients": ["Cheddar Cheese", "Monterey Jack Cheese"]  },      {"name": "Guacamole",  "quantity": "2 tablespoons",  "ingredients": ["Avocado", "Lime Juice", "Salt", "Onion", "Cilantro"]  },      {"name": "Sour Cream",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream"]  }      ]    }  },{"id": "0002","type": "taco","name": "Beef Taco","price": 3.49,"ingredients": {"protein": {"name": "Beef","preparation": "Seasoned and Grilled"},  "salsa": {"name": "Salsa Verde","spiciness": "Hot"},  "toppings": [{"name": "Onions",  "quantity": "1/4 cup",  "ingredients": ["White Onion", "Red Onion"]  },      {"name": "Cilantro",  "quantity": "2 tablespoons",  "ingredients": ["Fresh Cilantro"]  },      {"name": "Queso Fresco",  "quantity": "1/4 cup",  "ingredients": ["Queso Fresco"]  }      ]    }  },{"id": "0003","type": "taco","name": "Fish Taco","price": 4.99,"ingredients": {"protein": {"name": "Fish","preparation": "Battered and Fried"},  "salsa": {"name": "Chipotle Mayo","spiciness": "Mild"},  "toppings": [{"name": "Cabbage Slaw",  "quantity": "1 cup",  "ingredients": [    "Shredded Cabbage",    "Carrot",    "Mayonnaise",    "Lime Juice",    "Salt"          ]  },      {"name": "Pico de Gallo",  "quantity": "1/2 cup",  "ingredients": ["Tomato", "Onion", "Cilantro", "Lime Juice", "Salt"]  },      {"name": "Lime Crema",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream", "Lime Juice", "Salt"]  }      ]    }  }]';

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let data;
/*Trong đoạn code của bạn, phần res.render("solution.ejs", {recipe: data})
 không thể tự động biết và lấy dữ liệu data từ app.post trước đó trừ khi có một cơ chế lưu trữ dữ liệu giữa các request, 
 chẳng hạn như:
	1.	Query String: Gửi dữ liệu qua URL từ app.post và đọc trong app.get.
	2.	Session: Lưu dữ liệu data vào session trên server trong app.post và lấy lại trong app.get.
	3.	Global Variable: Sử dụng biến toàn cục để lưu data (nhưng đây là cách không nên làm trong các ứng dụng thực tế). 
*/

app.get("/", (req, res) => {
  res.render("solution.ejs", {recipe : data});
});

app.post("/recipe", (req, res) => {
  switch (req.body.choice) {
    case "chicken":
      data = JSON.parse(recipeJSON)[0];
      console.log(`Data 0: ${data}`);
      break;
    case "beef":
      data = JSON.parse(recipeJSON)[1];
      console.log(`Data 1: ${data}`);
      break;
    case "fish":
      data = JSON.parse(recipeJSON)[2];
      console.log(`Data 2: ${data}`);
      break;
    default:
      break;
  }
  res.redirect("/");
  
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
