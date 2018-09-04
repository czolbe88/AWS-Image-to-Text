const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const fs = require('fs');

var albumBucketName = 'photo-to-text2';
var testFilePath = "c:/users/user/desktop/preprocessors.png";

AWS.config.update({
    accessKeyId: "del",
    secretAccessKey: "del",
    region: "ap-southeast-2"
});

//NOTE: s3 and rekognition objects need to be instantiated AFTER config has been updated
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());




app.get('/list', (req, res) => {

    res.send("hello there");




})

//upload a file from local system using filepath
app.get('/test-upload', (req, res) => {

    var params = {
        Bucket: albumBucketName,
        Body: fs.createReadStream(testFilePath),
        Key: "1.jpeg"
    }

    s3.upload(params, function (err, data) {

        console.log("upload in prog");
        if (err) {
            console.log("ERROR: ", err);
        }

        if (data) {
            console.log(data.location);
        }


    })




})


app.post('/upload', upload.single('image'), (req, res) => {

    var filename = req.file.originalname;

    var params = {
        Bucket: albumBucketName,
        Body: req.file.buffer,
        Key: filename
    }


    s3.upload(params, function (err, data) {

        console.log("upload in prog");
        if (err) {
            console.log("ERROR: ", err);
        }

        if (data) {
            console.log(data.location);
            var lines = [];
            imageToText(lines);
            
        }

    })

    var paramsR = {
        Image: {
            S3Object: {
                Bucket: albumBucketName,
                Name: filename
            }
        }

    };


    function imageToText(array){

        rekognition.detectText( paramsR, function (err, data){

            if(err){
                console.log("Error: ", err);
            }
    
            if(data){
    
    
                var textDetections = data.TextDetections;
                console.log(textDetections);
                
                for (let line of textDetections){
    
                    if(line.Type == 'LINE'){
                    
                        array.push(line.DetectedText);
                    }
    
                }

    
                console.log(array);
                res.send(array);
    
    
    
                var params = {
                    Bucket: albumBucketName,
                    Key: filename
                }
                s3.deleteObject(params, function(err, data){
    
                    if(err){
                    console.log(err);
                    }
    
                    if(data){
                        console.log(data);
                    }
    
    
                })
    
    
            }
    

    
        })

    }


})





app.listen(8000, () => {
    console.log("hello there, the express server is running on port 8000 ;)");
})


