
const {student_db}=require("../config/db");
var data_exporter = require('json2csv').Parser;
const multer = require('multer');
const csv = require('fast-csv');

const fs = require('fs');
const path = require('path');


const download_csv=(req,res)=>{
    const q = "SELECT * FROM students";
    student_db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      // console.log(data);
      var sql_data=JSON.parse(JSON.stringify(data));
    //   console.log(sql_data);
      // console.log(data[0].name);
    //   return res.json(data);
  

      var file_header = ['Name', 'Roll_no', 'Address','Institute','Course','Email'];

      var json_data = new data_exporter({file_header});

      var csv_data = json_data.parse(sql_data);
    //   console.log(csv_data);

      res.setHeader("Content-Type", "text/csv");

      res.setHeader("Content-Disposition", "attachment; filename=sample_data.csv");

      res.status(200).send(csv_data);

    });
};



const upload_csv=(req,res)=>{

    console.log(req.file.path);
    uploadCsv( './uploads/' + req.file.filename);
    res.send("CSV File Uploaded Successfully");
};


function uploadCsv(uriFile){
    let stream = fs.createReadStream(uriFile);
    let csvDataColl = [];
    let fileStream = csv
        .parse()
        .on("data", function (data) {
            // console.log(data)
            csvDataColl.push(data);
        })
        .on("end", function () {
            csvDataColl.shift();
            
            console.log(csvDataColl.length);
            for(let i=0;i<csvDataColl.length;i++)
            {
                let name=csvDataColl[i][0];
                let roll_no=csvDataColl[i][1];
                let address=csvDataColl[i][2];
               let institute=csvDataColl[i][3];
               let course=csvDataColl[i][4];
               let email=csvDataColl[i][5];
          
            let query1 = `INSERT INTO students (name,roll_no,address,institute,course,email) SELECT  "${name}","${roll_no}","${address}","${institute}","${course}","${email}" WHERE NOT EXISTS (SELECT * FROM students WHERE  roll_no="${roll_no}")` ;
            
                    student_db.query(query1, (error, res) => {
                        console.log(error || res);
                    });  
                }  
                    console.log(uriFile);         
                    //  fs.unlinkSync(uriFile);
            
            });
            stream.pipe(fileStream);
            
        }

module.exports={download_csv,upload_csv};