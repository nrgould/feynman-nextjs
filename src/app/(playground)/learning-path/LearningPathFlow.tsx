'use client';

import { useState, useCallback, useEffect } from 'react';
import {
	ReactFlow,
	Controls,
	Background,
	applyNodeChanges,
	applyEdgeChanges,
	Panel,
	NodeTypes,
	EdgeTypes,
	MarkerType,
	Node,
	Edge,
	useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useLearningPathStore } from '@/store/learning-path-store';
import { ConceptNode } from './ConceptNode';
import {
	LearningPathNode,
	LearningPathEdge,
} from '@/lib/learning-path-schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, BarChart2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the type for our custom node
type ConceptNodeData = {
	node: LearningPathNode;
	onProgressChange: (id: string, progress: number) => void;
};

export function LearningPathFlow() {
	const { currentPath, updateNodeProgress, updateNodeGrade } =
		useLearningPathStore();

	// Define node types
	const nodeTypes: NodeTypes = {
		concept: ConceptNode,
	};

	// State for nodes and edges with proper typing
	const [nodes, setNodes] = useState<Node<ConceptNodeData>[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Calculate overall progress
	const overallProgress = currentPath?.nodes.length
		? Math.round(
				currentPath.nodes.reduce(
					(sum, node) => sum + node.progress,
					0
				) / currentPath.nodes.length
			)
		: 0;

	// Arrange nodes in a linear path
	const arrangeNodesInLinearPath = (nodes: LearningPathNode[]) => {
		const HORIZONTAL_SPACING = 350; // Space between nodes horizontally
		const START_X = 50; // Starting X position
		const START_Y = 100; // Starting Y position

		return nodes.map((node, index) => ({
			...node,
			position: {
				x: START_X + index * HORIZONTAL_SPACING,
				y: START_Y,
			},
		}));
	};

	// Create linear connections between nodes (only connect to previous/next)
	const createLinearEdges = (nodes: LearningPathNode[]) => {
		if (!nodes || nodes.length <= 1) return [];

		return nodes.slice(0, -1).map((node, index) => ({
			id: `edge-${node.id}-${nodes[index + 1].id}`,
			source: node.id,
			target: nodes[index + 1].id,
			label: `Step ${index + 1} → ${index + 2}`,
			animated: true,
			type: 'default',
			markerEnd: {
				type: MarkerType.ArrowClosed,
				width: 20,
				height: 20,
			},
			style: { stroke: '#93c5fd' },
		}));
	};

	// Update nodes and edges when currentPath changes
	useEffect(() => {
		if (!currentPath) return;

		// Only set loading if we have a current path with nodes
		if (currentPath.nodes && currentPath.nodes.length > 0) {
			setIsLoading(true);

			// Arrange nodes in a linear path
			const arrangedNodes = arrangeNodesInLinearPath(currentPath.nodes);

			// Convert learning path nodes to ReactFlow nodes
			const flowNodes: Node<ConceptNodeData>[] = arrangedNodes.map(
				(node, index) => ({
					id: node.id,
					type: 'concept',
					position: node.position,
					data: {
						node,
						onProgressChange: updateNodeProgress,
					},
				})
			);

			// Create linear edges (only connect to previous/next)
			const flowEdges = createLinearEdges(arrangedNodes);

			// Delay setting nodes to create a loading effect
			setTimeout(() => {
				setNodes(flowNodes);
				setEdges(flowEdges);
				setIsLoading(false);
			}, 500);
		} else {
			// If there are no nodes, don't show loading
			setIsLoading(false);
			setNodes([]);
			setEdges([]);
		}
	}, [currentPath, updateNodeProgress]);

	// Handle node changes
	const onNodesChange = useCallback(
		(changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
		[]
	);

	// Handle edge changes
	const onEdgesChange = useCallback(
		(changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[]
	);

	if (!currentPath) return null;

	return (
		<div className='w-full h-[calc(100vh-64px)]'>
			<div className='p-4 border-b bg-white sticky top-0 z-10'>
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
					<div>
						<h1 className='text-2xl font-bold text-gray-800'>
							{currentPath.title}
						</h1>
						<p className='text-gray-600 mt-1'>
							{currentPath.description}
						</p>
					</div>

					<div className='flex items-center gap-3'>
						<Badge
							variant='outline'
							className='bg-blue-50 text-blue-700 border-blue-200 px-3 py-1'
						>
							<BookOpen className='w-4 h-4 mr-2' />
							{currentPath.nodes.length} Concepts
						</Badge>

						<Badge
							variant='outline'
							className='bg-violet-50 text-violet-700 border-violet-200 px-3 py-1'
						>
							<BarChart2 className='w-4 h-4 mr-2' />
							{overallProgress}% Complete
						</Badge>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{isLoading ? (
					<motion.div
						className='flex items-center justify-center h-[calc(100vh-150px)]'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div className='text-center space-y-4'>
							<div className='inline-block p-4 bg-primary/10 rounded-full'>
								<div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
							</div>
							<p className='text-muted-foreground'>
								Arranging your learning path...
							</p>
						</div>
					</motion.div>
				) : (
					<motion.div
						className='w-full h-full'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<ReactFlow
							nodes={nodes}
							edges={edges}
							onNodesChange={onNodesChange}
							onEdgesChange={onEdgesChange}
							nodeTypes={nodeTypes}
							fitView
							attributionPosition='bottom-right'
							minZoom={0.5}
							maxZoom={1.5}
						>
							<Background color='#f8fafc' gap={16} />
							<Controls />

							<Panel
								position='top-right'
								className='bg-white p-4 rounded-md shadow-md'
							>
								<div className='space-y-3'>
									<h3 className='font-medium text-gray-700'>
										Overall Progress
									</h3>
									<div className='space-y-1'>
										<div className='flex justify-between text-sm text-gray-600'>
											<span>Completion</span>
											<span>{overallProgress}%</span>
										</div>
										<Progress
											value={overallProgress}
											className='h-2'
										/>
									</div>
									<p className='text-xs text-gray-500'>
										Drag nodes to rearrange concepts. Adjust
										progress with the sliders.
									</p>
								</div>
							</Panel>
						</ReactFlow>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
