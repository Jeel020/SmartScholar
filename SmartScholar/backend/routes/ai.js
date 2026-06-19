const express = require("express");

const router = express.Router();

router.post("/summary", (req, res) => {
  res.json({
    summary:
      "This is a sample AI-generated summary."
  });
});

router.post("/quiz", (req, res) => {
  res.json({
    question:
      "What is Artificial Intelligence?"
  });
});

module.exports = router;