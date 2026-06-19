const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  title: String,
  dueDate: String
});

module.exports = mongoose.model(
  "Assignment",
  AssignmentSchema
);