import { GoogleGenAI, Modality } from "@google/genai";

const createAiClient = () => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY environment variable not set. Please select a key if required or reload.");
    }
    return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateQuoteText = async (): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a short, inspirational, and unique quote. It should be less than 20 words.",
    });
    return response.text.replace(/"/g, '');
  } catch (error) {
    console.error("Error generating quote text:", error);
    throw new Error("Failed to generate quote text from AI.");
  }
};

export const generateQuoteImage = async (quote: string, theme: string, styleImage?: {base64: string, mimeType: string}): Promise<string> => {
  const ai = createAiClient();
  try {
    if (styleImage) {
        const prompt = `Apply the artistic style of the provided image to a new image that represents the quote: "${quote}". The new image should be visually stunning and high-resolution. Theme: ${theme}. Do not include any text in the generated image.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: styleImage.base64, mimeType: styleImage.mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No styled image was generated.");

    } else {
        const prompt = `Create a visually stunning, high-resolution, artistic image representing the quote: "${quote}". The style should be ${theme}. The text of the quote should be elegantly integrated into the image. 4k, photorealistic, cinematic lighting.`;
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    }
  } catch (error) {
    console.error("Error generating quote image:", error);
    throw new Error("Failed to generate quote image.");
  }
};

export const generateQuoteAudio = async (quote: string): Promise<string> => {
    const ai = createAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Read this quote with an inspiring and clear voice: ${quote}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data returned from API.");
        }
        const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/mpeg';

        return `data:${mimeType};base64,${base64Audio}`;
    } catch (error) {
        console.error("Error generating quote audio:", error);
        throw new Error("Failed to generate quote audio.");
    }
};

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = createAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    throw new Error("No edited image was generated.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image.");
  }
};
