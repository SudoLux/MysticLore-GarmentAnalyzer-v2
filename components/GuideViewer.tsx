import React, { useState, useMemo } from 'react';
import type { AiSewingResponse, GarmentAnalysis, PatternPiece, FabricAndNotions, SewingStep } from '../types';
import { SparklesIcon, RulerIcon, SwatchIcon, ScissorsIcon, CheckCircleIcon, DocumentArrowDownIcon, ArrowUturnLeftIcon } from './Icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface GuideViewerProps {
    guide: AiSewingResponse;
    imageFile: File;
    onReset: () => void;
}

type Tab = 'analysis' | 'patterns' | 'materials' | 'sewing';

const TABS: { id: Tab, name: string, icon: React.FC<{className?: string}> }[] = [
    { id: 'analysis', name: 'Analysis', icon: SparklesIcon },
    { id: 'patterns', name: 'Pattern Pieces', icon: RulerIcon },
    { id: 'materials', name: 'Materials', icon: SwatchIcon },
    { id: 'sewing', name: 'Sewing Guide', icon: ScissorsIcon },
];

// INTERACTIVE Content Components
const AnalysisContent: React.FC<{ analysis: GarmentAnalysis }> = ({ analysis }) => (
    <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
        <div className="md:col-span-2 p-5 rounded-2xl bg-theme-card-bg border border-theme-glass-border backdrop-blur-lg">
            <h3 className="text-lg font-semibold text-theme-text mb-3">Key Features</h3>
            <div className="flex flex-wrap gap-2">
                {analysis.keyFeatures.map((feature, i) => (
                    <span key={i} className="px-3 py-1 text-sm font-medium bg-theme-chip-bg text-theme-chip-text rounded-full">{feature}</span>
                ))}
            </div>
        </div>
        <div>
            <div className="bg-theme-accent-glass-bg backdrop-blur-lg border border-theme-accent-glass-border rounded-2xl p-4">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="w-6 h-6 text-theme-accent flex-shrink-0" />
                    <h4 className="font-semibold text-theme-accent">AI Insight</h4>
                </div>
                <p className="text-sm text-theme-accent/80 mt-2">{analysis.aiInsight}</p>
            </div>
        </div>
    </div>
);

const PatternsContent: React.FC<{ pieces: PatternPiece[] }> = ({ pieces }) => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {pieces.map((piece, i) => (
            <div key={i} className="bg-theme-card-bg backdrop-blur-lg p-5 rounded-2xl border border-theme-glass-border shadow-sm">
                <h4 className="font-semibold text-theme-text">{piece.name}</h4>
                <p className="text-sm text-theme-text-muted mt-1">{piece.description}</p>
            </div>
        ))}
    </div>
);

