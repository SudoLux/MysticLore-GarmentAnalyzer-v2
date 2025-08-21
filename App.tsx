
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { UploadScreen } from './components/UploadScreen.tsx';
import { Loader } from './components/Loader.tsx';
import { GuideViewer } from './components/GuideViewer.tsx';
import { WarningIcon } from './components/Icons.tsx';
import { generateSewingGuideFromImage } from './services/geminiService.ts';
import { SewingGuide } from './types.ts';

const App = () => {
    const [theme, setTheme] = useState('light');
    const [screen, setScreen] = useState<'upload' | 'loading' | 'results' | 'error'>('upload');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [sewingGuide, setSewingGuide] = useState<SewingGuide | null>(null);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);
    
    useEffect(() => {
        // Cleanup function to abort any in-flight request when the component unmounts.
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);
    
    const handleReset = useCallback(() => {
        abortControllerRef.current?.abort(); // Abort any ongoing request
        setScreen('upload');
        setImageFile(null);
        setSewingGuide(null);
        setError(null);
    }, []);

    const handleImageSelected = useCallback(async (file: File) => {
        setScreen('loading');
        setImageFile(file);
        setSewingGuide(null);
        setError(null);

        abortControllerRef.current = new AbortController();

        try {
            const generatedGuide = await generateSewingGuideFromImage(file, abortControllerRef.current.signal);
            setSewingGuide(generatedGuide);
            setScreen('results');
        } catch (err: unknown) {
            // Check if the error is from an intentional abort, and if so, don't show an error screen.
            if (err instanceof Error && err.name === 'AbortError') {
                console.log('Request was aborted.');
                return; 
            }
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setScreen('error');
        } finally {
            abortControllerRef.current = null;
        }
    }, [handleReset]);
    
    const renderContent = () => {
        switch (screen) {
            case 'upload':
                return React.createElement(UploadScreen, { onImageSelected: handleImageSelected });
            case 'loading':
                return React.createElement(Loader, null);
            case 'results':
                if (sewingGuide && imageFile) {
                    return React.createElement(GuideViewer, { guide: sewingGuide, imageFile: imageFile, onReset: handleReset });
                }
                // Fallback to error if results are expected but not present
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
