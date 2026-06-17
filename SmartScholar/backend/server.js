const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    project: "SmartScholar",
    status: "Running"
  });
});

app.get("/assignments", (req, res) => {
  res.json([
    { title: "Math Assignment" },
    { title: "AI Report" }
  ]);
});

app.get("/attendance", (req, res) => {
  res.json({
    attendance: "87%"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});