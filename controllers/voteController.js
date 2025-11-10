
import Vote from "../models/Vote.js";

// Create a vote (protected)
export const createVote = async (req, res) => {
  try {
    const { party } = req.body;
    if (!party) return res.status(400).json({ message: "Party is required" });

    // ensure user exists on req.user (authMiddleware)
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Optional: check if user already voted (single vote rule)
    const already = await Vote.findOne({ email: user.email });
    if (already) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const vote = new Vote({
      userId: user._id,
      name: user.name || "",
      email: user.email,
      party
    });
    await vote.save();
    return res.status(201).json({ message: "Vote cast", vote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all votes - admin only
export const getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.find().sort({ createdAt: -1 });
    return res.json({ votes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
