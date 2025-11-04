import express from "express";
import { createVote, getAllVotes } from "../controllers/voteController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/votes (protected) - create a vote
router.post("/", authMiddleware, createVote);

// GET /api/votes (protected + admin) - list all votes
router.get("/", authMiddleware, async (req, res, next) => {
  // simple admin check - ADMIN_EMAIL in .env
  try {
    if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden - admin only" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}, getAllVotes);

export default router;
