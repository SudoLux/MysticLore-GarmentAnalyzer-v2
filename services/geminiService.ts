
import { SewingGuide } from "../types";

/**
 * Resizes an image file to a maximum dimension while maintaining aspect ratio.
 * @param file The image file to resize.
 * @param maxDimension The maximum width or height of the resized image.
 * @returns A promise that resolves with the base64-encoded image data and its MIME type.
 */
const resizeImage = (file: File, maxDimension: number): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            if (!event.target?.result) {
                return reject(new Error("Could not read file."));
            }
            const img = new Image();
            img.src = event.target.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > height) {
                    if (width > maxDimension) {
                        height = Math.round(height * (maxDimension / width));
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = Math.round(width * (maxDimension / height));
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context for image resizing.'));
                }
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL(file.type);
                const base64 = dataUrl.split(',')[1];
                resolve({ base64, mimeType: file.type });
            };
            img.onerror = (err) => reject(new Error(`Image could not be loaded for resizing: ${err}`));
        };
        reader.onerror = (err) => reject(new Error(`File could not be read: ${err}`));
    });
};


/**
 * Sends an image to the backend Netlify function for analysis by the Gemini API.
 * @param file The image file of the garment.
 * @param signal An AbortSignal to allow for request cancellation (e.g., on timeout).
 * @returns A promise that resolves with the generated SewingGuide.
 */
export const generateSewingGuideFromImage = async (file: File, signal: AbortSignal): Promise<SewingGuide> => {
    // Resize the image to prevent excessively large payloads
    const { base64: base64Image, mimeType: imageType } = await resizeImage(file, 1600);

    const body = JSON.stringify({ base64Image, imageType });

    try {
        const response = await fetch('/.netlify/functions/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            signal, // Pass the AbortSignal to the fetch request
        });

        if (!response.ok) {
            let errorMsg = `Error: ${response.status} ${response.statusText}`;
            try {
                // Try to parse a more specific error message from the backend
                const errorJson = await response.json();
                if (errorJson.error) {
                    errorMsg = errorJson.error;
                }
            } catch (e) {
                // Ignore if response body is not JSON or empty
            }
            throw new Error(errorMsg);
        }

        const result = await response.json();
        
        if (!result.ok) {
            throw new Error(result.error || 'The analysis failed due to an unknown server error.');
        }

        if (!result.data || !result.data.garmentAnalysis) {
            throw new Error("Received invalid or incomplete guide data from the server.");
        }

        return result.data as SewingGuide;

    } catch (e) {
        // Log the error and re-throw it to be handled by the UI component
        if (e instanceof Error && e.name !== 'AbortError') {
             console.error("Error calling backend function:", e);
        }
        throw e;
    }
};
