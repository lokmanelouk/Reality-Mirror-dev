
import { GoogleGenAI } from "@google/genai";
import { UserSettings, ActivityRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBrutalVerdict(settings: UserSettings, activities: ActivityRecord[]) {
  const totalWorkMinutes = activities
    .filter(a => !a.isDistraction)
    .reduce((acc, curr) => acc + (curr.endTime - curr.startTime) / (1000 * 60), 0);
    
  const totalDistractionMinutes = activities
    .filter(a => a.isDistraction)
    .reduce((acc, curr) => acc + (curr.endTime - curr.startTime) / (1000 * 60), 0);

  const distractionList = activities
    .filter(a => a.isDistraction)
    .map(a => `${a.appName} (${a.windowTitle})`)
    .slice(0, 10)
    .join(", ");

  const prompt = `
    User Mission: ${settings.mission}
    Target Daily Work Hours: ${settings.targetWorkHours}
    Actual Work Time: ${(totalWorkMinutes / 60).toFixed(2)} hours
    Actual Distraction Time: ${(totalDistractionMinutes / 60).toFixed(2)} hours
    Top Distractions: ${distractionList}

    Task: Provide a "Brutal Verdict". Be cold, data-driven, and slightly cynical. 
    Tell them why they are failing their mission. Do not be encouraging. 
    Keep it to 2-3 short, biting paragraphs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        temperature: 0.9,
      },
    });

    return response.text || "You are beyond help. The data speaks for itself.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error calculating your failures. You're failing so hard the AI crashed.";
  }
}
