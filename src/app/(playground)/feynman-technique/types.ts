export interface AssessmentResult {
	grade: number;
	subconcepts: {
		concept: string;
		accuracy: number;
	}[];
	metrics: {
		[key: string]: {
			score: number;
			feedback: string;
		};
	};
	summary: string;
}
