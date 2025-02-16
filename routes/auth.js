const express = require("express");
const User = require("../models/User"); // Import the User model
const bcrypt = require("bcryptjs"); // Hash passwords
const router = express.Router();
require("dotenv").config();
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
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    // Save the new user to the database
    await newUser.save();

    // Return success message
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received signin request:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Entered password:", password);
    console.log("Stored hashed password:", user.password);

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
