const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");

const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
//init db
//init router

app.get("/", (req, res) => {
  const str = "Hello";
  return res.status(200).json({
    message: "Welcome",
    metadata: str.repeat(1000),
  });
});
//handle error
module.exports = app;
