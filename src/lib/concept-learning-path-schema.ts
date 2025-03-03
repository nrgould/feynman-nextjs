import { z } from 'zod';

// 1. Initial Explanation Schema - Student's baseline understanding
export const initialExplanationSchema = z.object({
	content: z
		.string()
		.describe(
			"Student's initial explanation of the concept in their own words"
		),
	confidenceLevel: z
		.number()
		.min(1)
		.max(10)
		.describe("Student's self-reported confidence level (1-10)"),
	misconceptions: z
		.array(z.string())
		.optional()
		.describe("Identified misconceptions from the student's explanation"),
});

// 2. Big Picture Overview Schema
export const bigPictureSchema = z.object({
	summary: z.string().describe('High-level simple overview of the concept'),
	keyPoints: z
		.array(z.string())
		.describe('Essential points that form the foundation of understanding'),
	relevance: z
		.string()
		.describe(
			'Why this concept matters and how it connects to real-world applications'
		),
});

// 3. Context and Connections Schema
export const contextSchema = z.object({
	analogy: z.object({
		description: z
			.string()
			.describe(
				'An analogy that relates the concept to something familiar'
			),
		explanation: z
			.string()
			.describe('Explanation of how the analogy relates to the concept'),
	}),
	relatedConcepts: z.array(
		z.object({
			concept: z.string().describe('Name of the related concept'),
			relationship: z
				.string()
				.describe(
					'How this concept relates to the main concept being learned'
				),
		})
	),
	backgroundKnowledge: z
		.array(z.string())
		.describe('Prerequisite knowledge that helps understand this concept'),
	guidingQuestions: z
		.array(z.string())
		.describe('Questions to stimulate curiosity and guide exploration'),
});

// 4. Initial Practice Schema
export const initialPracticeSchema = z.object({
	exercises: z.array(
		z.object({
			prompt: z
				.string()
				.describe('Simple exercise prompt for the student to practice'),
			expectedResponse: z
				.string()
				.describe('Expected response or solution'),
			hints: z
				.array(z.string())
				.optional()
				.describe('Progressive hints if the student struggles'),
		})
	),
	selfExplanationPrompts: z
		.array(z.string())
		.describe(
			'Prompts for the student to explain the concept in their own words'
		),
});

// 5. Formal Structure Schema
export const formalStructureSchema = z.object({
	definitions: z.array(
		z.object({
			term: z.string().describe('Formal term or concept name'),
			definition: z.string().describe('Precise definition of the term'),
		})
	),
	rules: z.array(
		z.object({
			name: z
				.string()
				.optional()
				.describe('Name of the rule or principle'),
			statement: z.string().describe('Formal statement of the rule'),
			explanation: z
				.string()
				.describe('Explanation of how the rule works'),
		})
	),
	notation: z
		.array(
			z.object({
				symbol: z
					.string()
					.describe('Mathematical or domain-specific symbol'),
				meaning: z.string().describe('What the symbol represents'),
				usage: z.string().describe('How and when to use this notation'),
			})
		)
		.optional(),
	formalRepresentations: z
		.array(z.string())
		.optional()
		.describe(
			'Formal ways to represent the concept (equations, diagrams, etc.)'
		),
});

// 6. Advanced Practice Schema
export const advancedPracticeSchema = z.object({
	guidedExamples: z.array(
		z.object({
			problem: z.string().describe('Example problem statement'),
			solution: z.string().describe('Step-by-step solution'),
			explanation: z
				.string()
				.describe('Explanation of the solution process'),
		})
	),
	independentProblems: z.array(
		z.object({
			problem: z.string().describe('Problem for independent practice'),
			difficulty: z
				.number()
				.min(1)
				.max(5)
				.describe('Difficulty level from 1 (easiest) to 5 (hardest)'),
			solution: z.string().describe('Solution to the problem'),
			hints: z
				.array(z.string())
				.optional()
				.describe('Progressive hints if needed'),
		})
	),
	applicationScenarios: z.array(
		z.object({
			scenario: z
				.string()
				.describe('Real-world scenario where the concept applies'),
			task: z
				.string()
				.describe('Task for the student to complete using the concept'),
			solutionApproach: z
				.string()
				.describe('Approach to solving the application scenario'),
		})
	),
});

