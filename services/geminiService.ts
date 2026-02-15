
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIRecommendation = async (userQuery: string, catalog: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O usuário perguntou: "${userQuery}". 
      Baseado neste catálogo de smartphones: ${JSON.stringify(catalog)}, 
      recomende o melhor aparelho e explique o porquê em no máximo 3 frases. 
      Seja técnico e objetivo.`,
      config: {
        systemInstruction: "Você é um especialista em tecnologia mobile (Tech Guru) da CostaiPhones. Seu objetivo é ajudar usuários a escolherem o smartphone ideal do catálogo CostaiPhones.",
        temperature: 0.7,
      }
    });
    return response.text || "Desculpe, não consegui processar sua recomendação no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro de conexão com o cérebro AI. Tente novamente.";
  }
};

export const comparePhonesAI = async (phone1: any, phone2: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Execute uma análise comparativa profunda entre ${phone1.name} e ${phone2.name}. 
      Use o seguinte formato:
      - Veredito de Performance: [Texto curto]
      - Capacidade Fotográfica: [Texto curto]
      - Eficiência Energética: [Texto curto]
      - CONCLUSÃO: Indique qual o melhor investimento para o usuário médio.`,
      config: {
        systemInstruction: "Você é um analista de hardware sênior da CostaiPhones (Tech Analyst). Sua linguagem é técnica, direta e baseada em benchmarks de hardware realistas.",
        temperature: 0.5,
      }
    });
    return response.text || "Análise comparativa indisponível.";
  } catch (error) {
    console.error("Gemini Comparison Error:", error);
    return "Falha na análise comparativa de hardware.";
  }
};
