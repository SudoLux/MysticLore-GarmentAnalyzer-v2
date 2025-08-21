import React from 'react';

interface IconProps {
    className?: string;
}

export const LOGO_SOURCE = '';

export const LogoIcon: React.FC<IconProps> = ({ className }) => {
    if (LOGO_SOURCE) {
        return React.createElement('img', { src: LOGO_SOURCE, alt: 'Logo', className });
    }
    return React.createElement('svg', {
        className,
        viewBox: '0 0 100 100',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        stroke: 'currentColor',
        strokeWidth: '4'
    },
        React.createElement('path', { d: 'M50 10 L90 50 L50 90 L10 50 Z', strokeLinecap: 'round', strokeLinejoin: 'round' }),
        React.createElement('path', { d: 'M50 10 V 90', strokeLinecap: 'round', strokeLinejoin: 'round' }),
        React.createElement('path', { d: 'M10 50 H 90', strokeLinecap: 'round', strokeLinejoin: 'round' }),
        React.createElement('path', { d: 'M20 30 L80 70', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }),
        React.createElement('path', { d: 'M20 70 L80 30', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' })
    );
};

export const SunIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' })
);

export const MoonIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z' })
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, 'aria-hidden': 'true', xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 20 16' },
    React.createElement('path', { stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2' })
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z' }),
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z' })
);

export const WarningIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' })
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.4-1.4L13.063 18l1.188-.648a2.25 2.25 0 011.4 1.4l.648 1.188z' })
);

export const RulerIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125' })
);

export const SwatchIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' })
);

export const ScissorsIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M7.843 16.237a3.375 3.375 0 004.326 4.326l9.528-9.528a3.375 3.375 0 00-4.326-4.326L7.843 16.237z' }),
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M16.16 3.837a3.375 3.375 0 00-4.326 4.326l5.483 5.483a3.375 3.375 0 004.326-4.326l-5.483-5.483z' }),
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9 21a3 3 0 100-6 3 3 0 000 6z' }),
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M15 15a3 3 0 100-6 3 3 0 000 6z' })
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
);

export const DocumentArrowDownIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' })
);

export const ArrowUturnLeftIcon: React.FC<IconProps> = ({ className }) => React.createElement('svg', { className, xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', strokeWidth: 1.5, stroke: 'currentColor' },
    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3' })
);
