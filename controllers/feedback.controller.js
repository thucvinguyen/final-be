const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

const feedbackController = {};

feedbackController.createFeedback = catchAsync(async (req, res) => {
  const currentUserId = req.userId;
  let { message } = req.body;

  let feedback = await Feedback.create({
    message,
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
