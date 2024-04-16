var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: "Welcome", data: "Hello" });
});

const authApi = require("./auth.api");
router.use("/auth", authApi);

const userApi = require("./user.api");
router.use("/users", userApi);

module.exports = router;
