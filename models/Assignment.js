const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  submissions: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      fileUrl: {
        type: String, // URL to the submitted file
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
