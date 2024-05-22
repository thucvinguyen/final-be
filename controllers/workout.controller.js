const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Workout = require("../models/Workout");

const workoutController = {};

workoutController.getWorkouts = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const queryObj = {};
  if (req.query.name)
    queryObj.name = { $regex: new RegExp(req.query.name, "i") };
  if (req.query.part) queryObj.part = req.query.part;
  if (req.query.equipment) queryObj.equipment = req.query.equipment;
  if (req.query.level) queryObj.level = req.query.level;

  const workouts = await Workout.find(queryObj).skip(skip).limit(limit);

  const total = await Workout.countDocuments(queryObj);

  const totalPages = Math.ceil(total / limit);

  return sendResponse(
    res,
    200,
    true,
    { page, workouts, totalPages, total },
    null,
    "Get Workouts Successfully"
  );
});

module.exports = workoutController;
