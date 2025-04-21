import { AiResponse, getVideosSummary} from '../controllers/HandleAi.js'
import express from 'express'


const AiRouter = express.Router()


AiRouter.get("/getSummary", getVideosSummary)
AiRouter.post("/prompt", AiResponse)

AiRouter.post("/groq/chat", async (req, res) => {
    const testPrompt = "Explain the importance of fast language models";
    const { prompt, transcript } = req.body;
     
    
    if(!prompt || !transcript) { 
        return res.status(400).json({ error: "Prompt or Transcript is missing" });
    }


    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{ role: 'user', content: testPrompt }],
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
      res.json({ prompt: testPrompt, reply });
    } catch (error) {
      console.error('Groq API Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Groq API failed' });
    }
  })



export default AiRouter