const MaterialsContent: React.FC<{ materials: FabricAndNotions }> = ({ materials }) => (
     <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
        <div>
            <h3 className="text-lg font-semibold text-theme-text mb-4">Fabric Suggestions</h3>
            <div className="space-y-4">
                {materials.fabricSuggestions.map((fab, i) => (
                    <div key={i} className="bg-theme-card-bg backdrop-blur-lg p-4 rounded-2xl border border-theme-glass-border">
                        <h4 className="font-semibold text-theme-text">{fab.name}</h4>
                        <p className="text-sm text-theme-text-muted mt-1">{fab.reason}</p>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-theme-text mb-4">Notions & Tools</h3>
            <div className="bg-theme-card-bg backdrop-blur-lg p-5 rounded-2xl border border-theme-glass-border">
                <ul className="space-y-2">
                    {materials.notions.map((notion, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-theme-text">
                            <div className="w-1 h-1 bg-theme-text-muted rounded-full"></div>
                            {notion}
                        </li>
                    ))}
                </ul>
                <div className="border-t border-theme-glass-border my-4"></div>
                <h4 className="font-semibold text-theme-text">Seam Allowance</h4>
                <p className="text-sm text-theme-text-muted mt-1">{materials.recommendedSeamAllowance}</p>
            </div>
        </div>
    </div>
);

const SewingContent: React.FC<{ steps: SewingStep[], completedSteps: Set<number>, onStepToggle: (step: number) => void }> = ({ steps, completedSteps, onStepToggle }) => (
    <div className="animate-fade-in max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-text">Construction Steps</h3>
            <p className="text-sm font-medium text-theme-text-muted">{completedSteps.size} of {steps.length} completed</p>
        </div>
        <div className="w-full bg-theme-progress-bg rounded-full h-2 mb-6">
            <div className="bg-theme-accent h-2 rounded-full transition-all duration-300" style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}></div>
        </div>
        <div className="space-y-4">
            {steps.map(step => (
                <button key={step.step} onClick={() => onStepToggle(step.step)} className="w-full text-left flex gap-4 items-start p-4 bg-theme-card-bg backdrop-blur-lg rounded-2xl border border-theme-glass-border shadow-sm hover:border-theme-accent/50 transition-colors">
                    <CheckCircleIcon className={`w-8 h-8 flex-shrink-0 mt-0.5 transition-colors ${completedSteps.has(step.step) ? 'text-theme-highlight' : 'text-theme-text/20'}`} />
                    <div>
                        <p className="font-semibold text-theme-text">{step.step}. {step.title}</p>
                        <p className="text-sm text-theme-text-muted mt-1">{step.details}</p>
                    </div>
                </button>
            ))}
        </div>
    </div>
);


export const GuideViewer: React.FC<GuideViewerProps> = ({ guide, imageFile, onReset }) => {
    const [activeTab, setActiveTab] = useState<Tab>('analysis');
    const imageUrl = useMemo(() => URL.createObjectURL(imageFile), [imageFile]);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [isExporting, setIsExporting] = useState(false);

    const handleStepToggle = (stepNumber: number) => {
        setCompletedSteps(prev => {
            const newSet = new Set(prev);
            if (newSet.has(stepNumber)) {
                newSet.delete(stepNumber);
            } else {
                newSet.add(stepNumber);
            }
            return newSet;
        });
    };
    
    const handleExportPdf = async () => {
        setIsExporting(true);
        document.body.classList.add('pdf-export-mode');
        await new Promise(resolve => setTimeout(resolve, 100));

        const printableElement = document.getElementById('printable-guide');
        if (!printableElement) {
            setIsExporting(false);
            document.body.classList.remove('pdf-export-mode');
            console.error("Printable element not found");
            return;
        }

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const pageElements = Array.from(printableElement.querySelectorAll<HTMLElement>('.pdf-page'));

            for (let i = 0; i < pageElements.length; i++) {
                const page = pageElements[i];
                const canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    width: page.offsetWidth,
                    height: page.offsetHeight,
                });
                
                const imgData = canvas.toDataURL('image/jpeg', 0.98);

                if (i > 0) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }

            const fileName = `sewing-guide-${guide.garmentAnalysis.identifiedGarment.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            pdf.save(fileName);

        } catch (error) {
            console.error("Failed to export PDF:", error);
            alert("Sorry, there was an issue creating the PDF. Please try again.");
        } finally {
            document.body.classList.remove('pdf-export-mode');
            setIsExporting(false);
        }
    };
    
    const interactiveView = (
        <div className="w-full animate-fade-in flex flex-col max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
                <div className="md:w-1/3 flex-shrink-0">
                    <img src={imageUrl} alt={imageFile.name} className="w-full rounded-[20px] object-cover aspect-[4/5] bg-theme-progress-bg shadow-lg border border-theme-glass-border" />
                </div>
                <div className="flex-grow flex flex-col">
                    <p className="text-theme-accent dark:text-theme-highlight font-semibold">{guide.garmentAnalysis.styleCategory}</p>
                    <h1 className="text-3xl lg:text-4xl font-bold text-theme-text mt-1">{guide.garmentAnalysis.identifiedGarment}</h1>
                    <p className="text-theme-text-muted mt-3 text-base leading-relaxed">{guide.garmentAnalysis.garmentDescription}</p>
                    <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
                         <button onClick={onReset} className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-theme-text bg-theme-text/10 border border-theme-glass-border rounded-full hover:bg-theme-text/20 transition-colors">
                            <ArrowUturnLeftIcon className="w-4 h-4"/>
                            <span>Start Over</span>
                        </button>
                        <button onClick={handleExportPdf} disabled={isExporting} className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-theme-accent rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait">
                             <DocumentArrowDownIcon className="w-4 h-4"/>
                             <span>{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-b border-theme-glass-border">
                <nav className="-mb-px flex gap-6" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-theme-highlight text-theme-highlight' : 'border-transparent text-theme-text-muted hover:text-theme-highlight hover:border-theme-highlight/50'} flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                           <tab.icon className="w-5 h-5" />
                           {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="py-8 bg-theme-card-bg/50 backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-px rounded-b-[20px] border-x border-b border-theme-glass-border">
                {activeTab === 'analysis' && <AnalysisContent analysis={guide.garmentAnalysis} />}
                {activeTab === 'patterns' && <PatternsContent pieces={guide.patternPieces} />}
                {activeTab === 'materials' && <MaterialsContent materials={guide.fabricAndNotions} />}
                {activeTab === 'sewing' && <SewingContent steps={guide.sewingSteps} completedSteps={completedSteps} onStepToggle={handleStepToggle} />}
            </div>
        </div>
    );

    // Simplified, compact JSX for the printable PDF version
    const printableGuide = (
        <div id="printable-guide">
            {/* Page 1: Overview */}
            <div className="pdf-page">
                 <div className="flex gap-8 mb-6">
                    {/* Left Column */}
                    <div className="w-[38%] flex-shrink-0">
                        <img src={imageUrl} alt={imageFile.name} className="w-full rounded-lg" />
                    </div>
                    {/* Right Column */}
                    <div className="flex-grow flex flex-col">
                        <p className="pdf-garment-category">{guide.garmentAnalysis.styleCategory}</p>
                        <h1>{guide.garmentAnalysis.identifiedGarment}</h1>
                        <p>{guide.garmentAnalysis.garmentDescription}</p>
                    </div>
                </div>
                
                <div className="mb-6">
                   <h3>Key Features</h3>
                   <ul className="list-disc list-inside space-y-1 mt-2">
                       {guide.garmentAnalysis.keyFeatures.map((feature, i) => (
                           <li key={i}>{feature}</li>
                       ))}
                   </ul>
                </div>

                <div>
                   <h3>AI Insight</h3>
                   <p className="mt-2">{guide.garmentAnalysis.aiInsight}</p>
                </div>
            </div>

            {/* Page 2: Patterns & Materials */}
            <div className="pdf-page">
                <h2>Pattern Pieces</h2>
                <div className="grid grid-cols-2 gap-6">
                    {guide.patternPieces.map((piece, i) => (
                        <div key={i}>
                            <h4>{piece.name}</h4>
                            <p>{piece.description}</p>
                        </div>
                    ))}
                </div>

                <h2 className="mt-8">Materials & Notions</h2>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3>Fabric Suggestions</h3>
                        <div className="space-y-4">
                            {guide.fabricAndNotions.fabricSuggestions.map((fab, i) => (
                                <div key={i}>
                                    <h4>{fab.name}</h4>
                                    <p>{fab.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3>Notions & Tools</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {guide.fabricAndNotions.notions.map((notion, i) => <li key={i}>{notion}</li>)}
                        </ul>
                        <h4 className="mt-4">Seam Allowance</h4>
                        <p>{guide.fabricAndNotions.recommendedSeamAllowance}</p>
                    </div>
                </div>
            </div>

            {/* Page 3: Sewing Steps */}
            <div className="pdf-page">
                <h2>Sewing Guide</h2>
                <div className="pdf-sewing-steps-grid">
                    {guide.sewingSteps.map(step => (
                        <div key={step.step}>
                            <p className="font-semibold">{step.step}. {step.title}</p>
                            <p className="mt-1">{step.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto">
            {interactiveView}
            <div className={isExporting ? '' : 'hidden'}>
                {printableGuide}
            </div>
        </div>
    );
};