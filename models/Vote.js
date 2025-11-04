import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  email: { type: String },
  party: { type: String, required: true }, // e.g., 'BJP', 'CONGRESS', ...
  createdAt: { type: Date, default: Date.now }
});

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
