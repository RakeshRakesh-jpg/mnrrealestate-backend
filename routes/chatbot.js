// server.js
import express from "express";
import chatbotRouter from "./routes/chatbot.js"; // adjust path

const app = express();
app.use(express.json());

// Mount chatbot router at /chatbot
app.use("/chatbot", chatbotRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});