import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBtWIwSfcszyzLL9Ox05orRRGSLD6Oajxg";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are a helpful, professional, and empathetic AI Doctor named 'HealthLink AI'. 
    Your goal is to provide medical information, symptom analysis, and general health advice. 
    Always include a disclaimer that you are an AI and not a substitute for professional medical advice. 
    If a situation sounds like an emergency (e.g., chest pain, difficulty breathing), urgently advise the user to call emergency services (108 in India or their local equivalent) or visit the nearest hospital.
    Keep responses concise, easy to understand, and supportive. 
    Do not prescribe specific medications, but you can suggest common over-the-counter remedies for mild symptoms while advising a doctor's consultation.`,
});

export const getAIResponse = async (history) => {
    try {
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            })),
        });

        const lastMessage = history[history.length - 1].text;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return "I apologize, but I'm having trouble connecting right now. Please try again or consult a human doctor for urgent matters.";
    }
};