// 7. Review and Mastery Schema
export const reviewSchema = z.object({
	commonMisconceptions: z.array(
		z.object({
			misconception: z
				.string()
				.describe('Common misconception about the concept'),
			correction: z
				.string()
				.describe('Correct understanding to address the misconception'),
		})
	),
	selfAssessmentQuestions: z
		.array(z.string())
		.describe('Questions for students to assess their own understanding'),
	masteryIndicators: z
		.array(z.string())
		.describe('Observable behaviors that indicate mastery of the concept'),
	extensionIdeas: z
		.array(z.string())
		.optional()
		.describe('Ways to extend learning beyond basic mastery'),
});

// 8. Complete Lesson Plan Schema
export const conceptLessonPlanSchema = z.object({
	conceptId: z.string().describe('Unique identifier for the concept'),
	title: z.string().describe('Title of the concept being taught'),
	description: z.string().describe('Brief description of the concept'),
	subject: z.string().describe('Subject area the concept belongs to'),
	difficulty: z
		.number()
		.min(1)
		.max(10)
		.describe('Overall difficulty level of the concept (1-10)'),
	estimatedTimeMinutes: z
		.number()
		.describe('Estimated time to complete the lesson in minutes'),
	learningObjectives: z
		.array(z.string())
		.describe('Specific learning objectives for this lesson'),

	// Blurry to Sharp Framework Stages
	initialExplanation: initialExplanationSchema,
	bigPicture: bigPictureSchema,
	contextAndConnections: contextSchema,
	initialPractice: initialPracticeSchema,
	formalStructure: formalStructureSchema,
	advancedPractice: advancedPracticeSchema,
	reviewAndMastery: reviewSchema,

	// Mastery Criteria
	masteryCriteria: z.object({
		knowledgeChecks: z.array(
			z.object({
				question: z
					.string()
					.describe('Assessment question to verify understanding'),
				acceptableResponses: z
					.array(z.string())
					.describe(
						'Range of acceptable responses indicating understanding'
					),
			})
		),
		performanceTasks: z.array(
			z.object({
				task: z
					.string()
					.describe(
						'Task that demonstrates application of the concept'
					),
				rubric: z.array(
					z.object({
						criterion: z
							.string()
							.describe('Aspect of performance being evaluated'),
						proficientDescription: z
							.string()
							.describe('Description of proficient performance'),
					})
				),
			})
		),
		selfEvaluationPrompt: z
			.string()
			.describe(
				'Prompt for student to self-evaluate their understanding'
			),
	}),

	// Progress Tracking
	progressTracking: z.object({
		stages: z.array(
			z.object({
				name: z.string().describe('Name of the learning stage'),
				completionCriteria: z
					.string()
					.describe('Criteria for considering this stage complete'),
				weight: z
					.number()
					.min(0)
					.max(100)
					.describe(
						'Relative weight of this stage in overall progress calculation'
					),
			})
		),
		overallProgressCalculation: z
			.string()
			.describe('Formula or approach for calculating overall progress'),
	}),
});

// TypeScript type derived from the schema
export type ConceptLessonPlan = z.infer<typeof conceptLessonPlanSchema>;

// Define the stages of the Blurry to Sharp framework
export const learningStages = [
	'initial_explanation',
	'big_picture',
	'context_and_connections',
	'initial_practice',
	'formal_structure',
	'advanced_practice',
	'review_and_mastery',
] as const;

export type LearningStage = (typeof learningStages)[number];

// Function to generate a system prompt for creating a concept lesson plan
export function generateConceptLessonPlanPrompt(
	concept: string,
	studentLevel: string,
	initialExplanation?: string
): string {
	return `You are an expert educational curriculum designer creating a comprehensive lesson plan for teaching the concept of "${concept}" to a ${studentLevel} level student.

${initialExplanation ? `The student has provided this initial explanation of the concept: "${initialExplanation}"` : ''}

Create a detailed lesson plan following the "Blurry to Sharp" framework, which moves from a high-level overview to detailed understanding:

1. INITIAL EXPLANATION ASSESSMENT
   - Analyze the student's current understanding
   - Identify misconceptions or knowledge gaps
   - Assess confidence level

2. BIG PICTURE OVERVIEW
   - Provide a simple, high-level explanation of the concept
   - Highlight key points that form the foundation
   - Explain why this concept matters

3. CONTEXT AND CONNECTIONS
   - Create a powerful analogy from a different domain
   - Connect to related concepts the student might already know
   - Provide background knowledge needed
   - Include guiding questions to stimulate curiosity

4. INITIAL PRACTICE
   - Design simple exercises for initial practice
   - Create prompts for the student to explain the concept in their own words

5. FORMAL STRUCTURE
   - Introduce formal definitions and terminology
   - Explain rules and principles that govern the concept
   - Present any mathematical notation or specialized symbols
   - Show formal representations (equations, diagrams, etc.)

6. ADVANCED PRACTICE
   - Provide guided examples with step-by-step solutions
   - Create independent practice problems of increasing difficulty
   - Design real-world application scenarios

7. REVIEW AND MASTERY
   - Address common misconceptions
   - Provide self-assessment questions
   - Define clear indicators of mastery
   - Suggest extension ideas for further learning

Also include:
- Clear learning objectives
- Mastery criteria with knowledge checks and performance tasks
- A progress tracking system with completion criteria for each stage

Your lesson plan should be comprehensive, engaging, and designed to bring the student to full mastery of the concept.`;
}

