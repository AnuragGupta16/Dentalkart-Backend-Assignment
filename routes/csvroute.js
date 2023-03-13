const router = require("express").Router();
const {db}=require("../config/db");
const {student_db}=require("../config/db");
var data_exporter = require('json2csv').Parser;
const multer = require('multer');
const csv = require('fast-csv');
const auth = require("../middlewares/auth");
const fs = require('fs');
const path = require('path');

const student_details =require("../controllers/studentcontroller");
const {upload_csv,download_csv}=require("../controllers/CSVcontroller");


router.get("/", auth,student_details);




router.get("/download_csv_file",auth,download_csv);

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
});

router.post("/upload_csv_file",auth,upload.single('file'),upload_csv);

module.exports=router;
