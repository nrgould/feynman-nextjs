export interface MathStep {
	id: string;
	content: string;
	explanation: string;
	order: number;
}

export interface MathSolution {
	id?: string;
	problem: string;
	title: string;
	steps: MathStep[];
	createdAt?: string;
	updatedAt?: string;
}

export interface MathNode {
	id: string;
	type: 'mathStep';
	position: { x: number; y: number };
	data: {
		step: MathStep;
		isCorrect?: boolean;
		showOrder?: boolean;
	};
}

export interface MathEdge {
	id: string;
	source: string;
	target: string;
	type: 'custom' | 'smoothstep' | 'step' | 'straight' | 'bezier';
	animated?: boolean;
	style?: {
		strokeWidth?: number;
		stroke?: string;
	};
	data?: {
		isCorrect?: boolean;
	};
}

export interface VerificationResult {
	isCorrect: boolean;
	incorrectConnections: string[];
	incorrectNodes: string[];
	feedback: string;
}
