import { GoogleGenAI } from "@google/genai";
import { Reading, Tag } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeConsumption = async (readings: Reading[], tags: Tag[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const model = "gemini-2.5-flash";
  const tagMap = new Map(tags.map(t => [t.id, t]));

  const dataAsText = readings
    .map(r => {
      const tag = tagMap.get(r.tagId);
      return `${tag?.name},${tag?.area},${r.timestamp},${r.kwh},${r.submittedBy}`;
    })
    .join('\n');

  const prompt = `
    You are an expert energy consumption analyst for an industrial facility.
    Analyze the following daily electrical readings log, provided in CSV format with columns:
    "Cabinet Tag", "Area", "Timestamp", "KWH Value", "Submitted By".

    Your task is to provide a concise, actionable summary for a finance manager based on this log of individual readings.
    Your analysis should include:
    1. A brief overall summary of the data entry activity (e.g., number of readings submitted).
    2. Identification of the top 3 highest KWH index values recorded in this log.
    3. Point out any potential anomalies. An anomaly could be an unusually high value compared to others, a value of zero, or multiple readings for the same tag if that's unexpected.
    4. Provide one brief, actionable recommendation for further investigation based on the submitted values.

    Keep the tone professional and data-driven. The output must be plain text.

    Here is the data:
    ${dataAsText}
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate analysis from Gemini API.");
  }
};
