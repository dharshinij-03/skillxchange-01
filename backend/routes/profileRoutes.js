// backend profileroutes.js (Express Routes)
import express from "express";
import Profile from "../models/Profile.js"; // Adjust path if needed

const router = express.Router();

// Route to get profile by email (used for prefilling the form)
// GET /api/profile/:email
router.get("/:email", async (req, res) => {
  try {
    const user = await Profile.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }
    // Returns profile data, including `wantToLearn`
    res.json(user); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to create or update profile (used for saving the form data)
// POST /api/profile
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find and update if profile exists, otherwise create a new one
    let profile = await Profile.findOneAndUpdate(
      { email }, 
      req.body, 
      { 
        new: true, 
        upsert: true, // Creates the document if it doesn't exist
        runValidators: true 
      }
    );

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;