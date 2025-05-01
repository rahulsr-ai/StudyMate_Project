import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env file into process.env
import router from "./Routes/HandleRoutes.js";
import AiRouter from "./Routes/HandleAi.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  return res.status(200).json("hello world");
});



app.use("/api", router);



app.use("/api", AiRouter);


























// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
