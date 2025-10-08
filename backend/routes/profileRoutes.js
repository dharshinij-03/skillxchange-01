import express from "express";
import Profile from "../models/Profile.js";
const router = express.Router();

// Save profile
router.post("/", async (req, res) => {
  try {
    const { userId, fullName, email, skills, learn, country, state, city, about, avatar } = req.body;

    const profile = new Profile({
      userId,
      fullName,
      email,
      skills,
      learn,
      country,
      state,
      city,
      about,
      avatar,
    });

    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