// Function to convert a ConceptLessonPlan to database records
export function convertLessonPlanToDbRecords(
	lessonPlan: ConceptLessonPlan,
	userId: string,
	chatId: string,
	conceptId: string,
	learningPathNodeId?: string
) {
	// Create the main ConceptLearningPath record
	const conceptLearningPath = {
		id: crypto.randomUUID(),
		user_id: userId,
		concept_id: conceptId,
		chat_id: chatId,
		learning_path_node_id: learningPathNodeId || null,
		title: lessonPlan.title,
		description: lessonPlan.description,
		current_stage: 'initial_explanation' as LearningStage,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		overall_progress: 0,
	};

	// Create the stage records
	const stages = [
		{
			id: crypto.randomUUID(),
			concept_learning_path_id: conceptLearningPath.id,
			title: 'Initial Explanation',
			description: 'Assess your current understanding of the concept',
			stage: 'initial_explanation' as LearningStage,
			display_order: 1,
			estimated_time_minutes: 5,
			completed: false,
			resources: lessonPlan.initialExplanation,
			created_at: new Date().toISOString(),
		},
		{
			id: crypto.randomUUID(),
			concept_learning_path_id: conceptLearningPath.id,
			title: 'Big Picture Overview',
			description: 'Understand the concept at a high level',
			stage: 'big_picture' as LearningStage,
			display_order: 2,
			estimated_time_minutes: 10,
			completed: false,
			resources: lessonPlan.bigPicture,
			created_at: new Date().toISOString(),
		},
		{
			id: crypto.randomUUID(),
			concept_learning_path_id: conceptLearningPath.id,
			title: 'Context and Connections',
			description: 'Connect the concept to what you already know',
			stage: 'context_and_connections' as LearningStage,
			display_order: 3,
			estimated_time_minutes: 15,
			completed: false,
			resources: lessonPlan.contextAndConnections,
			created_at: new Date().toISOString(),
		},
		{
			id: crypto.randomUUID(),
			concept_learning_path_id: conceptLearningPath.id,
			title: 'Initial Practice',
			description: 'Practice the concept with simple exercises',
			stage: 'initial_practice' as LearningStage,
			display_order: 4,
			estimated_time_minutes: 20,
			completed: false,
			resources: lessonPlan.initialPractice,
			created_at: new Date().toISOString(),
		},
		{
			id: crypto.randomUUID(),
			concept_learning_path_id: conceptLearningPath.id,
			title: 'Formal Structure',
			description: 'Learn the formal definitions and rules',
			stage: 'formal_structure' as LearningStage,
			display_order: 5,
			estimated_time_minutes: 25,
			completed: false,
			resources: lessonPlan.formalStructure,
			created_at: new Date().toISOString(),
		},
		{
			id: crypto.randomUUID(),
			concept_learning_path_id: conceptLearningPath.id,
			title: 'Advanced Practice',
			description: 'Apply the concept to more complex problems',
			stage: 'advanced_practice' as LearningStage,
			display_order: 6,
			estimated_time_minutes: 30,
			completed: false,
			resources: lessonPlan.advancedPractice,
			created_at: new Date().toISOString(),
		},
		{
			id: crypto.randomUUID(),
			concept_learning_path_id: conceptLearningPath.id,
			title: 'Review and Mastery',
			description: "Review what you've learned and assess mastery",
			stage: 'review_and_mastery' as LearningStage,
			display_order: 7,
			estimated_time_minutes: 15,
			completed: false,
			resources: lessonPlan.reviewAndMastery,
			created_at: new Date().toISOString(),
		},
	];

	return {
		conceptLearningPath,
		stages,
	};
}

