const User = require("../models/User");
const Meal = require("../models/Meal");
const Exercise = require("../models/Exercise");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const bcrypt = require("bcryptjs");

const userController = {};

userController.register = catchAsync(async (req, res) => {
  let { name, email, password, gender, goal, height, weight } = req.body;
  let user = await User.findOne({ email });
  if (user)
    throw new AppError(400, "User already existed", "Registration Error");
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    password,
    gender,
    goal,
    height,
    weight,
    isDeleted: false,
    meal: [],
    exercise: [],
  });

  const accessToken = await user.generateToken();
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User Successfully"
  );
});

userController.getUsers = catchAsync(async (req, res) => {
  const currentUserId = req.userId;
  let { page, limit, ...filter } = { ...req.query };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }];
  if (filter.name) {
    filterConditions.push({
      name: { $regex: filter.name, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("meal")
    .populate("exercise");

  return sendResponse(
    res,
    200,
    true,
    { users, totalPages, count },
    null,
    "Get Users Successfully"
  );
});

userController.getCurrentUser = catchAsync(async (req, res) => {
  const currentUserId = req.userId;
  // Exclude 'meal' and 'exercise' fields from the user object
  const user = await User.findById(currentUserId).select("-meal -exercise");

  if (!user)
    throw new AppError(400, "User not found", "Get Current User Error");

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Current User Successfully"
  );
});

userController.getCurrentUserDetails = catchAsync(async (req, res) => {
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId)
    .populate("meal")
    .populate("exercise");
  if (!user)
    throw new AppError(400, "User not found", "Get Current User Error");
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Full Current User Details Successfully"
  );
});

// filter exercises and meals that isDeleted is false only, then update the user

userController.getSingleUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const filterCriteria = {
    user: userId,
    isDeleted: false,
  };

  const meals = await Meal.find(filterCriteria);
  const exercises = await Exercise.find(filterCriteria);

  let user = await User.findById(userId)
    .populate({
      path: "meal",
      match: filterCriteria,
    })
    .populate({
      path: "exercise",
      match: filterCriteria,
    });

  if (!user) {
    throw new AppError(400, "User not found", "Get Single User Error");
  }

  user = user.toJSON();
  user.meal = meals;
  user.exercise = exercises;

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Single User Successfully"
  );
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.id;
  if (currentUserId !== userId)
    throw new AppError(400, "Permission Required", "Update User Error");
  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Update User Error");

  const allows = [
    "name",
    "gender",
    "age",
    "height",
    "weight",
    "avatarUrl",
    "goal",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  await user.save();
  return sendResponse(res, 200, true, user, null, "Update User Successfully");
});

module.exports = userController;
