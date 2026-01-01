
import { GoogleGenAI, Type } from "@google/genai";
import { CoffeeParams, BrewingRecipe } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeBeans = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "辨識這張照片中的咖啡豆。回傳 JSON：origin (產區), roast (烘焙度), process (處理法)。" }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          origin: { type: Type.STRING },
          roast: { type: Type.STRING },
          process: { type: Type.STRING }
        },
        required: ["origin", "roast", "process"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const generateRecipe = async (params: CoffeeParams): Promise<BrewingRecipe> => {
  const ai = getAI();
  const prompt = `身為專業咖啡師，為以下咖啡生成精確配方：
  產區：${params.origin}, 處理法：${params.process}, 烘焙度：${params.roast}, 水量：${params.targetVolume}cc, 濾杯：${params.dripper}。
  回傳 JSON 包含 powderWeight, waterRatio, grindSize, temperature, totalTime, steps (time, action, waterAmount, technique), notes。`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          powderWeight: { type: Type.NUMBER },
          waterRatio: { type: Type.STRING },
          grindSize: { type: Type.STRING },
          temperature: { type: Type.NUMBER },
          totalTime: { type: Type.STRING },
          notes: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                action: { type: Type.STRING },
                waterAmount: { type: Type.STRING },
                technique: { type: Type.STRING },
              },
              required: ["time", "action", "waterAmount", "technique"]
            }
          }
        },
        required: ["powderWeight", "waterRatio", "grindSize", "temperature", "steps", "totalTime"]
      }
    }
  });
  return JSON.parse(response.text.trim()) as BrewingRecipe;
};
