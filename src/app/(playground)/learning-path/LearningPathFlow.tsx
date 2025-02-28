'use client';

import {
	useState,
	useCallback,
	useEffect,
	Dispatch,
	SetStateAction,
	useMemo,
} from 'react';
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
	ReactFlowProvider,
	MiniMap,
	NodeResizer,
	NodeToolbar,
	BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ConceptNode } from './ConceptNode';
import {
	LearningPathNode,
	LearningPathEdge,
	LearningPath,
} from '@/lib/learning-path-schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, BarChart2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningPathStore } from '@/store/learning-path-store';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Define the type for our custom node
type ConceptNodeData = {
	node: LearningPathNode;
	onProgressChange: (id: string, progress: number) => void;
};

interface LearningPathFlowProps {
	currentPath: LearningPath;
	setCurrentPath: (path: LearningPath | null, pathId?: string | null) => void;
}

// Export the component directly without wrapping it with ReactFlowProvider
// since the parent component now provides the context
export function LearningPathFlow({
	currentPath,
	setCurrentPath,
}: LearningPathFlowProps) {
	// Define node types
	const nodeTypes = useMemo(() => ({ concept: ConceptNode }), []);
	const { updateNodeProgress } = useLearningPathStore();

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

		return nodes.slice(0, -1).map((node, index) => {
			const nextNode = nodes[index + 1];
			// An edge should be disabled if the next node is not unlocked
			// Next node is unlocked if current node has progress >= 75%
			const isDisabled = node.progress < 75;

			return {
				id: `edge-${node.id}-${nextNode.id}`,
				source: node.id,
				target: nextNode.id,
				animated: !isDisabled,
				type: 'default',
				markerEnd: {
					type: MarkerType.ArrowClosed,
					width: 20,
					height: 20,
				},
				style: {
					stroke: isDisabled ? '#e5e7eb' : '#93c5fd',
					opacity: isDisabled ? 0.5 : 1,
				},
			};
		});
	};

	// Handle progress changes and sync with Supabase
	const handleProgressChange = async (nodeId: string, progress: number) => {
		// Use the Zustand store's updateNodeProgress function
		// This will update the UI state and sync with Supabase
		await updateNodeProgress(nodeId, progress);
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
				(node, index) => {
					// First node is always unlocked
					// Other nodes are unlocked if the previous node has progress >= 75%
					const isUnlocked =
						index === 0 ||
						(index > 0 && arrangedNodes[index - 1].progress >= 75);

					// A node is disabled if it's not unlocked
					const isDisabled = !isUnlocked;

					return {
						id: node.id,
						type: 'concept',
						position: node.position,
						data: {
							node,
							onProgressChange: handleProgressChange,
							isDisabled,
						},
					};
				}
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPath]);

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

	if (isLoading) {
		return (
			<div className='flex-1 flex flex-col'>
				<div className='border-b p-4 flex items-center justify-between'>
					<div className='space-y-2'>
						<Skeleton className='h-6 w-48' />
						<Skeleton className='h-4 w-96' />
					</div>
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-24' />
						<Skeleton className='h-9 w-24' />
					</div>
				</div>
				<div className='flex-1 flex'>
					<div className='flex-1 relative'>
						<div className='absolute inset-0 bg-grid-pattern opacity-5' />
						<div className='absolute inset-0 flex items-center justify-center'>
							<Skeleton className='h-48 w-48 rounded-xl' />
						</div>
					</div>
					<div className='w-[300px] border-l'>
						<div className='p-4 border-b'>
							<Skeleton className='h-5 w-32' />
						</div>
						<div className='p-4 space-y-4'>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-24' />
								<div className='flex gap-2'>
									{Array.from({ length: 3 }).map((_, i) => (
										<Skeleton
											key={i}
											className='h-6 w-16'
										/>
									))}
								</div>
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-24' />
								<div className='flex gap-2'>
									{Array.from({ length: 3 }).map((_, i) => (
										<Skeleton
											key={i}
											className='h-6 w-16'
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

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

					<div className='flex flex-col items-evenly justify-evenly gap-3'>
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
						className='flex items-center justify-center h-[200px] mt-8'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div className='text-center'>
							<div className='inline-block p-2 bg-primary/10 rounded-full'>
								<div className='w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
							</div>
							<p className='text-sm text-muted-foreground mt-2'>
								Loading...
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
							<Background
								id='1'
								gap={10}
								color='#f1f1f1'
								variant={BackgroundVariant.Lines}
							/>

							<Controls position='top-right' />
							{/* <MiniMap position='top-left' /> */}
							<Panel
								position='top-left'
								className='bg-white p-4 rounded-md shadow-md'
							>
								<div className='space-y-3'>
									<h3 className='font-medium text-gray-700'>
										Learning Path Legend
									</h3>
									<div className='space-y-2 text-sm'>
										<div className='flex items-center'>
											<div className='w-3 h-3 bg-blue-500 rounded-full mr-2'></div>
											<span>
												Active - Currently learning
											</span>
										</div>
										<div className='flex items-center'>
											<div className='w-3 h-3 bg-amber-500 rounded-full mr-2'></div>
											<span>
												Ready - Available to start
											</span>
										</div>
										<div className='flex items-center'>
											<div className='w-3 h-3 bg-gray-400 rounded-full mr-2'></div>
											<span>
												Locked - Complete previous
												concept first (75% progress
												needed)
											</span>
										</div>
										<div className='flex items-center'>
											<div className='w-3 h-3 bg-green-500 rounded-full mr-2'></div>
											<span>
												Completed - 100% progress
											</span>
										</div>
									</div>
								</div>
							</Panel>
						</ReactFlow>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
