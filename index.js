const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
var HTMLParser = require('node-html-parser');
var cors = require('cors');
var app = require('express')();
var fs = require('fs');
app.use(cors());
app.use(fileUpload());

app.get("/", (req, response) => {
    response.send("Please Upload Somthing")
});

app.get("/author", (req, response) => {
    fetch("https://jobinja.ir/user/MV-7526766").then(res => res.text()).then(res => {
        response.send(res);
    });
});


function SaveCSV(data,htmltags) {
    var root = HTMLParser.parse(data);
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: __dirname + '/csv/upload.csv',
        header: ['tagName', 'rawText']
    });
    root.querySelector("body").childNodes.forEach((item, index) => {
        if (item.tagName) {
            htmltags.push({
                tagName: item.tagName,
                rawText: item.rawText
            });
        }
    })

    csvWriter.writeRecords(htmltags)
        .then(() => {});
}

// Upload file and handle it by express-uploadfile
app.post('/upload', function (req, res) {
    var htmltags = [];
    req.files.file.mv(__dirname + '/uploads/upload.html', function (err) {
        fs.readFile(__dirname + '/uploads/upload.html', 'utf8', function (err, data) {
            SaveCSV(data,htmltags);
            res.send(JSON.stringify(htmltags));
        });
    });








});


app.listen(2000, () => {
    console.log("Html Parser Server Is Running On Port:2000")
});