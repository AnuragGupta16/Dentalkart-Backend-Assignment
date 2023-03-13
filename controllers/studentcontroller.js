
const {student_db}=require("../config/db");


const student_details=(req, res) => {
 
    const q = "SELECT * FROM students";
      
    student_db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      
      var sql_data=JSON.parse(JSON.stringify(data));
    res.send(sql_data);
    });
  };
  module.exports=student_details;
