import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import supabase from "Backend/db/supabase";




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





export const groqAIResponse = async (req, res) => {
  const { videoId, prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  let transcript = "";

  try {
    // Step 1: If videoId exists, try to fetch transcript
    if (videoId) {
      const { data: transcriptData, error: transcriptError } = await supabase
        .from('transcripts')
        .select('text')
        .eq('video_id', videoId)
        .single();

      if (transcriptError) {
        console.warn("Transcript not found or fetch error:", transcriptError.message);
      }

      if (transcriptData?.text) {
        transcript = transcriptData.text;
      } else {
        transcript = `No transcript available for this video. Proceeding without context.`;
      }
    } else {
      // No videoId means it's probably a PDF or generic question
      transcript = `You are a helpful assistant. First, always respond directly to the user's message.`;
    }

    // Step 2: Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant. First, always respond directly to the user's message.`
          },
          ...(videoId
            ? [{
                role: "user",
                content: `This is the transcript of the video for reference:\n\n${transcript}`
              },
              {
                role: "assistant",
                content: "Thanks for the transcript! Let me know if you have any questions about it."
              }]
            : []
          ),
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    return res.status(200).json({ prompt, reply });

  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Groq API failed" });
  }
};

