import React from 'react';
import { SparklesIcon } from './Icons';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
             <div className="relative">
                 <svg className="animate-spin h-16 w-16 text-theme-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <SparklesIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-theme-accent opacity-75"/>
             </div>
            <p className="mt-6 font-semibold text-lg text-theme-text">Analyzing your garment...</p>
            <p className="text-sm text-theme-text-muted max-w-xs">Our AI is drafting patterns and preparing your personalized sewing guide. This may take a moment.</p>
        </div>
    );
};