import React, { useState, useCallback, useRef } from 'react';
import { CameraIcon, UploadIcon } from './Icons';

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const SUPPORTED_FORMATS_TEXT = 'PNG, JPG, WEBP, or HEIC';

interface UploadScreenProps {
    onImageSelected: (file: File) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onImageSelected }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (SUPPORTED_MIME_TYPES.includes(file.type)) {
                onImageSelected(file);
            } else {
                alert(`Unsupported file type. Please use ${SUPPORTED_FORMATS_TEXT}.`);
            }
        }
    };

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setIsCameraActive(false);
            setStream(null);
        }
    }, [stream]);

    const startCamera = async () => {
        stopCamera();
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' },
                audio: false
            });
            setStream(mediaStream);
            setIsCameraActive(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            alert("Could not access the camera. Please ensure you have given the necessary permissions.");
        }
    };
    
    const handleCapture = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
                onImageSelected(file);
                stopCamera();
            }
        }, 'image/png');
    };

    return React.createElement('div', { className: 'w-full max-w-2xl text-center animate-fade-in' },
        React.createElement('div', { className: 'bg-theme-card-bg backdrop-blur-xl border border-theme-glass-border p-8 sm:p-12 rounded-[20px] shadow-xl' },
            React.createElement('h1', { className: 'text-3xl sm:text-4xl font-bold text-theme-text' }, "Let's get sewing"),
            React.createElement('p', { className: 'text-theme-text-muted mt-2' }, 'Upload a photo of a garment to begin generating your guide.'),
            isCameraActive ? (
                React.createElement('div', { className: 'mt-8' },
                    React.createElement('video', { ref: videoRef, autoPlay: true, playsInline: true, className: 'w-full rounded-lg bg-black' }),
                    React.createElement('div', { className: 'flex items-center justify-center gap-4 mt-4' },
                        React.createElement('button', { onClick: handleCapture, className: 'pill-button w-full text-white bg-theme-accent hover:opacity-90' }, 'Snap Photo'),
                        React.createElement('button', { onClick: stopCamera, className: 'pill-button w-full text-theme-text bg-theme-text/10 hover:bg-theme-text/20' }, 'Cancel')
                    )
                )
            ) : (
                React.createElement('div', { className: 'mt-8 grid sm:grid-cols-2 gap-6' },
                    React.createElement('button', { 
                        onClick: () => inputRef.current?.click(),
                        className: 'flex flex-col items-center justify-center gap-3 p-6 bg-theme-card-bg backdrop-blur-lg border border-theme-glass-border rounded-2xl text-theme-accent shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl hover:border-theme-highlight dark:hover:border-theme-accent'
                    },
                        React.createElement(UploadIcon, { className: 'w-8 h-8' }),
                        React.createElement('span', { className: 'font-semibold' }, 'Upload from Device'),
                        React.createElement('span', { className: 'text-xs text-theme-accent/80' }, SUPPORTED_FORMATS_TEXT)
                    ),
                    React.createElement('button', {
                        onClick: startCamera,
                        className: 'flex flex-col items-center justify-center gap-3 p-6 bg-theme-card-bg backdrop-blur-lg border border-theme-glass-border rounded-2xl text-theme-text shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl hover:border-theme-highlight dark:hover:border-theme-highlight'
                    },
                       React.createElement(CameraIcon, { className: 'w-8 h-8 text-theme-highlight' }),
                       React.createElement('span', { className: 'font-semibold' }, 'Use Camera'),
                       React.createElement('span', { className: 'text-xs text-theme-text-muted' }, 'For real-world items')
                    )
                )
            )
        ),
         React.createElement('input', {
            ref: inputRef,
            type: 'file',
            className: 'hidden',
            accept: SUPPORTED_MIME_TYPES.join(','),
            onChange: (e) => handleFileSelect(e.target.files)
        })
    );
};
