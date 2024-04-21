const fs = require("fs");
const csv = require("csvtojson");
const Workout = require("./models/Workout");
const mongoose = require("mongoose");
require("dotenv").config();

const createWorkout = async () => {
  let WorkoutData = await csv().fromFile("megaGymDataset.csv");

  const mongoURI =
    "mongodb+srv://thucvi123:LS3fxhMi8EI8MNKL@cluster0.8y5teuw.mongodb.net/gym-space";
  mongoose
    .connect(mongoURI)
    .then(() => console.log(`DB connected ${mongoURI}`))
    .catch((err) => console.log(err));

  let data = JSON.parse(fs.readFileSync("exercises.json"));

  WorkoutData = WorkoutData.map((e) => {
    return {
      name: e.Title,
      part: e.BodyPart,
      equipment: e.Equipment,
      level: e.Level,
      description: e.Desc,
      type: e.Type,
    };
  });

  console.log(WorkoutData);
  // data.Workouts = WorkoutData;
  // fs.writeFileSync("Workouts.json", data);

  fs.writeFileSync("exercises.json", JSON.stringify({ Workouts: WorkoutData }));
  await Workout.create(WorkoutData);
  console.log("done");
};
createWorkout();
