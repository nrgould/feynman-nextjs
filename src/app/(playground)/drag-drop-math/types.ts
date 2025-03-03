import { Node, Edge, MarkerType } from '@xyflow/react';

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

export interface MathNode extends Node {
	data: {
		step: MathStep;
		isCorrect?: boolean;
		showOrder?: boolean;
		isMobile?: boolean;
	};
}

export interface MathEdge extends Edge {
	data?: {
		isCorrect?: boolean;
	};
	style?: {
		strokeWidth?: number;
		stroke?: string;
	};
	type?: 'smoothstep' | 'step' | 'straight' | 'bezier';
	markerEnd?: {
		type: MarkerType;
		width: number;
		height: number;
		color: string;
	};
	label?: string;
	labelBgPadding?: [number, number];
	labelBgBorderRadius?: number;
	labelBgStyle?: {
		fill?: string;
		fillOpacity?: number;
	};
	labelStyle?: {
		fill?: string;
		fontSize?: number;
		fontWeight?: number;
	};
}

export interface VerificationResult {
	isCorrect: boolean;
	incorrectConnections: string[];
	incorrectNodes: string[];
	feedback: string;
}
