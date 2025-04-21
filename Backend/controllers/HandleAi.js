import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";





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




export const AiResponse =   async (req, res) => {
  const { prompt, transcript } = req.body;
  console.log("hello prompt", prompt);
  console.log("this is our transcript version ", transcript);

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
}

