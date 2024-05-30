const fs = require("fs");
const csv = require("csvtojson");
const Workout = require("./models/Workout");
const mongoose = require("mongoose");
require("dotenv").config();
const { faker } = require("@faker-js/faker");

const createWorkout = async () => {
  let WorkoutData = await csv().fromFile("megaGymDataset.csv");

  const mongoURI =
    "mongodb+srv://thucvi123:LS3fxhMi8EI8MNKL@cluster0.8y5teuw.mongodb.net/gym-space";
  mongoose
    .connect(mongoURI)
    .then(() => console.log(`DB connected ${mongoURI}`))
    .catch((err) => console.log(err));

  let data = JSON.parse(fs.readFileSync("exercises.json"));

  WorkoutData = WorkoutData.map((item, index) => {
    return {
      id: index + 1,
      name: item.Title,
      part: item.BodyPart,
      equipment: item.Equipment,
      level: item.Level,
      description: item.Desc || "",
      type: item.Type,
      videoLink: faker.internet.url(),
    };
  });

  console.log(WorkoutData);

  fs.writeFileSync("exercises.json", JSON.stringify({ Workouts: WorkoutData }));
  await Workout.create(WorkoutData);
  console.log("done");
};
createWorkout();
