const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Meal = require("../models/Meal");
const User = require("../models/User");

const mealController = {};

const calculateMealCount = async (userId) => {
  const mealCount = await Meal.countDocuments({
    user: userId,
    isDeleted: false,
  });
  await User.findByIdAndUpdate(userId, { mealCount });
};

// Function to create a new meal
mealController.createMeal = catchAsync(async (req, res) => {
  const currentUserId = req.userId;
  const { name, calories } = req.body;

  let meal = await Meal.create({
    name,
    calories,
    isDeleted: false,
    date: Date.now(),
    user: currentUserId,
  });

  meal = await meal.populate("user");

  return sendResponse(res, 200, true, meal, null, "Create Meal Successfully");
});

mealController.getMeals = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  let { page, limit } = { ...req.query };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, "User not found", "Get Meals Error");
  }

  const filterCriteria = {
    user: userId,
    isDeleted: false,
  };

  const count = await Meal.countDocuments(filterCriteria);

  const totalPages = Math.ceil(count / limit);

  const offset = limit * (page - 1);

  let meals = await Meal.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("user");

  return sendResponse(
    res,
    200,
    true,
    { meals, totalPages, count },
    null,
    "Get Meals Successfully"
  );
});

mealController.updateSingleMeal = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const mealId = req.params.id;
  let meal = await Meal.findById(mealId);
  if (!meal) throw new AppError(400, "Meal not found", "Update Meal Error");
  if (!meal.user.equals(currentUserId))
    throw new AppError(400, "Only author can edit meal", "Update Meal Error");

  const allows = ["name", "calories"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      meal[field] = req.body[field];
    }
  });
  await meal.save();
  return sendResponse(res, 200, true, meal, null, "Update Meal Successfully");
});

mealController.deleteSingleMeal = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const mealId = req.params.id;

  const meal = await Meal.findOneAndUpdate(
    { _id: mealId, user: currentUserId },
    { isDeleted: true },
    { new: true }
  );

  if (!meal)
    throw new AppError(
      400,
      "Meal not found or user not authorized",
      "Delete Meal Error"
    );
  await calculateMealCount(currentUserId);

  return sendResponse(res, 200, true, meal, null, "Delete Meal Successfully");
});
module.exports = mealController;
