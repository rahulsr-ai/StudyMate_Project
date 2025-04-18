// openaiClient.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env file into process.env

const openai = new OpenAI({
  apiKey: process.env.OpenAi_key,
});


export const getChatResponse = async (userPrompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k", // or "gpt-4"
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Reply in Hindi if the user is using Hindi.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });
    
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    return "Error while generating response.";
  }
};
