
// This is a Netlify serverless function. It requires the '@google/genai' package
// to be included in your project's dependencies (e.g., in package.json).
const { GoogleGenAI, Type } = require("@google/genai");

// This schema is copied from the original client-side service to ensure the backend
// requests the same structured data from the Gemini API.
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

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Set a 10MB limit for the entire request body string.
const MAX_PAYLOAD_SIZE_BYTES = 10 * 1024 * 1024; 

exports.handler = async (event) => {
    // Handle CORS preflight requests sent by browsers
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // No Content
            headers: CORS_HEADERS,
        };
    }
    
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: CORS_HEADERS,
            body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
        };
    }
    
    try {
        if (!event.body) {
             return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ ok: false, error: 'Request body is missing.' }) };
        }
        
        if (event.body.length > MAX_PAYLOAD_SIZE_BYTES) {
            return {
                statusCode: 413, // Payload Too Large
                headers: CORS_HEADERS,
                body: JSON.stringify({ ok: false, error: `Image payload is too large. Limit is ${Math.floor(MAX_PAYLOAD_SIZE_BYTES / 1024 / 1024)}MB.` }),
            };
        }
        
        const { base64Image, imageType } = JSON.parse(event.body);
        
        if (!base64Image || !imageType) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({ ok: false, error: 'Missing base64Image or imageType in request body.' }),
            };
        }
        
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
             console.error("GEMINI_API_KEY environment variable is not set for Netlify function.");
             return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ ok: false, error: 'Server configuration error: API key not found.' }) };
        }
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const imagePart = { inlineData: { mimeType: imageType, data: base64Image } };
        const textPart = { text: USER_PROMPT };
        
        const generateContentPromise = ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2
            }
        });

        // Race the API call against a 45-second timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request to generative AI service timed out after 45 seconds.')), 45000)
        );

        const response = await Promise.race([generateContentPromise, timeoutPromise]);

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ ok: true, data: parsedData }),
        };

    } catch (e) {
        console.error("Error in gemini Netlify function:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";

        // Return a specific status code for timeouts
        if (errorMessage.includes('timed out')) {
            return {
                statusCode: 504, // Gateway Timeout
                headers: CORS_HEADERS,
                body: JSON.stringify({ ok: false, error: errorMessage }),
            };
        }

        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ ok: false, error: `An internal server error occurred.` }),
        };
    }
};
