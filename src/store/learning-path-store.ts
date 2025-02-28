import { create } from 'zustand';
import {
	LearningPath,
	LearningPathNode,
	LearningPathEdge,
} from '@/lib/learning-path-schemas';
import {
	getLearningPathDetails,
	getUserLearningPaths,
	updateLearningPathNodeProgress,
} from '@/app/(playground)/learning-path/actions';

// Define the types for our store
interface LearningPathInfo {
	id: string;
	title: string;
	concept: string;
	gradeLevel: string;
	timestamp: number;
	lastUpdated: number;
	overallProgress: number;
}

interface LearningPathState {
	// Paths list
	paths: LearningPathInfo[];

	// Current active path
	currentPath: LearningPath | null;
	activePathId: string | null;

	// UI state
	isLoading: boolean;
	isPathsLoading: boolean;
	error: string | null;

	// Actions
	loadPaths: () => Promise<void>;
	selectPath: (pathId: string) => Promise<void>;
	setCurrentPath: (path: LearningPath | null, pathId?: string | null) => void;
	clearCurrentPath: () => void;
	updateNodeProgress: (nodeId: string, progress: number) => Promise<void>;
	calculateOverallProgress: () => number;
}

export const useLearningPathStore = create<LearningPathState>((set, get) => ({
	// Initial state
	paths: [],
	currentPath: null,
	activePathId: null,
	isLoading: false,
	isPathsLoading: false,
	error: null,

	// Load all paths from the database
	loadPaths: async () => {
		set({ isPathsLoading: true });
		try {
			const result = await getUserLearningPaths();
			if (result.success && result.learningPaths) {
				const formattedPaths = result.learningPaths.map((path) => ({
					id: path.id,
					title: path.title,
					concept: path.concept,
					gradeLevel: path.grade_level,
					timestamp: new Date(path.created_at).getTime(),
					lastUpdated: new Date(path.updated_at).getTime(),
					overallProgress: path.overall_progress || 0,
				}));

				set({
					paths: formattedPaths,
					isPathsLoading: false,
				});
			} else {
				set({
					error: result.error || 'Failed to load learning paths',
					isPathsLoading: false,
				});
			}
		} catch (error) {
			console.error('Error loading learning paths:', error);
			set({
				error: error instanceof Error ? error.message : 'Unknown error',
				isPathsLoading: false,
			});
		}
	},

	// Select and load a specific path
	selectPath: async (pathId: string) => {
		const { activePathId, currentPath } = get();

		// Skip if already the active path and we have data
		if (pathId === activePathId && currentPath) return;

		// Set loading state when selecting a path
		set({ isLoading: true, activePathId: pathId });

		try {
			const pathDetails = await getLearningPathDetails(pathId);
			if (pathDetails.success && pathDetails.learningPath) {
				set({
					currentPath: {
						title: pathDetails.learningPath.title,
						description: pathDetails.learningPath.description,
						nodes: pathDetails.learningPath.nodes,
						edges: pathDetails.learningPath.edges,
					},
					isLoading: false,
				});
			} else {
				set({
					error: pathDetails.error || 'Failed to load learning path',
					isLoading: false,
				});
			}
		} catch (error) {
			console.error('Error loading learning path:', error);
			set({
				error: error instanceof Error ? error.message : 'Unknown error',
				isLoading: false,
			});
		}
	},

	// Set the current path directly
	setCurrentPath: (path, pathId = null) => {
		set({
			currentPath: path,
			activePathId: pathId,
			isLoading: false,
		});
	},

	// Clear the current path
	clearCurrentPath: () => {
		set({
			currentPath: null,
			activePathId: null,
			error: null,
			isLoading: false,
		});
	},

	// Calculate the overall progress of the current path
	calculateOverallProgress: () => {
		const { currentPath } = get();
		if (
			!currentPath ||
			!currentPath.nodes ||
			currentPath.nodes.length === 0
		) {
			return 0;
		}

		const totalProgress = currentPath.nodes.reduce(
			(sum, node) => sum + (node.progress || 0),
			0
		);

		return Math.round(totalProgress / currentPath.nodes.length);
	},

	// Update a node's progress
	updateNodeProgress: async (nodeId, progress) => {
		const { currentPath, activePathId, calculateOverallProgress } = get();
		if (!currentPath || !activePathId) return;

		// Update the node progress in the UI immediately
		const updatedNodes = currentPath.nodes.map((node) =>
			node.id === nodeId ? { ...node, progress } : node
		);

		set({
			currentPath: {
				...currentPath,
				nodes: updatedNodes,
			},
		});

		// Calculate the new overall progress
		const overallProgress = calculateOverallProgress();

		// Update the paths list with the new progress
		set((state) => ({
			paths: state.paths.map((path) =>
				path.id === activePathId ? { ...path, overallProgress } : path
			),
		}));

		// Update the progress in the database
		try {
			await updateLearningPathNodeProgress(nodeId, progress);
		} catch (error) {
			console.error('Error updating node progress:', error);
		}
	},
}));
