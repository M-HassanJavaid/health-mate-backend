import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function getAiReport(url) {
  try {
    // 1️⃣ Fetch file from URL
    const fileResponse = await fetch(url);

    if (!fileResponse.ok) {
      throw new Error("Failed to fetch file from URL");
    }

    // 2️⃣ Get mime type
    const mimeType =
      fileResponse.headers.get("content-type") || "application/pdf";

    // 3️⃣ Convert file to base64
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    if (!base64Data) {
      throw new Error("Base64 conversion failed");
    }

    // 4️⃣ Prompt (NO base64 inside)
    const detailedPrompt = `
You are an expert in medical content summarization and structured JSON output.

Ignore file format completely.
Look only at visible content inside the document.

If content is NOT medical:
Return:
<JSON>
{
  "ok": false,
  "error": "Document is not medical in nature."
}
</JSON>

If content IS medical:
Return FULL JSON with all fields filled.
No field can be empty.
Do not hallucinate.
Use extremely simple English.
Roman Urdu must match meaning exactly.
Output valid JSON ONLY between <JSON> and </JSON>.

Required JSON:
{
  "ok": true,
  "error": "",
  "summaryInEnglish": "",
  "summaryInRomanUrdu": "",
  "questionsToDoctorInEnglish": [""],
  "questionsToDoctorInRomanUrdu": [""],
  "foodsToEatInEnglish": [""],
  "foodsToEatInRomanUrdu": [""],
  "foodsToAvoidInEnglish": [""],
  "foodsToAvoidInRomanUrdu": [""],
  "homeRemediesInEnglish": [""],
  "homeRemediesInRomanUrdu": [""]
}
`;

    // 5️⃣ Send file + prompt correctly
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Data
          }
        },
        {
          text: detailedPrompt
        }
      ]
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    // 6️⃣ Extract JSON safely
    const jsonMatch = responseText.match(/<JSON>([\s\S]*?)<\/JSON>/);

    if (!jsonMatch) {
      console.log("Raw AI response:", responseText);
      throw new Error("No valid JSON found");
    }

    return JSON.parse(jsonMatch[1].trim());

  } catch (error) {
    console.error("AI Report Error:", error.message);
    throw error;
  }
}

export default getAiReport;