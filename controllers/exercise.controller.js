const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Exercise = require("../models/Exercise");

const exerciseController = {};

exerciseController.getExercises = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const exercises = await Exercise.find().skip(skip).limit(limit);

  const total = await Exercise.countDocuments();

  const totalPages = Math.ceil(total / limit);

  sendResponse(
    res,
    200,
    true,
    { exercises, page, total, totalPages },
    null,
    "List of exercises"
  );
});

module.exports = exerciseController;
