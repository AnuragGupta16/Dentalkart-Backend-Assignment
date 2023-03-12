//  User database contains the user details 
const mysql= require("mysql");  
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "anurag16",
    database: "user",
  });
  db.connect(function(err)
  {
    if(err)
    throw err;
    else
    {
      console.log(" MYSQl Database Connected");
    }
  })
// Student database created for storing the student_details
  const student_db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "anurag16",
    database: "student",
  });
  module.exports={db,student_db};
