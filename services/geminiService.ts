import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends an image to Gemini to remove watermarks.
 * Uses gemini-2.5-flash-image for image editing tasks.
 */
export const removeWatermark = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: 'Remove any watermarks, logos, or text overlays from this image. Fill in the background naturally where the watermark was removed. Return ONLY the cleaned image.',
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
        throw new Error("No content returned from the model.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        // Construct the data URL
        const responseMimeType = part.inlineData.mimeType || 'image/png';
        return `data:${responseMimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("The model did not return an image. It might have refused the request due to safety filters.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
