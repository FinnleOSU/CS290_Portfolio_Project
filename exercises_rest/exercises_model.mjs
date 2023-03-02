import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: String, required: true }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Exercise = mongoose.model("Exercise", exerciseSchema);

const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({ name: name, reps: reps, weight: weight, unit: unit, date: date });
    return exercise.save();
}
const findExercises = async (filter) => {
    const query = Exercise.find(filter);
    return query.exec();
}
const findExercisesById = async (id) => {
    const query = Exercise.find(id);
    return query.exec();
}
const replaceExercise = async(filter, update) =>{
    const result = await Exercise.updateOne(filter, update);
    return result.matchedCount;
}
const deleteExercise = async(id) =>{
    const deleteById = await Exercise.deleteOne(id);
    return deleteById.deletedCount;
}
export { createExercise, findExercises, findExercisesById, replaceExercise, deleteExercise };