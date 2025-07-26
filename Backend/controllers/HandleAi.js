import axios from "axios";

// if HandleAi.js is in /Backend/controllers and supabase.js is in /Backend/db
import supabase from "../db/supabase.js";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";

const geminiKey = process.env.VITE_GEMINIAPI_KEY;

const ai = new GoogleGenAI({ apiKey: geminiKey });

export const getVideosSummary = async (req, res) => {
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
};

export const AiResponse = async (req, res) => {
  const { prompt, transcript } = req.body;
  console.log("hello prompt", prompt);
  console.log("this is our transcript version ", transcript);

  const options = {
    method: "POST",
    url: "https://chatgpt4o-ai-chatbot.p.rapidapi.com/chat2.php",
    headers: {
      "x-rapidapi-key": "1e13475c38msh63bfa16c48dfad2p11e85bjsnb30f82da05d2",
      "x-rapidapi-host": "chatgpt4o-ai-chatbot.p.rapidapi.com",
      "Content-Type": "application/json",
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
};


export const geminiAIresponse = async (req, res) => {
  const { videoId, prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  let transcript = "";

  try {
    if (videoId) {
      const { data: transcriptData, error: transcriptError } = await supabase
        .from("transcripts")
        .select("text")
        .eq("video_id", videoId)
        .single();

      if (transcriptError) {
        console.warn("Transcript not found or fetch error:", transcriptError.message);
      }

      transcript = transcriptData?.text || `No transcript available for this video. Proceeding without context.`;
    } else {
      transcript = `You are a helpful assistant. First, always respond directly to the user's message.`;
    }

    const messages = [
      {
        role: "user",
        parts: [
          {
            text: `You are a helpful assistant. Respond in clear markdown format using short, bullet-point explanations. Do NOT write large paragraphs or code blocks unless explicitly asked.

Use the following formatting:
- Use **Markdown** for all responses.
- Prefer numbered lists or bullet points for step-by-step or concept explanations.
- Bold important terms using **double asterisks**.
- For technical explanations, use code blocks (\`\`\`).
- Avoid writing large paragraphs. Break things down into clear, short points.

Example:
1. **Definition**: NumPy is a core library for numerical computing.
2. **Key Feature**: It provides fast N-dimensional arrays.
3. **Use Case**: Ideal for data analysis, machine learning, etc.`,
          },
          ...(videoId
            ? [{ text: `This is the transcript of the video for reference:\n\n${transcript}` }]
            : []),
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: `${prompt}\n\nMake the response short but complete. Avoid long paragraphs.`,
          },
        ],
      },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: messages,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topK: 1,
        topP: 1,
      },
    });

    let reply = result?.text || "";

    if (!reply) {
      return res.status(500).json({ error: "Empty response from Gemini" });
    }

    if (
      reply.trim().endsWith(":") ||
      reply.trim().endsWith("*") ||
      reply.trim().endsWith("```")
    ) {
      const continueResult = await ai.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: [...messages, { role: "user", parts: [{ text: "continue" }] }],
      });

      reply += "\n" + continueResult?.text || "";
    }

    console.log("Gemini Reply:", reply);

    return res.status(200).json({ prompt, reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Gemini API error" });
  }
};



