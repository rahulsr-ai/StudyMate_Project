import {  getVideosSummary, geminiAIresponse } from "../controllers/HandleAi.js";
import express from "express";

const AiRouter = express.Router();
// api/getSummary?videoid=$
AiRouter.get("/getSummary", getVideosSummary);
AiRouter.post("/groq/chat", geminiAIresponse);



export default AiRouter;
