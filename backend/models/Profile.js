import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ make it optional
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    skills: { type: String },
    wantToLearn: { type: String },
    country: { type: String, default: "India" },
    state: { type: String },
    city: { type: String },
    about: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