// Function to calculate progress based on completed stages
export function calculateLearningPathProgress(
	stages: { completed: boolean; weight: number }[]
): number {
	if (stages.length === 0) return 0;

	const totalWeight = stages.reduce((sum, stage) => sum + stage.weight, 0);
	const completedWeight = stages
		.filter((stage) => stage.completed)
		.reduce((sum, stage) => sum + stage.weight, 0);

	return Math.round((completedWeight / totalWeight) * 100);
}

// Define the learning objective types based on the "Blurry to Sharp" framework
export const objectiveTypes = [
	'conceptual_understanding', // Big picture understanding
	'contextual_connection', // Relating to other concepts
	'application', // Applying the concept
	'formal_knowledge', // Formal definitions and rules
	'analysis', // Breaking down complex problems
	'evaluation', // Assessing understanding
	'creation', // Creating something new with the concept
] as const;

export type ObjectiveType = (typeof objectiveTypes)[number];

// Schema for a single learning objective
export const learningObjectiveSchema = z.object({
	id: z.string().describe('Unique identifier for this learning objective'),
	type: z
		.enum(objectiveTypes)
		.describe(
			'The type of learning objective based on the learning framework'
		),
	description: z
		.string()
		.describe('Clear description of what the learner should be able to do'),
	assessmentCriteria: z
		.string()
		.describe('How to determine if this objective has been met'),
	difficulty: z
		.number()
		.min(1)
		.max(5)
		.describe('Difficulty level from 1 (easiest) to 5 (hardest)'),
	prerequisites: z
		.array(z.string())
		.optional()
		.describe('IDs of objectives that should be completed before this one'),
	isCompleted: z
		.boolean()
		.default(false)
		.describe('Whether this objective has been completed'),
	completedAt: z
		.string()
		.optional()
		.describe('When this objective was completed'),
});

export type LearningObjective = z.infer<typeof learningObjectiveSchema>;

// Schema for a complete set of learning objectives for a concept
export const conceptLearningObjectivesSchema = z.object({
	conceptId: z.string().describe('Unique identifier for the concept'),
	title: z.string().describe('Title of the concept being learned'),
	description: z.string().describe('Brief description of the concept'),
	subject: z.string().describe('Subject area the concept belongs to'),

	// Objectives organized by the "Blurry to Sharp" progression
	objectives: z.object({
		// Big picture understanding (blurry)
		conceptualUnderstanding: z
			.array(learningObjectiveSchema)
			.describe(
				'Objectives related to understanding the concept at a high level'
			),

		// Building context and connections
		contextualConnections: z
			.array(learningObjectiveSchema)
			.describe(
				'Objectives related to connecting the concept to other knowledge'
			),

		// Initial application
		basicApplication: z
			.array(learningObjectiveSchema)
			.describe('Objectives related to basic application of the concept'),

		// Formal understanding
		formalKnowledge: z
			.array(learningObjectiveSchema)
			.describe('Objectives related to formal definitions and rules'),

		// Advanced application (sharp)
		advancedApplication: z
			.array(learningObjectiveSchema)
			.describe(
				'Objectives related to advanced application of the concept'
			),
	}),

	// Mastery criteria
	masteryCriteria: z.object({
		requiredObjectiveCompletion: z
			.number()
			.min(0)
			.max(100)
			.describe(
				'Percentage of objectives that must be completed for mastery'
			),
		requiredMasteryObjectives: z
			.array(z.string())
			.describe(
				'IDs of specific objectives that must be completed for mastery'
			),
	}),

	// Progress tracking
	progress: z.object({
		overallCompletion: z
			.number()
			.min(0)
			.max(100)
			.default(0)
			.describe('Overall percentage of objectives completed'),
		stageCompletion: z
			.record(z.number().min(0).max(100))
			.describe('Completion percentage by stage'),
		lastUpdated: z.string().describe('When progress was last updated'),
	}),
});

export type ConceptLearningObjectives = z.infer<
	typeof conceptLearningObjectivesSchema
>;

