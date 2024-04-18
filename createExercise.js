const fs = require("fs");
const csv = require("csvtojson");
const Exercise = require("./models/Exercise");
const mongoose = require("mongoose");
require("dotenv").config();

const createExercise = async () => {
  let exerciseData = await csv().fromFile("megaGymDataset.csv");

  const mongoURI =
    "mongodb+srv://thucvi123:LS3fxhMi8EI8MNKL@cluster0.8y5teuw.mongodb.net/gym-space";
  mongoose
    .connect(mongoURI)
    .then(() => console.log(`DB connected ${mongoURI}`))
    .catch((err) => console.log(err));

  let data = JSON.parse(fs.readFileSync("exercises.json"));

  exerciseData = exerciseData.map((e) => {
    return {
      name: e.Title,
      part: e.BodyPart,
      equipment: e.Equipment,
      level: e.Level,
      description: e.Desc,
      type: e.Type,
    };
  });

  console.log(exerciseData);
  // data.exercises = exerciseData;
  // fs.writeFileSync("exercises.json", data);

  fs.writeFileSync(
    "exercises.json",
    JSON.stringify({ exercises: exerciseData })
  );
  await Exercise.create(exerciseData);
  console.log("done");
};
createExercise();
