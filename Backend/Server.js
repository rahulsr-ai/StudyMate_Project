import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env file into process.env
import router from "./Routes/HandleRoutes.js";
import AiRouter from "./Routes/HandleAi.js";
import { redis } from "./redis.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  return res.status(200).json("hello world");
});



app.use("/api", router);



app.use("/api", AiRouter);




app.get("/redis-test", async (req, res) => {
  try {
    await redis.set("test", "hello bhai", { ex: 60 });

    const data = await redis.get("test");

    res.json({ message: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Redis error" });
  }
});


// ✅ Start Server
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
