const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const main = require("./app");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

app.use("/api", main); 

app.listen(8080, () => console.log("listening to port: 8080"));