// Simplified schema for generating learning objectives with the OpenAI API
export const simplifiedLearningObjectivesSchema = z.object({
	// Big picture understanding (blurry)
	conceptualObjectives: z
		.array(z.string())
		.describe(
			'Objectives related to understanding the concept at a high level'
		),

	// Building context and connections
	connectionObjectives: z
		.array(z.string())
		.describe(
			'Objectives related to connecting the concept to other knowledge'
		),

	// Application (from basic to advanced)
	applicationObjectives: z
		.array(z.string())
		.describe('Objectives related to applying the concept'),

	// Formal understanding
	formalObjectives: z
		.array(z.string())
		.describe('Objectives related to formal definitions and rules'),

	// Mastery indicators
	masteryIndicators: z
		.array(z.string())
		.describe('Observable behaviors that indicate mastery of the concept'),
});

// Function to generate a system prompt for creating learning objectives
export function generateLearningObjectivesPrompt(
	concept: string,
	studentLevel: string
): string {
	return `You are an expert educational designer creating learning objectives for teaching the concept of "${concept}" to a ${studentLevel} level student.

Create a comprehensive set of learning objectives that follow the "Blurry to Sharp" framework, which moves from a high-level overview to detailed understanding:

1. CONCEPTUAL OBJECTIVES (Big Picture)
   - Create 3-5 objectives that focus on understanding the concept at a high level
   - Include objectives about grasping the main idea and importance

2. CONNECTION OBJECTIVES
   - Create 3-5 objectives about relating this concept to other concepts
   - Include objectives about understanding prerequisites and related ideas

3. APPLICATION OBJECTIVES
   - Create 5-7 objectives for applying the concept, from simple to complex situations
   - Include objectives about recognizing when and how to use the concept

4. FORMAL OBJECTIVES
   - Create 3-5 objectives about understanding formal definitions and rules
   - Include objectives about precise terminology and notation

5. MASTERY INDICATORS
   - Create 3-5 indicators that demonstrate complete mastery of the concept
   - Include observable behaviors that show the student has fully understood the concept

Each objective should be specific, measurable, and start with an action verb (explain, identify, analyze, etc.).
Your learning objectives should be comprehensive and designed to ensure the student fully understands the concept.`;
}

// Function to analyze which learning objectives have been met
export function generateLearningObjectivesAnalysisPrompt(
	objectives: {
		conceptualObjectives: string[];
		connectionObjectives: string[];
		applicationObjectives: string[];
		formalObjectives: string[];
		masteryIndicators: string[];
	},
	messageHistory: string
): string {
	return `You are an expert educational assessor analyzing a student's learning progress.

Below are the learning objectives for a concept. For each objective, analyze the message history to determine if the objective has been met.

CONCEPTUAL OBJECTIVES (Big Picture):
${objectives.conceptualObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

CONNECTION OBJECTIVES:
${objectives.connectionObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

APPLICATION OBJECTIVES:
${objectives.applicationObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

FORMAL OBJECTIVES:
${objectives.formalObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

MASTERY INDICATORS:
${objectives.masteryIndicators.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

MESSAGE HISTORY:
${messageHistory}

For each category of objectives, determine which specific objectives have been met based on the message history.
Return a JSON object with the following structure:
{
  "completedObjectives": {
    "conceptual": [0, 2], // Indices of completed conceptual objectives
    "connection": [1, 3], // Indices of completed connection objectives
    "application": [0, 2, 4], // Indices of completed application objectives
    "formal": [1], // Indices of completed formal objectives
    "mastery": [] // Indices of completed mastery indicators
  },
  "nextSteps": "Recommendation for what the student should focus on next",
  "overallProgress": 45 // Percentage of objectives completed
}`;
}

// Function to calculate progress based on completed objectives
export function calculateObjectivesProgress(objectives: {
	conceptualObjectives: { completed: boolean }[];
	connectionObjectives: { completed: boolean }[];
	applicationObjectives: { completed: boolean }[];
	formalObjectives: { completed: boolean }[];
	masteryIndicators: { completed: boolean }[];
}): number {
	// Count total and completed objectives
	let totalCount = 0;
	let completedCount = 0;

	const categories = [
		objectives.conceptualObjectives,
		objectives.connectionObjectives,
		objectives.applicationObjectives,
		objectives.formalObjectives,
		objectives.masteryIndicators,
	];

	categories.forEach((category) => {
		totalCount += category.length;
		completedCount += category.filter((obj) => obj.completed).length;
	});

	return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
}
