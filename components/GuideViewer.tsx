import React, { useState, useMemo } from 'https://esm.sh/react@18.3.1';
import jsPDF from 'https://esm.sh/jspdf@2.5.1';
import html2canvas from 'https://esm.sh/html2canvas@1.4.1';
import { SewingGuide, GarmentAnalysis, PatternPiece, FabricAndNotions, SewingStep } from '../types.ts';
import { ArrowUturnLeftIcon, CheckCircleIcon, DocumentArrowDownIcon, RulerIcon, ScissorsIcon, SparklesIcon, SwatchIcon } from './Icons.tsx';

const TABS = [
    { id: 'analysis', name: 'Analysis', icon: SparklesIcon },
    { id: 'patterns', name: 'Pattern Pieces', icon: RulerIcon },
    { id: 'materials', name: 'Materials', icon: SwatchIcon },
    { id: 'sewing', name: 'Sewing Guide', icon: ScissorsIcon },
];

const AnalysisContent: React.FC<{ analysis: GarmentAnalysis }> = ({ analysis }) => (
    React.createElement('div', { className: 'grid md:grid-cols-3 gap-6 animate-fade-in' },
        React.createElement('div', { className: 'md:col-span-2 p-5 rounded-2xl bg-theme-card-bg border border-theme-glass-border backdrop-blur-lg' },
            React.createElement('h3', { className: 'text-lg font-semibold text-theme-text mb-3' }, 'Key Features'),
            React.createElement('div', { className: 'flex flex-wrap gap-2' },
                analysis.keyFeatures.map((feature, i) => React.createElement('span', { key: i, className: 'px-3 py-1 text-sm font-medium bg-theme-chip-bg text-theme-chip-text rounded-full' }, feature))
            )
        ),
        React.createElement('div', null,
            React.createElement('div', { className: 'bg-theme-accent-glass-bg backdrop-blur-lg border border-theme-accent-glass-border rounded-2xl p-4' },
                React.createElement('div', { className: 'flex items-center gap-3' },
                    React.createElement(SparklesIcon, { className: 'w-6 h-6 text-theme-accent flex-shrink-0' }),
                    React.createElement('h4', { className: 'font-semibold text-theme-accent' }, 'AI Insight')
                ),
                React.createElement('p', { className: 'text-sm text-theme-accent/80 mt-2' }, analysis.aiInsight)
            )
        )
    )
);

