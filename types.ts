export interface GarmentAnalysis {
    identifiedGarment: string;
    garmentDescription: string;
    keyFeatures: string[];
    styleCategory: string;
    aiInsight: string;
}

export interface PatternPiece {
    name: string;
    description: string;
}

export interface FabricSuggestion {
    name: string;
    reason: string;
}

export interface FabricAndNotions {
    fabricSuggestions: FabricSuggestion[];
    notions: string[];
    recommendedSeamAllowance: string;
}

export interface SewingStep {
    step: number;
    title: string;
    details: string;
}

export interface SewingGuide {
    garmentAnalysis: GarmentAnalysis;
    patternPieces: PatternPiece[];
    fabricAndNotions: FabricAndNotions;
    sewingSteps: SewingStep[];
}
