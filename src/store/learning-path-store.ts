import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
	LearningPath,
	LearningPathNode,
	LearningPathEdge,
} from '@/lib/learning-path-schemas';

interface SavedLearningPath {
	id: string;
	title: string;
	concept: string;
	gradeLevel: string;
	timestamp: number;
	overallProgress: number;
	pathData: LearningPath; // Store the full path data
}

interface LearningPathState {
	// Current learning path
	currentPath: LearningPath | null;
	concept: string;
	gradeLevel: string;
	isLoading: boolean;
	error: string | null;

	// Previous learning paths
	previousPaths: SavedLearningPath[];

	// Actions
	setCurrentPath: (path: LearningPath) => void;
	setConcept: (concept: string) => void;
	setGradeLevel: (gradeLevel: string) => void;
	setIsLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	updateNodeProgress: (nodeId: string, progress: number) => void;
	updateNodeGrade: (nodeId: string, grade: number) => void;
	savePath: () => void;
	clearCurrentPath: () => void;
	loadPreviousPath: (id: string) => void;
	deletePreviousPath: (id: string) => void;
}

export const useLearningPathStore = create<LearningPathState>()(
	persist(
		(set, get) => ({
			// Initial state
			currentPath: null,
			concept: '',
			gradeLevel: '',
			isLoading: false,
			error: null,
			previousPaths: [],

			// Actions
			setCurrentPath: (path) =>
				set({ currentPath: path, isLoading: false }),
			setConcept: (concept) => set({ concept }),
			setGradeLevel: (gradeLevel) => set({ gradeLevel }),
			setIsLoading: (isLoading) => set({ isLoading }),
			setError: (error) => set({ error }),

			updateNodeProgress: (nodeId, progress) => {
				const { currentPath } = get();
				if (!currentPath) return;

				const updatedNodes = currentPath.nodes.map((node) =>
					node.id === nodeId ? { ...node, progress } : node
				);

				set({
					currentPath: {
						...currentPath,
						nodes: updatedNodes,
					},
				});
			},

			updateNodeGrade: (nodeId, grade) => {
				const { currentPath } = get();
				if (!currentPath) return;

				const updatedNodes = currentPath.nodes.map((node) =>
					node.id === nodeId ? { ...node, grade } : node
				);

				set({
					currentPath: {
						...currentPath,
						nodes: updatedNodes,
					},
				});
			},

			savePath: () => {
				const { currentPath, concept, gradeLevel, previousPaths } =
					get();
				if (!currentPath) return;

				// Calculate overall progress
				const totalNodes = currentPath.nodes.length;
				const totalProgress = currentPath.nodes.reduce(
					(sum, node) => sum + (node.progress || 0),
					0
				);
				const overallProgress =
					totalNodes > 0 ? Math.round(totalProgress / totalNodes) : 0;

				// Create a unique ID for this path
				const id = `${concept}-${Date.now()}`;

				// Check if we already have this path saved (by concept)
				const existingPathIndex = previousPaths.findIndex(
					(path) =>
						path.concept.toLowerCase() === concept.toLowerCase()
				);

				// Create the new path entry
				const newPath: SavedLearningPath = {
					id,
					title: currentPath.title,
					concept,
					gradeLevel,
					timestamp: Date.now(),
					overallProgress,
					pathData: currentPath, // Store the full path data
				};

				// Update the previous paths array
				if (existingPathIndex >= 0) {
					// Replace the existing path
					const updatedPaths = [...previousPaths];
					updatedPaths[existingPathIndex] = newPath;
					set({ previousPaths: updatedPaths });
				} else {
					// Add as a new path
					set({
						previousPaths: [newPath, ...previousPaths],
					});
				}
			},

			clearCurrentPath: () =>
				set({
					currentPath: null,
					concept: '',
					gradeLevel: '',
					error: null,
					isLoading: false,
				}),

			loadPreviousPath: (id) => {
				const { previousPaths } = get();
				const pathToLoad = previousPaths.find((path) => path.id === id);

				if (pathToLoad) {
					// Load the full path data that we stored
					set({
						currentPath: pathToLoad.pathData,
						concept: pathToLoad.concept,
						gradeLevel: pathToLoad.gradeLevel,
						isLoading: false,
					});
				}
			},

			deletePreviousPath: (id) => {
				const { previousPaths } = get();
				set({
					previousPaths: previousPaths.filter(
						(path) => path.id !== id
					),
				});
			},
		}),
		{
			name: 'learning-path-storage',
		}
	)
);
