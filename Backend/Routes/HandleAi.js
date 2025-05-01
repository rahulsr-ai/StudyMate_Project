import { AiResponse, getVideosSummary, groqAIResponse } from "../controllers/HandleAi.js";
import express from "express";

const AiRouter = express.Router();

AiRouter.get("/getSummary", getVideosSummary);
AiRouter.post("/prompt", AiResponse);

AiRouter.post("/groq/chat", groqAIResponse);

export default AiRouter;
