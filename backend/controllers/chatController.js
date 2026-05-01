import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let aiClient = null;
try {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    // Automatically uses process.env.GEMINI_API_KEY
    aiClient = new GoogleGenAI({}); 
  }
} catch(e) {
  console.log("Failed to init AI client", e.message);
}

export const generateResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // 1. Live Google Gemini LLM Integration
    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a premium AI Shopping Assistant. Provide highly personalized, markdown-formatted recommendations. Localize your prices to Indian Rupees (₹). User Query: ${message}`
        });

        return res.status(200).json({
          success: true,
          text: response.text
        });
      } catch (err) {
        console.error("Gemini live execution failed, falling back to local simulation.", err.message);
      }
    }

    // --- MOCK NLP LOGIC FOR LOCAL TESTING ---
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate AI typing latency
    
    const query = message.toLowerCase();
    let reply = "That's an interesting question! Based on my catalog, I can help you find a great laptop. Could you specify if you need it for gaming, coding, or casual use?\n\n*(Connect your GEMINI_API_KEY in backend/.env for real AI responses!)*";

    if (query.includes('gaming')) {
      reply = "For gaming, you definitely want something with a dedicated GPU and a high refresh rate display. The **Stealth Blade 15** in our catalog is an absolute beast for this at ₹1,55,000. Should I add it to your comparison tray?";
    } else if (query.includes('code') || query.includes('programming')) {
      reply = "For software development, RAM and processor speed are key. I highly recommend the **ProVision X1** because of its unified memory architecture. It compiles code extremely fast!";
    } else if (query.includes('price') || query.includes('cheap')) {
      reply = "If you are balancing cost, the **ZenBook Ultra** gives you excellent value at ₹95,500 without sacrificing premium build quality.";
    }

    res.status(200).json({
      success: true,
      text: reply
    });

  } catch (error) {
    console.error('Chat AI error:', error);
    res.status(500).json({ success: false, message: 'Internal LLM Error' });
  }
};