const PatternsContent: React.FC<{ pieces: PatternPiece[] }> = ({ pieces }) => (
    React.createElement('div', { className: 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in' },
        pieces.map((piece, i) => (
            React.createElement('div', { key: i, className: 'bg-theme-card-bg backdrop-blur-lg p-5 rounded-2xl border border-theme-glass-border shadow-sm' },
                React.createElement('h4', { className: 'font-semibold text-theme-text' }, piece.name),
                React.createElement('p', { className: 'text-sm text-theme-text-muted mt-1' }, piece.description)
            )
        ))
    )
);

const MaterialsContent: React.FC<{ materials: FabricAndNotions }> = ({ materials }) => (
     React.createElement('div', { className: 'grid md:grid-cols-2 gap-8 animate-fade-in' },
        React.createElement('div', null,
            React.createElement('h3', { className: 'text-lg font-semibold text-theme-text mb-4' }, 'Fabric Suggestions'),
            React.createElement('div', { className: 'space-y-4' },
                materials.fabricSuggestions.map((fab, i) => (
                    React.createElement('div', { key: i, className: 'bg-theme-card-bg backdrop-blur-lg p-4 rounded-2xl border border-theme-glass-border' },
                        React.createElement('h4', { className: 'font-semibold text-theme-text' }, fab.name),
                        React.createElement('p', { className: 'text-sm text-theme-text-muted mt-1' }, fab.reason)
                    )
                ))
            )
        ),
        React.createElement('div', null,
            React.createElement('h3', { className: 'text-lg font-semibold text-theme-text mb-4' }, 'Notions & Tools'),
            React.createElement('div', { className: 'bg-theme-card-bg backdrop-blur-lg p-5 rounded-2xl border border-theme-glass-border' },
                React.createElement('ul', { className: 'space-y-2' },
                    materials.notions.map((notion, i) => (
                        React.createElement('li', { key: i, className: 'flex items-center gap-3 text-sm text-theme-text' },
                            React.createElement('div', { className: 'w-1 h-1 bg-theme-text-muted rounded-full' }),
                            notion
                        )
                    ))
                ),
                React.createElement('div', { className: 'border-t border-theme-glass-border my-4' }),
                React.createElement('h4', { className: 'font-semibold text-theme-text' }, 'Seam Allowance'),
                React.createElement('p', { className: 'text-sm text-theme-text-muted mt-1' }, materials.recommendedSeamAllowance)
            )
        )
    )
);

const SewingContent: React.FC<{ steps: SewingStep[]; completedSteps: Set<number>; onStepToggle: (stepNumber: number) => void; }> = ({ steps, completedSteps, onStepToggle }) => (
    React.createElement('div', { className: 'animate-fade-in max-w-3xl mx-auto' },
        React.createElement('div', { className: 'flex items-center justify-between mb-4' },
            React.createElement('h3', { className: 'text-lg font-semibold text-theme-text' }, 'Construction Steps'),
            React.createElement('p', { className: 'text-sm font-medium text-theme-text-muted' }, `${completedSteps.size} of ${steps.length} completed`)
        ),
        React.createElement('div', { className: 'w-full bg-theme-progress-bg rounded-full h-2 mb-6' },
            React.createElement('div', { className: 'bg-theme-accent h-2 rounded-full transition-all duration-300', style: { width: `${(completedSteps.size / steps.length) * 100}%` } })
        ),
        React.createElement('div', { className: 'space-y-4' },
            steps.map(step => (
                React.createElement('button', { key: step.step, onClick: () => onStepToggle(step.step), className: 'w-full text-left flex gap-4 items-start p-4 bg-theme-card-bg backdrop-blur-lg rounded-2xl border border-theme-glass-border shadow-sm hover:border-theme-accent/50 transition-colors' },
                    React.createElement(CheckCircleIcon, { className: `w-8 h-8 flex-shrink-0 mt-0.5 transition-colors ${completedSteps.has(step.step) ? 'text-theme-highlight' : 'text-theme-text/20'}` }),
                    React.createElement('div', null,
                        React.createElement('p', { className: 'font-semibold text-theme-text' }, `${step.step}. ${step.title}`),
                        React.createElement('p', { className: 'text-sm text-theme-text-muted mt-1' }, step.details)
                    )
                )
            ))
        )
    )
);

interface GuideViewerProps {
    guide: SewingGuide;
    imageFile: File;
    onReset: () => void;
}

export const GuideViewer: React.FC<GuideViewerProps> = ({ guide, imageFile, onReset }) => {
    const [activeTab, setActiveTab] = useState('analysis');
    const imageUrl = useMemo(() => URL.createObjectURL(imageFile), [imageFile]);
    const [completedSteps, setCompletedSteps] = useState(new Set<number>());
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
            const pageElements = Array.from(printableElement.querySelectorAll('.pdf-page'));

            for (let i = 0; i < pageElements.length; i++) {
                const page = pageElements[i] as HTMLElement;
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
    
    const interactiveView = React.createElement('div', { className: 'w-full animate-fade-in flex flex-col max-w-7xl mx-auto' },
        React.createElement('div', { className: 'flex flex-col md:flex-row gap-6 md:gap-8 mb-8' },
            React.createElement('div', { className: 'md:w-1/3 flex-shrink-0' },
                React.createElement('img', { src: imageUrl, alt: imageFile.name, className: 'w-full rounded-[20px] object-cover aspect-[4/5] bg-theme-progress-bg shadow-lg border border-theme-glass-border' })
            ),
            React.createElement('div', { className: 'flex-grow flex flex-col' },
                React.createElement('p', { className: 'text-theme-accent dark:text-theme-highlight font-semibold' }, guide.garmentAnalysis.styleCategory),
                React.createElement('h1', { className: 'text-3xl lg:text-4xl font-bold text-theme-text mt-1' }, guide.garmentAnalysis.identifiedGarment),
                React.createElement('p', { className: 'text-theme-text-muted mt-3 text-base leading-relaxed' }, guide.garmentAnalysis.garmentDescription),
                React.createElement('div', { className: 'mt-auto pt-6 flex flex-col sm:flex-row gap-3' },
                     React.createElement('button', { onClick: onReset, className: 'flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-theme-text bg-theme-text/10 border border-theme-glass-border rounded-full hover:bg-theme-text/20 transition-colors' },
                        React.createElement(ArrowUturnLeftIcon, { className: 'w-4 h-4' }),
                        React.createElement('span', null, 'Start Over')
                    ),
                    React.createElement('button', { onClick: handleExportPdf, disabled: isExporting, className: 'flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-theme-accent rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait' },
                         React.createElement(DocumentArrowDownIcon, { className: 'w-4 h-4' }),
                         React.createElement('span', null, isExporting ? 'Generating PDF...' : 'Export PDF')
                    )
                )
            )
        ),
        React.createElement('div', { className: 'border-b border-theme-glass-border' },
            React.createElement('nav', { className: '-mb-px flex gap-6', 'aria-label': 'Tabs' },
                TABS.map(tab => React.createElement('button', { key: tab.id, onClick: () => setActiveTab(tab.id), className: `${activeTab === tab.id ? 'border-theme-highlight text-theme-highlight' : 'border-transparent text-theme-text-muted hover:text-theme-highlight hover:border-theme-highlight/50'} flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors` },
                   React.createElement(tab.icon, { className: 'w-5 h-5' }),
                   tab.name
                ))
            )
        ),
        React.createElement('div', { className: 'py-8 bg-theme-card-bg/50 backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-px rounded-b-[20px] border-x border-b border-theme-glass-border' },
            activeTab === 'analysis' && React.createElement(AnalysisContent, { analysis: guide.garmentAnalysis }),
            activeTab === 'patterns' && React.createElement(PatternsContent, { pieces: guide.patternPieces }),
            activeTab === 'materials' && React.createElement(MaterialsContent, { materials: guide.fabricAndNotions }),
            activeTab === 'sewing' && React.createElement(SewingContent, { steps: guide.sewingSteps, completedSteps, onStepToggle: handleStepToggle })
        )
    );

    const printableGuide = React.createElement('div', { id: 'printable-guide' },
        React.createElement('div', { className: 'pdf-page' },
             React.createElement('div', { className: 'flex gap-8 mb-6' },
                React.createElement('div', { className: 'w-[38%] flex-shrink-0' },
                    React.createElement('img', { src: imageUrl, alt: imageFile.name, className: 'w-full rounded-lg' })
                ),
                React.createElement('div', { className: 'flex-grow flex flex-col' },
                    React.createElement('p', { className: 'pdf-garment-category' }, guide.garmentAnalysis.styleCategory),
                    React.createElement('h1', null, guide.garmentAnalysis.identifiedGarment),
                    React.createElement('p', null, guide.garmentAnalysis.garmentDescription)
                )
            ),
            React.createElement('div', { className: 'mb-6' },
               React.createElement('h3', null, 'Key Features'),
               React.createElement('ul', { className: 'list-disc list-inside space-y-1 mt-2' },
                   guide.garmentAnalysis.keyFeatures.map((feature, i) => React.createElement('li', { key: i }, feature))
               )
            ),
            React.createElement('div', null,
               React.createElement('h3', null, 'AI Insight'),
               React.createElement('p', { className: 'mt-2' }, guide.garmentAnalysis.aiInsight)
            )
        ),
        React.createElement('div', { className: 'pdf-page' },
            React.createElement('h2', null, 'Pattern Pieces'),
            React.createElement('div', { className: 'grid grid-cols-2 gap-6' },
                guide.patternPieces.map((piece, i) => (
                    React.createElement('div', { key: i },
                        React.createElement('h4', null, piece.name),
                        React.createElement('p', null, piece.description)
                    )
                ))
            ),
            React.createElement('h2', { className: 'mt-8' }, 'Materials & Notions'),
            React.createElement('div', { className: 'grid grid-cols-2 gap-8' },
                React.createElement('div', null,
                    React.createElement('h3', null, 'Fabric Suggestions'),
                    React.createElement('div', { className: 'space-y-4' },
                        guide.fabricAndNotions.fabricSuggestions.map((fab, i) => (
                            React.createElement('div', { key: i },
                                React.createElement('h4', null, fab.name),
                                React.createElement('p', null, fab.reason)
                            )
                        ))
                    )
                ),
                React.createElement('div', null,
                    React.createElement('h3', null, 'Notions & Tools'),
                    React.createElement('ul', { className: 'list-disc list-inside space-y-1' },
                        guide.fabricAndNotions.notions.map((notion, i) => React.createElement('li', { key: i }, notion))
                    ),
                    React.createElement('h4', { className: 'mt-4' }, 'Seam Allowance'),
                    React.createElement('p', null, guide.fabricAndNotions.recommendedSeamAllowance)
                )
            )
        ),
        React.createElement('div', { className: 'pdf-page' },
            React.createElement('h2', null, 'Sewing Guide'),
            React.createElement('div', { className: 'pdf-sewing-steps-grid' },
                guide.sewingSteps.map(step => (
                    React.createElement('div', { key: step.step },
                        React.createElement('p', { className: 'font-semibold' }, `${step.step}. ${step.title}`),
                        React.createElement('p', { className: 'mt-1' }, step.details)
                    )
                ))
            )
        )
    );

    return (
        React.createElement('div', { className: 'w-full max-w-7xl mx-auto' },
            interactiveView,
            React.createElement('div', { className: isExporting ? '' : 'hidden' },
                printableGuide
            )
        )
    );
};
