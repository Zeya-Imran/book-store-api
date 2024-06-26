import express from "express";
import globalErrorHandler from "./middlewares/globalErrorhandler";
import userRouter from "./users/userRouter";
import bookRouter from "./book/bookRouter";
var bodyParser = require("body-parser");

const app = express();

//middlewares (receiving form data and parse)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome in Elib" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//global error handling
app.use(globalErrorHandler);

export default app;
