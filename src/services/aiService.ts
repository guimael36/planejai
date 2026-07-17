import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
import type { ChatMessage } from "@/data/simulation";

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: { content: string }
  suggestions: { items: string[] }
  extraIncome: { items: string[] }
  investment: { items: string[] }
  motivation: { content: string }
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getInsight = async (prompt: string): Promise<InsightData> => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text) as InsightData;
  } catch (error) {
    console.error("Erro detalhado no SDK do Gemini:", error);
    throw new Error("Falha ao se comunicar com a API do Gemini.");
  }
}

export const sendChatMessageToMentor = async (
  message: string,
  history: ChatMessage[],
  insightContext: InsightData
): Promise<string> => {
  const chatModel = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const formattedHistory: Content[] = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const systemPrompt = `Você é um mentor financeiro educado e direto.
  Um usuário gerou o seguinte diagnóstico financeiro: ${JSON.stringify(insightContext)}.
  Baseado neste diagnóstico, responda as dúvidas do usuário de forma clara, amigável e em português do Brasil.`;

  const chat = chatModel.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Entendido! Estou pronto para responder dúvidas sobre este diagnóstico.' }] },
      ...formattedHistory,
    ],
  });

  try {
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Erro na conversa com o Gemini:", error);
    throw new Error("Não foi possível enviar a mensagem.");
  }
}
