'use server';

import { createClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { LearningPath } from '@/lib/learning-path-schemas';
import { v4 as uuidv4 } from 'uuid';

export async function saveLearningPathToSupabase(
	learningPath: LearningPath,
	concept: string,
	gradeLevel: string
) {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not authenticated');
		}

		const supabase = await createClient();

		// Generate a UUID for the learning path
		const learningPathId = uuidv4();

		// Calculate overall progress
		const totalNodes = learningPath.nodes.length;
		const totalProgress = learningPath.nodes.reduce(
			(sum, node) => sum + (node.progress || 0),
			0
		);
		const overallProgress =
			totalNodes > 0 ? Math.round(totalProgress / totalNodes) : 0;

		// 1. Insert the learning path
		const { error: learningPathError } = await supabase
			.from('LearningPath')
			.insert({
				id: learningPathId,
				user_id: userId,
				title: learningPath.title,
				description: learningPath.description,
				concept: concept,
				grade_level: gradeLevel,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				overall_progress: overallProgress,
			});

		if (learningPathError) {
			throw new Error(
				`Error saving learning path: ${learningPathError.message}`
			);
		}

		// 2. Insert the nodes
		const nodesData = learningPath.nodes.map((node) => ({
			id: node.id,
			learning_path_id: learningPathId,
			concept: node.concept,
			description: node.description,
			difficulty: node.difficulty,
			position_x: node.position.x,
			position_y: node.position.y,
			progress: node.progress || 0,
			grade: node.grade,
		}));

		const { error: nodesError } = await supabase
			.from('LearningPathNode')
			.insert(nodesData);

		if (nodesError) {
			throw new Error(
				`Error saving learning path nodes: ${nodesError.message}`
			);
		}

		// 3. Insert the edges
		const edgesData = learningPath.edges.map((edge) => ({
			id: edge.id,
			learning_path_id: learningPathId,
			source: edge.source,
			target: edge.target,
			type: edge.type,
		}));

		const { error: edgesError } = await supabase
			.from('LearningPathEdge')
			.insert(edgesData);

		if (edgesError) {
			throw new Error(
				`Error saving learning path edges: ${edgesError.message}`
			);
		}

		// Revalidate the learning path page
		revalidatePath('/learning-path');

		return {
			success: true,
			learningPathId,
		};
	} catch (error) {
		console.error('Error saving learning path to Supabase:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

export async function getUserLearningPaths() {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not authenticated');
		}

		const supabase = await createClient();

		const { data: learningPaths, error } = await supabase
			.from('LearningPath')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`Error fetching learning paths: ${error.message}`);
		}

		return {
			success: true,
			learningPaths,
		};
	} catch (error) {
		console.error('Error fetching learning paths:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

export async function getLearningPathDetails(learningPathId: string) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return {
				success: false,
				error: 'User not authenticated',
			};
		}

		const supabase = await createClient();

		// 1. Get the learning path
		const { data: learningPath, error: learningPathError } = await supabase
			.from('LearningPath')
			.select('*')
			.eq('id', learningPathId)
			.eq('user_id', userId)
			.single();

		if (learningPathError) {
			return {
				success: false,
				error: `Error fetching learning path: ${learningPathError.message}`,
			};
		}

		// 2. Get the nodes
		const { data: nodes, error: nodesError } = await supabase
			.from('LearningPathNode')
			.select('*')
			.eq('learning_path_id', learningPathId);

		if (nodesError) {
			return {
				success: false,
				error: `Error fetching learning path nodes: ${nodesError.message}`,
			};
		}

		// 3. Get the edges
		const { data: edges, error: edgesError } = await supabase
			.from('LearningPathEdge')
			.select('*')
			.eq('learning_path_id', learningPathId);

		if (edgesError) {
			return {
				success: false,
				error: `Error fetching learning path edges: ${edgesError.message}`,
			};
		}

		// 4. Format the data
		const formattedNodes = nodes.map((node) => ({
			id: node.id,
			concept: node.concept,
			description: node.description,
			difficulty: node.difficulty,
			position: {
				x: node.position_x,
				y: node.position_y,
			},
			progress: node.progress || 0,
			grade: node.grade,
		}));

		const formattedEdges = edges.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			type: edge.type,
		}));

		return {
			success: true,
			learningPath: {
				id: learningPath.id,
				title: learningPath.title,
				description: learningPath.description,
				concept: learningPath.concept,
				grade_level: learningPath.grade_level,
				created_at: learningPath.created_at,
				updated_at: learningPath.updated_at,
				overall_progress: learningPath.overall_progress,
				nodes: formattedNodes,
				edges: formattedEdges,
			},
		};
	} catch (error) {
		console.error('Error in getLearningPathDetails:', error);
		return {
			success: false,
			error: 'An unexpected error occurred',
		};
	}
}

export async function updateLearningPathNodeProgress(
	nodeId: string,
	progress: number
) {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not authenticated');
		}

		const supabase = await createClient();

		// Update the node progress
		const { error: nodeError } = await supabase
			.from('LearningPathNode')
			.update({ progress })
			.eq('id', nodeId);

		if (nodeError) {
			throw new Error(
				`Error updating node progress: ${nodeError.message}`
			);
		}

		// Get the learning path ID for this node
		const { data: node, error: fetchError } = await supabase
			.from('LearningPathNode')
			.select('learning_path_id')
			.eq('id', nodeId)
			.single();

		if (fetchError) {
			throw new Error(`Error fetching node: ${fetchError.message}`);
		}

		// Update the overall progress of the learning path
		const { data: nodes, error: nodesError } = await supabase
			.from('LearningPathNode')
			.select('progress')
			.eq('learning_path_id', node.learning_path_id);

		if (nodesError) {
			throw new Error(`Error fetching nodes: ${nodesError.message}`);
		}

		const totalNodes = nodes.length;
		const totalProgress = nodes.reduce(
			(sum, node) => sum + (node.progress || 0),
			0
		);
		const overallProgress =
			totalNodes > 0 ? Math.round(totalProgress / totalNodes) : 0;

		const { error: pathError } = await supabase
			.from('LearningPath')
			.update({
				overall_progress: overallProgress,
				updated_at: new Date().toISOString(),
			})
			.eq('id', node.learning_path_id)
			.eq('user_id', userId);

		if (pathError) {
			throw new Error(
				`Error updating learning path: ${pathError.message}`
			);
		}

		// Revalidate the learning path page
		revalidatePath('/learning-path');

		return {
			success: true,
			overallProgress,
		};
	} catch (error) {
		console.error('Error updating node progress:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

export async function deleteLearningPath(learningPathId: string) {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not authenticated');
		}

		const supabase = await createClient();

		// Delete the learning path (cascade will delete nodes and edges)
		const { error } = await supabase
			.from('LearningPath')
			.delete()
			.eq('id', learningPathId)
			.eq('user_id', userId);

		if (error) {
			throw new Error(`Error deleting learning path: ${error.message}`);
		}

		// Revalidate the learning path page
		revalidatePath('/learning-path');

		return {
			success: true,
		};
	} catch (error) {
		console.error('Error deleting learning path:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}
