//////const { log } = require('console');

const express = require('express');
const FileSystem = require('fs');
const path = require("path");
const multer = require('multer');
const bodyParser = require('body-parser');

const upload = multer({ dest: 'uploads/' });

const rootDirectoryPath = path.join(__dirname, '../drive');
const uploadFolderPath = path.join(__dirname, '../', '/uploads');

const app = express();

app.set("view engine", "ejs");

app.listen(80);

app.use(bodyParser.urlencoded({ extended: true }));
//console.log(path.join(__dirname, "../public"));
app.use(express.static(path.join(__dirname, "../public")));

let posts;
let fileList = [];
let directoryList = [];
let DirectoryFilesList = [];

let currentDirectory = rootDirectoryPath;

app.get("*", function(req, res) {

    // console.log(req.url);
    if (req.url == "/") {
        currentDirectory = rootDirectoryPath;
    } else {
        if (FileSystem.existsSync(path.join(rootDirectoryPath, req.url))) {
            currentDirectory = path.join(rootDirectoryPath, req.url);
        }
    }

    // console.log(currentDirectory);
    if (FileSystem.lstatSync(currentDirectory).isFile()) {
        res.download(currentDirectory);

        currentDirectory = path.join(currentDirectory, "../");
    } else {
        getDirectoryFilesList(currentDirectory);
        res.render("index", {
            directoryList,
            fileList,
        });
    }
})

app.post("*", upload.single("file"), function(req, res) { //need
    const { file } = req;
    // console.log(req.url);
    if (req.url == "/Upload") {
        replaceFile(file.originalname, file.filename, currentDirectory);
        res.redirect('back');
    } else {
        if (req.url == "/AddFile") {
            // console.log(req.body);
            if (FileSystem.existsSync(path.join(currentDirectory, "/", req.body.NameOfFile)) == false) {
                FileSystem.mkdirSync(path.join(currentDirectory, "/", req.body.NameOfFile));
            }
            res.redirect('back');
        }
    }

});

function CalculateResault() {
    posts = "sdsds";
}

function replaceFile(originfilename, fileName, destination) {
    FileSystem.renameSync(path.join(uploadFolderPath, "/", fileName),
        path.join(destination, "/", originfilename));
}

function createDirectory(currentDirectory, folderName) {

}

function getDirectoryFilesList(currentDirectory) {
    directoryList = [];
    fileList = [];

    DirectoryFilesList = FileSystem.readdirSync(currentDirectory);

    let currentFilePath;
    let length = rootDirectoryPath.length;

    DirectoryFilesList.forEach(function(fileName) {
        currentFilePath = path.join(currentDirectory, "/", fileName);
        if (FileSystem.lstatSync(currentFilePath).isDirectory() == true) {

            directoryList.push({ name: fileName, path: currentFilePath.substr(length) });

        } else {
            fileList.push({ name: fileName, path: currentFilePath.substr(length) });
        }
    })
}