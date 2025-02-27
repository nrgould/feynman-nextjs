'use server';

import { createClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { LearningPath } from '@/lib/learning-path-schemas';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';

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

		// Get the learning path ID and other node data for this node
		const { data: node, error: fetchError } = await supabase
			.from('LearningPathNode')
			.select('learning_path_id, concept')
			.eq('id', nodeId)
			.single();

		if (fetchError) {
			throw new Error(`Error fetching node: ${fetchError.message}`);
		}

		// Check if this node is linked to a chat and concept
		const { data: chatData, error: chatError } = await supabase
			.from('Chat')
			.select('id, concept_id')
			.eq('learning_path_node_id', nodeId)
			.maybeSingle();

		// If this node is linked to a concept via a chat, update the concept progress too
		if (chatData?.concept_id) {
			const { error: conceptError } = await supabase
				.from('Concept')
				.update({ progress })
				.eq('id', chatData.concept_id);

			if (conceptError) {
				console.error('Error updating concept progress:', conceptError);
				// Don't fail the whole operation if this part fails
			}

			// Also update the chat progress
			const { error: chatUpdateError } = await supabase
				.from('Chat')
				.update({ progress })
				.eq('id', chatData.id);

			if (chatUpdateError) {
				console.error('Error updating chat progress:', chatUpdateError);
				// Don't fail the whole operation if this part fails
			}
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

export async function checkConceptActive(conceptId: string) {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not authenticated');
		}

		const supabase = await createClient();

		// Check if the concept exists and has a chat_id
		const { data, error } = await supabase
			.from('Concept')
			.select('id, chat_id, is_active')
			.eq('id', conceptId)
			.eq('user_id', userId)
			.single();

		if (error) {
			// If the concept doesn't exist, it's not active
			if (error.code === 'PGRST116') {
				// PostgreSQL not found error
				return {
					success: true,
					isActive: false,
					chatId: null,
				};
			}
			throw new Error(`Error checking concept: ${error.message}`);
		}

		return {
			success: true,
			isActive: data.is_active && data.chat_id !== null,
			chatId: data.chat_id,
		};
	} catch (error) {
		console.error('Error checking if concept is active:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			isActive: false,
			chatId: null,
		};
	}
}

export async function createChatFromLearningPathNode(
	node: {
		id: string;
		concept: string;
		description: string;
		learningPathId?: string; // Optional learning path ID
	},
	chatId: string,
	shouldRedirect: boolean = false
) {
	try {
		const { userId } = await auth();
		if (!userId) {
			throw new Error('User not authenticated');
		}

		const supabase = await createClient();

		// First, check if a concept with this ID already exists and has a chat
		const { data: existingConcept, error: conceptFetchError } =
			await supabase
				.from('Concept')
				.select('id, chat_id')
				.eq('id', node.id)
				.eq('user_id', userId)
				.single();

		// If the concept exists and has a chat, return that chat ID
		if (existingConcept && existingConcept.chat_id) {
			return {
				success: true,
				chatId: existingConcept.chat_id,
				message: 'Using existing chat for this concept',
			};
		}

		// First, create a Concept entry without the chat_id (we'll update it later)
		const conceptId = node.id; // Using the node ID as the concept ID
		const { error: conceptError } = await supabase
			.from('Concept')
			.insert({
				id: conceptId,
				title: node.concept,
				description: node.description,
				subject: 'Learning Path', // Default subject for learning path nodes
				user_id: userId,
				progress: 0,
				is_active: true,
				// Omit chat_id initially to avoid foreign key constraint
			})
			.select()
			.single();

		// Handle potential duplicate concept
		if (conceptError) {
			// If it's not a duplicate error, throw it
			if (conceptError.code !== '23505') {
				// Postgres unique violation code
				throw new Error(
					`Error creating concept: ${conceptError.message}`
				);
			}
			// For duplicates, we'll continue with the existing concept
		}

		// Get the learning path ID for this node if not provided
		let learningPathId = node.learningPathId;
		if (!learningPathId) {
			// Try to find the learning path ID from the node ID
			const { data: nodeData, error: nodeError } = await supabase
				.from('LearningPathNode')
				.select('learning_path_id')
				.eq('id', node.id)
				.single();

			if (!nodeError && nodeData) {
				learningPathId = nodeData.learning_path_id;
			}
		}

		// Then, create a Chat entry that references the concept
		const { error: chatError } = await supabase
			.from('Chat')
			.insert({
				id: chatId,
				concept_id: conceptId,
				description: node.description,
				title: node.concept,
				created_at: new Date().toISOString(),
				user_id: userId,
				// Add learning path references if available
				learning_path_id: learningPathId || null,
				learning_path_node_id: node.id,
			})
			.select()
			.single();

		if (chatError) {
			throw new Error(`Error creating chat: ${chatError.message}`);
		}

		// Now update the Concept with the chat_id
		const { error: updateError } = await supabase
			.from('Concept')
			.update({
				chat_id: chatId,
				is_active: true,
			})
			.eq('id', conceptId)
			.eq('user_id', userId);

		if (updateError) {
			throw new Error(`Error updating concept: ${updateError.message}`);
		}

		// Generate the first message for the chat
		const { generateFirstMessage } = await import(
			'@/app/chat/[id]/actions'
		);
		await generateFirstMessage(
			node.concept,
			node.description,
			chatId,
			'Learning Path'
		);

		// Return success with the chat ID
		return {
			success: true,
			chatId,
		};
	} catch (error) {
		console.error('Error creating chat from learning path node:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}
