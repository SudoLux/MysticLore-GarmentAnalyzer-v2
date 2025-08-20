import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadScreen } from './components/UploadScreen';
import { GuideViewer } from './components/GuideViewer';
import { Loader } from './components/Loader';
import { WarningIcon } from './components/Icons';
import { generateSewingGuideFromImage } from './services/geminiService';
import type { AiSewingResponse } from './types';

type Theme = 'light' | 'dark';
type Screen = 'upload' | 'loading' | 'results' | 'error';

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('light');
    const [screen, setScreen] = useState<Screen>('upload');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [sewingGuide, setSewingGuide] = useState<AiSewingResponse | null>(null);
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
                const generatedGuide = await generateSewingGuideFromImage(base64Image, imageType);
                setSewingGuide(generatedGuide);
                setScreen('results');
            } catch (err) {
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
        switch (screen) {
            case 'upload':
                return <UploadScreen onImageSelected={handleImageSelected} />;
            case 'loading':
                return <Loader />;
            case 'results':
                if (sewingGuide && imageFile) {
                    return <GuideViewer guide={sewingGuide} imageFile={imageFile} onReset={handleReset} />;
                }
                // Fallback to error if state is inconsistent
                setError("Something went wrong displaying the results.");
                setScreen('error');
                return null;
            case 'error':
                return (
                     <div className="text-center p-8 bg-theme-card-bg backdrop-blur-lg rounded-[20px] border border-theme-glass-border animate-fade-in max-w-lg shadow-xl">
                        <WarningIcon className="w-12 h-12 text-theme-error mx-auto" />
                        <h2 className="mt-4 text-xl font-bold text-theme-text">Analysis Failed</h2>
                        <p className="mt-2 text-sm text-theme-text-muted">{error || "An unknown error occurred."}</p>
                        <button onClick={handleReset} className="mt-6 pill-button bg-theme-accent text-white hover:opacity-90">
                            Try Again
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;