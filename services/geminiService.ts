
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AITrend, LinkedInPost, GroundingSource } from "../types";

const API_KEY = process.env.API_KEY || "";

export const fetchLatestAITrends = async (): Promise<{ trends: AITrend[], sources: GroundingSource[] }> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `Search for the top 5 most significant AI breakthroughs, trends, or news stories from the last 7 days. 
  For each trend, provide:
  1. A clear title
  2. A 2-sentence summary
  3. A category (e.g., LLMs, Robotics, Image Gen, Enterprise, Ethics)
  
  Format the output as a JSON array of objects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["title", "description", "category"]
        }
      }
    },
  });

  const rawJson = response.text || "[]";
  const trends: any[] = JSON.parse(rawJson);
  
  const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri || ""
    }))
    .filter((s: any) => s.uri !== "") || [];

  return {
    trends: trends.map((t, i) => ({ ...t, id: `trend-${i}` })),
    sources
  };
};

export const generateLinkedInPost = async (trends: AITrend[]): Promise<LinkedInPost> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const trendsContext = trends.map(t => `- ${t.title}: ${t.description}`).join('\n');
  
  const prompt = `Act as a high-authority LinkedIn content creator specializing in AI. 
  Write a viral LinkedIn post summarizing these 5 trends:
  ${trendsContext}
  
  Requirements:
  1. Use a strong "hook" to grab attention.
  2. Use bullet points for readability.
  3. Add a "Why it matters" section for each or for the group.
  4. End with an engaging question to drive comments.
  5. Include relevant emojis.
  6. Provide 5-7 trending hashtags.
  7. Suggest a DALL-E/Midjourney style image prompt that would complement this post.
  
  Format the output as JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedImagePrompt: { type: Type.STRING }
        },
        required: ["content", "hashtags", "suggestedImagePrompt"]
      }
    },
  });

  return JSON.parse(response.text || "{}");
};
