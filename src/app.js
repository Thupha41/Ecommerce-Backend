import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//init db
import "./databases/init.mongodb.js";
//init router

app.get("/", (req, res) => {
  const str = "Hello";
  return res.status(200).json({
    message: "Welcome",
    metadata: str.repeat(1000),
  });
});
//handle error
export default app;
