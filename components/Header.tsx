import React from 'https://esm.sh/react@18.3.1';
import { LogoIcon, MoonIcon, SunIcon } from './Icons.tsx';

interface HeaderProps {
    theme: string;
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        React.createElement('header', { className: 'bg-theme-glass-bg backdrop-filter backdrop-blur-lg border-b border-theme-glass-border sticky top-0 z-20' },
            React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:p-8' },
                React.createElement('div', { className: 'flex justify-between items-center py-4' },
                    React.createElement('div', { className: 'flex items-center gap-3' },
                        React.createElement(LogoIcon, { className: 'w-8 h-8' }),
                        React.createElement('h1', { className: 'text-xl font-bold text-theme-text tracking-wider font-cinzel' }, 'Mystic Lore Garment Analyzer')
                    ),
                    React.createElement('button', { onClick: toggleTheme, className: 'p-2 rounded-full text-theme-highlight hover:bg-theme-text/10 transition-colors focus:outline-none focus:ring-2 focus:ring-theme-highlight' },
                        theme === 'light' ? 
                        React.createElement(MoonIcon, { className: 'w-6 h-6' }) : 
                        React.createElement(SunIcon, { className: 'w-6 h-6' })
                    )
                )
            )
        )
    );
};
