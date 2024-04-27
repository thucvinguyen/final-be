const express = require("express");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const feedbackController = require("../controllers/feedback.controller");

// @route POST/feedbacks
// @description Create new feedback
// @body rating, feedback
// @login required

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    // body("rating", "Rating must be between 1 and 5").isInt({ min: 1, max: 5 }),
    body("message", "Message is required").notEmpty(),
  ]),
  feedbackController.createFeedback
);

// @route GET /feedbacks
// @description Get all feedbacks
// @access Log in required
// router.get(
//   "/",
//   authentication.loginRequired,
//   validators.validate([]),
//   feedbackController.getFeedbacks
// );

module.exports = router;
