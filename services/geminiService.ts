import { GoogleGenAI } from "@google/genai";
import { DemandEntry, Vehicle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFleetDemand = async (
  demands: DemandEntry[],
  stock: Vehicle[]
): Promise<string> => {
  try {
    const activeDemands = demands.filter(d => !d.isArchived);
    const availableStock = stock.filter(v => v.status === 'available').length;
    const workshopStock = stock.filter(v => v.status === 'in_workshop').length;

    const dataSummary = {
      totalActiveDemands: activeDemands.length,
      demandsBySector: {
        LOGISTICS: activeDemands.filter(d => d.currentSector === 'LOGISTICS').length,
        WORKSHOP: activeDemands.filter(d => d.currentSector === 'WORKSHOP').length,
        HIREFLEET: activeDemands.filter(d => d.currentSector === 'HIREFLEET').length,
      },
      stockOverview: {
        available: availableStock,
        inWorkshop: workshopStock,
        total: stock.length
      },
      urgentTags: activeDemands.filter(d => d.tags?.some(t => t.type === 'urgent')).length,
      upcomingRoutes: activeDemands.map(d => `${d.group || 'Unscheduled'}: ${d.model}`).slice(0, 15) // Sample
    };

    const prompt = `
      You are an expert Logistics and Fleet Manager AI named 'Cerberus'.
      Analyze the following fleet data and provide a concise, strategic summary.
      
      Data:
      ${JSON.stringify(dataSummary, null, 2)}

      Please provide:
      1. **Bottleneck Alert**: Where is the biggest backlog? (Logistics routing, Workshop repairs, or Handover).
      2. **Stock Health**: Are we running low on vehicles compared to demand?
      3. **Actionable Recommendations**: 3 bullet points on what the team should prioritize today.

      Keep the tone professional, efficient, and slightly futuristic. Use Markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis complete, but no text returned.";

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "## System Offline\n\nUnable to contact the Cerberus Neural Core. Please verify network connection or API Key configuration.";
  }
};