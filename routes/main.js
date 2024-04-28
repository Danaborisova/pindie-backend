const mainRoute = require("express").Router();
const fs = require("fs").promises;

mainRoute.get("/", (req, res) => {
  fs.readFile("/index.html", "utf-8").then((data) => {
    res.header("Content-type", "text/html").send(data);
  });
});

module.exports = mainRoute; 