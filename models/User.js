import mongoose, {Schema} from "mongoose";



const userSchema = new Schema(
  {
    saveSessionId: String,
    cells: {type: [mongoose.Mixed], required: false},
    hiddenCells: {type: [mongoose.Mixed], required: false},
    flagCells: {type: [Number], required: false},
    visitedCells: {type: [mongoose.Mixed], required: false},
    flagCount: Number,
    flagMode: Number,
    mines: Number,
    numbers: Number,
    replaceZeroes: Number,
    firstMine: Number,
    score: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.User || mongoose.model("User", userSchema);