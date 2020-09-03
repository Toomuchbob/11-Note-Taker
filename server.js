var express = require("express");
var path = require("path");
var dbFile = require("./db/db.json");
var fs = require("fs");
const { v4: uuidv4 } = require('uuid');

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const writetoDb = res => {
    fs.writeFile("./db/db.json", JSON.stringify(dbFile), err => {
        if (err) throw err;
        res.sendStatus(200);
    });
};

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.json(dbFile);
});

app.post("/api/notes", function (req, res) {
    const note = req.body;
    note.id = uuidv4();
    dbFile.push(note);
    console.log(dbFile);
    writetoDb(res);
});

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    dbFile = dbFile.filter(note => note.id !== id);
    console.log(dbFile);
    writetoDb(res);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});