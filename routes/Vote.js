import express from "express";
import { createVote, getAllVotes } from "../controllers/voteController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Normal users can create votes
router.post("/", authMiddleware, createVote);

// ✅ Admin-only route to view all votes
router.get("/admin", authMiddleware, async (req, res, next) => {
  try {
    if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
      return next();
    }
    return res.status(403).json({ message: "Access denied - Admin only" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}, getAllVotes);

export default router;
