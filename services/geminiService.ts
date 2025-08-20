import { GoogleGenAI, Type } from "@google/genai";
import type { AiSewingResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        garmentAnalysis: {
            type: Type.OBJECT,
            properties: {
                identifiedGarment: { type: Type.STRING, description: "E.g., 'High-Waisted A-Line Midi Skirt'" },
                garmentDescription: { type: Type.STRING, description: "A short paragraph describing the key visual features of the garment in the image." },
                keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key design elements. E.g., ['Pointed collar', 'Patch pockets']" },
                styleCategory: { type: Type.STRING, description: "E.g. 'Jacket', 'Skirt', 'Blouse'" },
                aiInsight: { type: Type.STRING, description: "A helpful tip or observation about construction or styling." },
            },
            required: ['identifiedGarment', 'garmentDescription', 'keyFeatures', 'styleCategory', 'aiInsight']
        },
        patternPieces: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "E.g., 'Front Bodice', 'Sleeve'" },
                    description: { type: Type.STRING, description: "A brief description of the piece and its key features." },
                },
                required: ['name', 'description']
            }
        },
        fabricAndNotions: {
            type: Type.OBJECT,
            properties: {
                fabricSuggestions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "E.g., 'Linen', 'Cotton Poplin'" },
                            reason: { type: Type.STRING, description: "Why this fabric is suitable." },
                        },
                        required: ['name', 'reason']
                    }
                },
                notions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of required notions. E.g., ['Matching thread', '7x 1/2\" buttons']" },
                recommendedSeamAllowance: { type: Type.STRING, description: "E.g., '1/2 inch (1.5 cm)'" },
            },
            required: ['fabricSuggestions', 'notions', 'recommendedSeamAllowance']
        },
        sewingSteps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    step: { type: Type.INTEGER },
                    title: { type: Type.STRING, description: "A short, clear title for the step. E.g., 'Prepare and Sew Darts'" },
                    details: { type: Type.STRING, description: "A concise explanation of how to perform the step." },
                },
                required: ['step', 'title', 'details']
            }
        }
    },
    required: ['garmentAnalysis', 'patternPieces', 'fabricAndNotions', 'sewingSteps']
};


const SYSTEM_INSTRUCTION = `You are a world-class expert fashion designer, pattern maker, and sewing instructor. Your task is to analyze an image of a garment and produce a comprehensive, structured guide for recreating it in the specified JSON format. Be thorough, clear, and encouraging in your text.`;
const USER_PROMPT = `Analyze the garment in the provided image and generate the sewing guide.`;


export const generateSewingGuideFromImage = async (base64Image: string, imageType: string): Promise<AiSewingResponse> => {
    const imagePart = {
        inlineData: {
            mimeType: imageType,
            data: base64Image,
        },
    };

    const textPart = {
        text: USER_PROMPT,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2
            }
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        return parsedData as AiSewingResponse;

    } catch (e) {
        console.error("Error generating guide from AI:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        throw new Error(`Failed to generate sewing guide. ${errorMessage}`);
    }
};