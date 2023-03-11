const router = require("express").Router();
const {db}=require("../config/db");
const {student_db}=require("../config/db");
var data_exporter = require('json2csv').Parser;
const multer = require('multer');
const csv = require('fast-csv');
const auth = require("../middlewares/auth");
const fs = require('fs');
const path = require('path')



router.get("/download_csv_file",auth, (req,res)=>{
    const q = "SELECT * FROM students";
    db.query(q, (err, data) => {
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
}
);
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './routes/uploads')    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
});
router.post("/upload_csv_file",auth,upload.single('file'),(req,res)=>{

    console.log(req.file.path);
    uploadCsv(__dirname + '/uploads/' + req.file.filename);
    res.send("CSV File Uploaded Successfully");
});
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
          
            let query1 = `INSERT INTO students (name,roll_no,address,institute,course,email) SELECT  "${name}","${roll_no}","${address}","${institute}","${course}","${email}" WHERE NOT EXISTS (SELECT * FROM students WHERE name="${name}" AND roll_no="${roll_no}" AND address="${address}" AND institute="${institute}" AND course="${course}" AND email="${email}")` ;
            
                    student_db.query(query1, (error, res) => {
                        console.log(error || res);
                    });  
                }  
                    console.log(uriFile);         
                     fs.unlinkSync(uriFile);
            
            });
            stream.pipe(fileStream);
            
        }

module.exports=router;
