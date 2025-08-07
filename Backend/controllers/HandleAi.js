import axios from "axios";

// if HandleAi.js is in /Backend/controllers and supabase.js is in /Backend/db
import supabase from "../db/supabase.js";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";

const geminiKey = process.env.VITE_GEMINIAPI_KEY;

const ai = new GoogleGenAI({ apiKey: geminiKey });

const sys_instruction = `
Your name is **Niko**. You are a calm, helpful, and concise AI assistant.

You must always respond in **well-aligned Markdown format** with proper spacing and indentation. Follow these formatting rules:

📌 **General Rules**
- Use **Markdown** for all responses.
- Always insert **one empty line between points** for better readability.
- Use **bullet points** or **numbered lists** to explain step-by-step concepts.
- Avoid big paragraphs — keep things clean, short, and aligned.
- For technical answers, use proper **code blocks** (\`\`\`) with syntax highlighting if needed.

📌 **Formatting Guidelines**
- Bold key terms using **double asterisks**.
- Separate sections using line breaks.
- Use indentation and line spacing for neat alignment.
- DO NOT cram responses — maintain visual gaps between blocks of text.

📌 **Example**
Here’s how your responses should look:

1. **Definition**:  
   NumPy is a core Python library for numerical computing.

2. **Key Features**:  
   - N-dimensional array support  
   - Fast matrix operations  
   - Useful for data science and ML

3. **Installation**:  
   \`\`\`bash
   pip install numpy
   \`\`\`

Always write in this clean format. Avoid unnecessary words and always prioritize clarity.
`;

const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  history: [
    {
      role: "model",
      parts: [{ text: sys_instruction }],
    },
  ],
});

export const getVideosSummary = async (req, res) => {

  const videoId = req.query.videoid; 

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" }); 
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId); 

    const flatTranscript = transcript.flat(); 
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
  const { videoId, prompt, id, type } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  let transcript = "";

  try {
    // Optional: Add transcript only once at the beginning
    if (videoId) {
      const { data: transcriptData, error: transcriptError } = await supabase
        .from("transcripts")
        .select("text")
        .eq("video_id", videoId)
        .single();

      transcript = transcriptData?.text || "";

      if (transcript) {
        await chat.sendMessage({
          message: `Here is the transcript of the video which user is watching currently forget about what we was viewing earlier okay :\n\n${transcript}`,
        });
      } else { 
       await chat.sendMessage({ 
        message: "user is watching a video from utube but transcript is not available "
       })
      }
    } if (type === "pdf") {
      const { data: pdfData, error: pdfError } = await supabase
        .from("pdf_files")
        .select("extracted_chunks")
        .eq("id", id);

      const extractedChunks = pdfData?.[0]?.extracted_chunks || [];
      if (extractedChunks.length > 0) {
        await chat.sendMessage({
          message: `Here are the extracted chunks from the PDF user is viewing :\n\n${extractedChunks.join(
            "\n\n"
          )}`,
        });
      } else { 
        await chat.sendMessage({
          message: "user is viewing a pdf but no extracted context are available",
        });
      }
    }

    const result = await chat.sendMessage({ message: prompt });
    let reply = result.text;

    if (
      reply.trim().endsWith(":") ||
      reply.trim().endsWith("*") ||
      reply.trim().endsWith("```")
    ) {
      const continuation = await chat.sendMessage({ message: "continue" });
      reply += "\n" + continuation.text;
    }

    console.log("Niko's Reply:", reply);
    return res.status(200).json({ prompt, reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Gemini API error" });
  }
};
