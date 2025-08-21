
import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './Icons.tsx';

const loadingMessages = [
    'Our AI is drafting patterns and preparing your personalized sewing guide.',
    'Unspooling the thread of creativity...',
    'Our digital tailor is taking measurements...',
    'Selecting the perfect fabric suggestions...',
    'Stitching the instructions together, this may take a moment.'
];

export const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);


    return React.createElement('div', { className: 'flex flex-col items-center justify-center text-center p-8 animate-fade-in' },
        React.createElement('div', { className: 'relative' },
            React.createElement('svg', { className: 'animate-spin h-16 w-16 text-theme-accent', xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24' },
                React.createElement('circle', { className: 'opacity-25', cx: '12', cy: '12', r: '10', stroke: 'currentColor', strokeWidth: '4' }),
                React.createElement('path', { className: 'opacity-75', fill: 'currentColor', d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' })
            ),
            React.createElement(SparklesIcon, { className: 'w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-theme-accent opacity-75' })
        ),
        React.createElement('p', { className: 'mt-6 font-semibold text-lg text-theme-text' }, 'Analyzing your garment...'),
        React.createElement('p', { className: 'text-sm text-theme-text-muted max-w-xs' }, loadingMessages[messageIndex])
    );
};
