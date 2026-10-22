
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("AI Study Assistant Backend is running!");
});

app.post("/ask-ai", async (req, res) => {
    const question = req.body.question;

    if (!question || !question.trim()) {
        return res.status(400).json({
            error: "Please enter a question."
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "Gemini API key is not configured on the server."
        });
    }

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{
                            text: "You are a friendly AI Study Assistant. Explain study topics in simple language for college students. Use clear examples and step-by-step explanations."
                        }]
                    },
                    contents: [{
                        parts: [{
                            text: question
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API error:", response.status, data);
            return res.status(502).json({
                error: "Gemini could not answer. Please try again."
            });
        }

        const answer =
            data.candidates?.[0]?.content?.parts
                ?.map(part => part.text || "")
                .join("")
                .trim();

        if (!answer) {
            return res.status(502).json({
                error: "No answer was returned. Please try another question."
            });
        }

        res.json({ answer });

    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).json({
            error: "Something went wrong. Please try again."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
