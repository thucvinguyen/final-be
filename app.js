require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const { sendResponse, AppError } = require("./helpers/utils");
// const session = require("express-session");
// const passport = require("./middlewares/passport");
const indexRouter = require("./routes/index");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Passport set up
// app.use(
//   session({
//     secret: "your_secret_key",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// Mount authentication routes
// app.use("/api", authRouter); // Adjust the path as needed

app.use("/api", indexRouter);

/* DB connection*/
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log(`DB connected ${mongoURI}`))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});

module.exports = app;
