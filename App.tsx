
import React, { useState, useCallback, useEffect } from 'https://esm.sh/react@18.3.1';
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.14.0";
import { Header } from './components/Header.tsx';
import { UploadScreen } from './components/UploadScreen.tsx';
import { Loader } from './components/Loader.tsx';
import { GuideViewer } from './components/GuideViewer.tsx';
import { WarningIcon } from './components/Icons.tsx';
import { generateSewingGuideFromImage } from './services/geminiService.ts';
import { SewingGuide } from './types.ts';

// --- AI Initialization ---
let ai: GoogleGenAI | null = null;
let apiKeyInitializationError: string | null = null;
try {
    // The API key is provided via the process.env.API_KEY environment variable.
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY environment variable is not set. Please configure it in your deployment settings.");
    }
    ai = new GoogleGenAI({ apiKey: API_KEY });
} catch (e: unknown) {
    console.error(e);
    apiKeyInitializationError = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
}

const App = () => {
    const [theme, setTheme] = useState('light');
    const [screen, setScreen] = useState<'upload' | 'loading' | 'results' | 'error'>('upload');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [sewingGuide, setSewingGuide] = useState<SewingGuide | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);

    const handleImageSelected = useCallback((file: File) => {
        if (!ai) {
            setError(apiKeyInitializationError || "Gemini AI client is not initialized.");
            setScreen('error');
            return;
        }
        setImageFile(file);
        setSewingGuide(null);
        setError(null);
        setScreen('loading');

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                if (typeof reader.result !== 'string') {
                    throw new Error('Failed to read file as base64 string.');
                }
                const base64Image = reader.result.split(',')[1];
                const imageType = file.type;
                const generatedGuide = await generateSewingGuideFromImage(ai!, base64Image, imageType);
                setSewingGuide(generatedGuide);
                setScreen('results');
            } catch (err: unknown) {
                console.error(err);
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(errorMessage);
                setScreen('error');
            }
        };
        reader.onerror = () => {
             setError("Could not read the selected file.");
             setScreen('error');
        };
    }, []);

    const handleReset = useCallback(() => {
        setScreen('upload');
        setImageFile(null);
        setSewingGuide(null);
        setError(null);
    }, []);
    
    const renderContent = () => {
        if (apiKeyInitializationError) {
            return React.createElement('div', { className: 'text-center p-8 bg-theme-card-bg backdrop-blur-lg rounded-[20px] border border-theme-glass-border animate-fade-in max-w-lg shadow-xl' },
                React.createElement(WarningIcon, { className: 'w-12 h-12 text-theme-error mx-auto' }),
                React.createElement('h2', { className: 'mt-4 text-xl font-bold text-theme-text' }, 'Configuration Error'),
                React.createElement('p', { className: 'mt-2 text-sm text-theme-text-muted' }, apiKeyInitializationError),
            );
        }

        if (!ai) {
            return React.createElement(Loader, null);
        }

        switch (screen) {
            case 'upload':
                return React.createElement(UploadScreen, { onImageSelected: handleImageSelected });
            case 'loading':
                return React.createElement(Loader, null);
            case 'results':
                if (sewingGuide && imageFile) {
                    return React.createElement(GuideViewer, { guide: sewingGuide, imageFile: imageFile, onReset: handleReset });
                }
                setError("Something went wrong displaying the results.");
                setScreen('error');
                return null;
            case 'error':
                return React.createElement('div', { className: 'text-center p-8 bg-theme-card-bg backdrop-blur-lg rounded-[20px] border border-theme-glass-border animate-fade-in max-w-lg shadow-xl' },
                    React.createElement(WarningIcon, { className: 'w-12 h-12 text-theme-error mx-auto' }),
                    React.createElement('h2', { className: 'mt-4 text-xl font-bold text-theme-text' }, 'Analysis Failed'),
                    React.createElement('p', { className: 'mt-2 text-sm text-theme-text-muted' }, error || "An unknown error occurred."),
                    React.createElement('button', { onClick: handleReset, className: 'mt-6 pill-button bg-theme-accent text-white hover:opacity-90' }, 'Try Again')
                );
            default:
                return null;
        }
    };

    return React.createElement('div', { className: 'min-h-screen flex flex-col' },
        React.createElement(Header, { theme, toggleTheme }),
        React.createElement('main', { className: 'flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8' },
            renderContent()
        )
    );
};

export default App;
