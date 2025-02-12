const express = require("express");
const User = require("../models/User"); // Import the User model
const bcrypt = require("bcryptjs"); // Hash passwords
const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log("Received signup request:", req.body);
    
    // Destructure the data from the request body
    const { firstName, lastName, email, password, role } = req.body;

    // 1️⃣ Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check if the role is valid (only "teacher" or "student" allowed)
    if (!["teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // 3️⃣ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 4️⃣ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create a new user with the selected role
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, role });

    // Save the new user to the database
    await newUser.save();

    // Return success message
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
