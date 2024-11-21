import mongoose from "mongoose";



const User = new mongoose.Schema(
  {
    saveSessionId: String,
    cells: {type: [mongoose.Mixed], required: false},
    hiddenCells: {type: [mongoose.Mixed], required: false},
    flagCells: [Number],
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

//export default mongoose.models.User || mongoose.model("User", User);
export default User;