require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("AI Study Assistant Backend is running!");
});

app.post("/ask-ai", (req, res) => {

    const question = req.body.question;

    if (!question) {
        return res.status(400).json({
            error: "Question is required"
        });
    }

    res.json({
        answer: `You asked: ${question}

This is a test response from your AI Study Assistant backend.

Backend connection is working successfully!`
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
