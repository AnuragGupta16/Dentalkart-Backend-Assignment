const dotenv = require("dotenv");

dotenv.config();
const express = require("express");
const morgan = require("morgan");

const bodyparser = require('body-parser');
const {student_db}=require("./config/db");


const app = express();
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.static("./uploads"));

app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());


app.use("/api", require("./routes/auth"));

app.use("/", require("./routes/csvroute"));
app.get('/', (req, res) => {
 
  const q = "SELECT * FROM students";
    
  student_db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    
    var sql_data=JSON.parse(JSON.stringify(data));
  res.send(sql_data);
  });
});




// server configurations.
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {

  console.log(`server listening on port: ${PORT}`);
});
