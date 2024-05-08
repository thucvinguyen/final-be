const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Exercise = require("../models/Exercise");
const User = require("../models/User");

const exerciseController = {};

const calculateExerciseCount = async (userId) => {
  const exerciseCount = await Exercise.countDocuments({
    user: userId,
    isDeleted: false,
  });
  await User.findByIdAndUpdate(userId, { exerciseCount });
};

// Function to create a new exercise
exerciseController.createExercise = catchAsync(async (req, res) => {
  const currentUserId = req.userId;
  const { name, sets, reps, date } = req.body;

  const caloriesBurned = 30 * reps * sets;

  let exercise = await Exercise.create({
    name,
    sets,
    reps,
    date,
    caloriesBurned,
    isDeleted: false,
    user: currentUserId,
  });

  exercise = await exercise.populate("user");

  const user = await User.findById(currentUserId);

  user.exercise.push(exercise._id);

  await user.save();

  return sendResponse(
    res,
    200,
    true,
    exercise,
    null,
    "Create Exercise Successfully"
  );
});

exerciseController.getExercises = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  let { page, limit } = { ...req.query };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, "User not found", "Get Exercises Error");
  }

  const filterCriteria = {
    user: userId,
    isDeleted: false,
  };

  const count = await Exercise.countDocuments(filterCriteria);

  const totalPages = Math.ceil(count / limit);

  const offset = limit * (page - 1);

  let exercises = await Exercise.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("user");

  return sendResponse(
    res,
    200,
    true,
    { exercises, totalPages, count },
    null,
    "Get Exercises Successfully"
  );
});

exerciseController.updateSingleExercise = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const exerciseId = req.params.id;
  let exercise = await Exercise.findById(exerciseId);
  if (!exercise)
    throw new AppError(400, "Exercise not found", "Update Exercise Error");
  if (!exercise.user.equals(currentUserId))
    throw new AppError(
      400,
      "Only author can edit exercise",
      "Update Exercise Error"
    );

  const allows = ["name", "sets", "reps", "date"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      exercise[field] = req.body[field];
    }
  });

  exercise.caloriesBurned = 30 * exercise.reps * exercise.sets;

  await exercise.save();
  return sendResponse(
    res,
    200,
    true,
    exercise,
    null,
    "Update Exercise Successfully"
  );
});

exerciseController.deleteSingleExercise = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const exerciseId = req.params.id;

  const exercise = await Exercise.findOneAndUpdate(
    { _id: exerciseId, user: currentUserId },
    { isDeleted: true },
    { new: true }
  );

  if (!exercise)
    throw new AppError(
      400,
      "Exercise not found or user not authorized",
      "Delete exercise Error"
    );
  await calculateExerciseCount(currentUserId);

  return sendResponse(
    res,
    200,
    true,
    exercise,
    null,
    "Delete Exercise Successfully"
  );
});

module.exports = exerciseController;
