const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

const feedbackController = {};

feedbackController.createFeedback = catchAsync(async (req, res) => {
  const currentUserId = req.userId;
  let { message, rating } = req.body;

  let feedback = await Feedback.create({
    message,
    rating,
    isDeleted: false,
    user: currentUserId,
  });

  feedback = await feedback.populate("user");

  return sendResponse(
    res,
    200,
    true,
    feedback,
    null,
    "Create Feedback Successfully"
  );
});

module.exports = feedbackController;
