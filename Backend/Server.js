import express, { response, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env file into process.env
import supabase from "./db/supabase.js";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";
import router from "./Routes/HandleRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  return res.status(200).json("hello world");
});

// Handle Supabase data get, post,
app.use("/api", router);

app.post("/api/prompt", async (req, res) => {
  const { prompt, transcript } = req.body;
  console.log("hello prompt", prompt);
  console.log("this is our transcript version ", transcript);

  // const options = {
  //   method: "POST",
  //   url: "https://open-ai21.p.rapidapi.com/conversationllama",
  //   headers: {
  //     "x-rapidapi-key": "1e13475c38msh63bfa16c48dfad2p11e85bjsnb30f82da05d2",
  //     "x-rapidapi-host": "open-ai21.p.rapidapi.com",
  //     "Content-Type": "application/json",
  //   },
  //   data: {
  //     messages: [
  //       {
  //         role: "system",
  //         content: `You are an expert assistant. Here's the transcript of a video the user is watching:
  //         ${transcript}
  //         Use this context to answer user questions and only answer in hindi when user ask untill answer in the hinglish or english `,
  //       },
  //       {
  //         role: "user",
  //         content: prompt,
  //       },
  //     ],
  //     web_access: false,
  //   },
  // };

  const options = {
    method: 'POST',
  url: 'https://chatgpt4o-ai-chatbot.p.rapidapi.com/chat2.php',
  headers: {
    'x-rapidapi-key': '1e13475c38msh63bfa16c48dfad2p11e85bjsnb30f82da05d2',
    'x-rapidapi-host': 'chatgpt4o-ai-chatbot.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
    data: {
      messages: [
        {
          role: "system",
          content: `You are an expert assistant. Here's the transcript of a video the user is watching:
          ${transcript}
          Use this context to answer user questions and only answer in hindi when user ask untill answer in the hinglish or english `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);

    console.log("this is the response ", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch prompt" });
  }
});

app.get("/api/getSummary", async (req, res) => {
  console.log("hello summary ");

  const videoId = req.query.videoid; // Extract videoId from query parameters

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" }); // Return error if videoId is missing
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId); // Use the provided videoId

    const flatTranscript = transcript.flat(); // Flatten the nested array
    const plainText = flatTranscript
      .map((item) => item.text)
      .filter(
        (text) => !!text && text.trim() !== "" && !text.includes("[संगीत]")
      ) // remove empty & music tags
      .join(" ");

    // console.log("plainText ", plainText);

    return res.status(200).json({
      message: "Transcript fetched successfully",
      success: true,
      plainText: plainText, // Include the fetched transcript in the response
    });
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Handle errors gracefully
  }
});

// ✅ Get Videos by Container ID API
app.get("/api/container/:container_id/videos", async (req, res) => {
  const { container_id } = req.params;

  const { data, error } = await supabase
    .from("study_box")
    .select(
      "v_title, v_thumbnail, v_code, v_url, v_id, notes, study_container(name)"
    )
    .eq("container_id", container_id)
    .join("study_container", "study_box.container_id", "study_container.id");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
