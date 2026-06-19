import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

// INCREASED LIMIT: Needed because Base64 image strings from the frontend are large
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Check if API key exists to prevent silent failures
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing from .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend Working");
});

app.get("/summary", (req, res) => {
  res.send("Summary Route Exists");
});

// ==========================================
// 1. AI SUMMARY ROUTE
// ==========================================
app.post("/summary", async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({ error: "No notes provided" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let promptContent;

    // Detect if the incoming "notes" string is a Base64 image from the frontend
    if (notes.startsWith("data:image/")) {
      // Regex to extract the MIME type and the raw Base64 data
      const matches = notes.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64Data = matches[2];

        // Format for Gemini Vision capabilities
        promptContent = [
          "Summarize the educational notes provided in this image clearly and concisely.",
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
        ];
      } else {
        throw new Error("Invalid image format received.");
      }
    } else {
      // Handle standard text notes
      promptContent = `Summarize these notes clearly and concisely:\n\n${notes}`;
    }

    // Generate response
    const result = await model.generateContent(promptContent);
    const summary = result.response.text();

    res.json({
      summary,
    });

  } catch (error) {
    console.error("Generate Content Error:", error);

    res.status(500).json({
      error: error.message || "An error occurred while generating the summary.",
    });
  }
});

// ==========================================
// 2. AI QUIZ ROUTE (This was missing!)
// ==========================================
app.post("/quiz", async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({ error: "No notes provided" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let promptContent;

    // Detect if the incoming "notes" string is a Base64 image
    if (notes.startsWith("data:image/")) {
      const matches = notes.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64Data = matches[2];

        promptContent = [
          "Create a 5-question quiz based on the educational notes provided in this image. Ask the questions first, and provide the correct answers at the bottom.",
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
        ];
      } else {
        throw new Error("Invalid image format received.");
      }
    } else {
      // Handle standard text notes
      promptContent = `Create a 5-question quiz based on these notes. Ask the questions first, and provide the correct answers at the bottom:\n\n${notes}`;
    }

    // Generate response
    const result = await model.generateContent(promptContent);
    const quiz = result.response.text();

    res.json({
      quiz,
    });

  } catch (error) {
    console.error("Quiz Generation Error:", error);

    res.status(500).json({
      error: error.message || "An error occurred while generating the quiz.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Started on Port ${PORT}`);
});