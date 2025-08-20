import React from 'react';
import { LogoIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        <header className="bg-theme-glass-bg backdrop-filter backdrop-blur-lg border-b border-theme-glass-border sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-3">
                        <LogoIcon className="w-8 h-8" />
                        <h1 className="text-xl font-bold text-theme-text tracking-wider font-cinzel">
                            Mystic Lore Garment Analyzer
                        </h1>
                    </div>
                    <button onClick={toggleTheme} className="p-2 rounded-full text-theme-highlight hover:bg-theme-text/10 transition-colors focus:outline-none focus:ring-2 focus:ring-theme-highlight">
                        {theme === 'light' ? (
                            <MoonIcon className="w-6 h-6" />
                        ) : (
                            <SunIcon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};