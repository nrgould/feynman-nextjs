'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
	ReactFlow,
	Controls,
	Background,
	applyNodeChanges,
	applyEdgeChanges,
	Node,
	Edge,
	BackgroundVariant,
	addEdge,
	Connection,
	useNodesState,
	useEdgesState,
	Panel,
	EdgeChange,
	useReactFlow,
	MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MathStepNode } from './MathStepNode';
import {
	MathSolution,
	MathNode,
	MathEdge,
	MathStep,
	VerificationResult,
} from './types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
	Check,
	RotateCcw,
	AlertTriangle,
	Award,
	Eye,
	ArrowRightLeft,
	Trash2,
	ZoomIn,
	ZoomOut,
	Move,
	Smartphone,
	Maximize,
	Wand2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface MathSolutionFlowProps {
	mathSolution: MathSolution;
	onEdgesUpdate?: (edges: MathEdge[]) => void;
	onVerificationUpdate?: (result: VerificationResult, grade: number) => void;
}

export function MathSolutionFlow({
	mathSolution,
	onEdgesUpdate,
	onVerificationUpdate,
}: MathSolutionFlowProps) {
	// Check if device is mobile
	const isMobile = useMediaQuery('(max-width: 768px)');

	// Get ReactFlow instance for programmatic control
	const reactFlowInstance = useReactFlow();

	// Define node types
	const nodeTypes = useMemo(() => ({ mathStep: MathStepNode }), []);

	// State for showing/hiding step order
	const [showStepOrder, setShowStepOrder] = useState(false);

	// Initial nodes - positioned based on device
	const initialNodes: MathNode[] = useMemo(() => {
		// Shuffle the steps for initial display
		const shuffledSteps = [...mathSolution.steps].sort(
			() => Math.random() - 0.5
		);

		// Position nodes differently based on device
		return shuffledSteps.map((step, index) => {
			// For mobile: vertical layout with less horizontal spread
			// For desktop: horizontal layout with more spread
			const position = isMobile
				? {
						x: 50 + Math.random() * 100, // Less horizontal variation on mobile
						y: 100 + index * 250, // Vertical stacking for mobile
					}
				: {
						x: 100 + index * 400, // Horizontal spacing for desktop
						y: 100 + Math.random() * 200, // Some vertical variation
					};

			return {
				id: step.id,
				type: 'mathStep',
				position,
				data: {
					step,
					showOrder: showStepOrder,
					isMobile,
				},
			};
		});
	}, [mathSolution, showStepOrder, isMobile]);

	// State for nodes and edges
	const [nodes, setNodes, onNodesChange] =
		useNodesState<MathNode>(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState<MathEdge>([]);
	const [verificationResult, setVerificationResult] =
		useState<VerificationResult | null>(null);
	const [grade, setGrade] = useState<number | null>(null);
	const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

	// Update nodes when mobile state changes
	useEffect(() => {
		setNodes((nodes) =>
			nodes.map((node) => ({
				...node,
				data: {
					...node.data,
					isMobile,
				},
			}))
		);
	}, [isMobile, setNodes]);

	// Update parent component when edges change
	useEffect(() => {
		if (onEdgesUpdate) {
			onEdgesUpdate(edges);
		}
	}, [edges, onEdgesUpdate]);

	// Add these utility functions for solution verification
	const verifySolution = (
		edges: MathEdge[],
		mathSolution: MathSolution
	): VerificationResult => {
		// Sort steps by order
		const sortedSteps = [...mathSolution.steps].sort(
			(a, b) => a.order - b.order
		);

		// Create a map of correct connections
		const correctConnectionsMap = new Map<string, string>();
		for (let i = 0; i < sortedSteps.length - 1; i++) {
			correctConnectionsMap.set(sortedSteps[i].id, sortedSteps[i + 1].id);
		}

		// Check connections
		const incorrectConnections: string[] = [];
		const incorrectNodes: string[] = [];

		edges.forEach((edge) => {
			const correctTarget = correctConnectionsMap.get(edge.source);
			const isCorrect = correctTarget === edge.target;

			if (!isCorrect) {
				incorrectConnections.push(edge.id);
				if (!incorrectNodes.includes(edge.source)) {
					incorrectNodes.push(edge.source);
				}
				if (!incorrectNodes.includes(edge.target)) {
					incorrectNodes.push(edge.target);
				}
			}
		});

		// Set verification result
		const allCorrect = incorrectConnections.length === 0;
		return {
			isCorrect: allCorrect,
			incorrectConnections,
			incorrectNodes,
			feedback: allCorrect
				? 'Great job! All steps are in the correct order.'
				: `There are ${incorrectConnections.length} incorrect connections. Try rearranging the steps.`,
		};
	};

	const calculateGrade = (
		result: VerificationResult,
		mathSolution: MathSolution
	): number => {
		// Calculate grade as percentage of correct connections
		const totalConnections = mathSolution.steps.length - 1; // Total possible correct connections
		const incorrectCount = result.incorrectConnections.length;
		const correctConnections = Math.max(
			0,
			totalConnections - incorrectCount
		);

		return Math.round((correctConnections / totalConnections) * 100);
	};

	// Update the onConnect function to use target node explanation for edge labels with better styling
	const onConnect = useCallback(
		(params: Connection) => {
			// Check if the connection is valid
			if (!isValidConnection(params)) {
				return;
			}

			// Find the source and target nodes to get their data
			const sourceNode = nodes.find((node) => node.id === params.source);
			const targetNode = nodes.find((node) => node.id === params.target);

			if (!sourceNode || !targetNode) {
				return;
			}

			// Use the target node's explanation for the edge label
			const edgeLabel = targetNode.data.step.explanation || '';

			// Create a new edge with the target node's explanation as the label
			const newEdge: MathEdge = {
				...params,
				id: `${params.source}-${params.target}`,
				type: 'smoothstep',
				animated: true,
				label: edgeLabel,
				labelBgPadding: [8, 4],
				labelBgBorderRadius: 4,
				labelBgStyle: {
					fill: '#fff',
					fillOpacity: 0.8,
				},
				labelStyle: {
					fill: '#333',
					fontWeight: 500,
					fontSize: isMobile ? 12 : 14,
				},
				style: {
					stroke: '#6366f1',
					strokeWidth: isMobile ? 3 : 2,
				},
			};

			// Add the new edge
			setEdges((eds) => addEdge(newEdge, eds));

			// Notify parent component of edges update
			if (onEdgesUpdate) {
				onEdgesUpdate([...edges, newEdge]);
			}

			// Show success toast
			toast({
				title: 'Connection created',
				description: 'You connected two steps successfully!',
			});
		},
		[edges, nodes, onEdgesUpdate, isMobile]
	);

	// Handle edge selection
	const onEdgeClick = useCallback(
		(event: React.MouseEvent, edge: Edge) => {
			setSelectedEdge(edge.id);

			toast({
				title: 'Connection Selected',
				description: isMobile
					? 'Use the Delete button to remove this connection'
					: 'Press Delete key or use the Delete button to remove this connection',
				duration: 3000,
			});
		},
		[isMobile]
	);

	// Handle edge deletion with Delete key
	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Delete' && selectedEdge) {
				setEdges((eds) =>
					eds.filter((edge) => edge.id !== selectedEdge)
				);
				setSelectedEdge(null);

				toast({
					title: 'Connection Removed',
					description:
						'The connection between steps has been deleted. You can now reconnect the nodes.',
					duration: 2000,
				});
			}
		},
		[selectedEdge, setEdges]
	);

	// Handle edge deletion with button
	const handleDeleteSelectedEdge = useCallback(() => {
		if (selectedEdge) {
			setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge));
			setSelectedEdge(null);

			toast({
				title: 'Connection Removed',
				description:
					'The connection between steps has been deleted. You can now reconnect the nodes.',
				duration: 2000,
			});
		} else {
			toast({
				title: 'No Connection Selected',
				description: isMobile
					? 'Tap on a connection first to select it'
					: 'Click on a connection first to select it',
				variant: 'destructive',
				duration: 2000,
			});
		}
	}, [selectedEdge, setEdges, isMobile]);

	// Function to check if a node already has a connection
	const hasConnection = useCallback(
		(nodeId: string, isSource: boolean = true) => {
			return edges.some((edge) =>
				isSource ? edge.source === nodeId : edge.target === nodeId
			);
		},
		[edges]
	);

	// Handle edge validation - prevent multiple connections from the same source
	const isValidConnection = useCallback(
		(connection: Connection | MathEdge) => {
			const source = connection.source;
			const target = connection.target;

			// Don't allow connections to self
			if (source === target) {
				toast({
					title: 'Invalid Connection',
					description: 'You cannot connect a step to itself.',
					variant: 'destructive',
					duration: 2000,
				});
				return false;
			}

			// Check if source already has an outgoing connection
			const sourceHasConnection = hasConnection(source, true);
			if (sourceHasConnection) {
				toast({
					title: 'Connection Already Exists',
					description:
						'This step already has an outgoing connection. Delete it first before creating a new one.',
					variant: 'destructive',
					duration: 3000,
				});
				return false;
			}

			// Check if target already has an incoming connection
			const targetHasConnection = hasConnection(target, false);
			if (targetHasConnection) {
				toast({
					title: 'Connection Already Exists',
					description:
						'This step already has an incoming connection. Delete it first before creating a new one.',
					variant: 'destructive',
					duration: 3000,
				});
				return false;
			}

			return true;
		},
		[hasConnection]
	);

	// Reset the flow to initial state
	const handleReset = useCallback(() => {
		setNodes(initialNodes);
		setEdges([]);
		setVerificationResult(null);
		setGrade(null);
		setSelectedEdge(null);

		toast({
			title: 'Reset Complete',
			description: 'The math solution has been reset.',
		});
	}, [initialNodes, setNodes, setEdges]);

	// Toggle showing step order
	const handleToggleStepOrder = useCallback(() => {
		setShowStepOrder((prev) => !prev);

		// Update nodes to reflect the new showOrder state
		setNodes((nodes) =>
			nodes.map((node) => ({
				...node,
				data: {
					...node.data,
					showOrder: !showStepOrder,
				},
			}))
		);

		if (!showStepOrder) {
			toast({
				title: 'Step Order Revealed',
				description: 'The correct order of steps is now visible.',
			});
		} else {
			toast({
				title: 'Step Order Hidden',
				description: 'Challenge yourself to find the correct order.',
			});
		}
	}, [showStepOrder, setNodes]);

	// Arrange nodes based on device
	const handleArrangeNodes = useCallback(() => {
		setNodes((nodes) => {
			// Sort nodes by their current position
			const sortedNodes = [...nodes].sort(
				(a, b) =>
					isMobile
						? a.position.y - b.position.y // Sort by Y for mobile (vertical)
						: a.position.x - b.position.x // Sort by X for desktop (horizontal)
			);

			// Reposition nodes based on device
			return sortedNodes.map((node, index) => ({
				...node,
				position: isMobile
					? {
							x: 50, // Centered horizontally on mobile
							y: 100 + index * 250, // Stacked vertically with good spacing
						}
					: {
							x: 100 + index * 400, // Spread horizontally on desktop
							y: 200, // Aligned vertically
						},
			}));
		});

		toast({
			title: 'Steps Arranged',
			description: isMobile
				? 'Steps have been arranged in a vertical column'
				: 'Steps have been arranged in a horizontal line',
		});

		// Fit view after arranging
		setTimeout(() => {
			reactFlowInstance.fitView({ padding: 0.2 });
		}, 50);
	}, [setNodes, isMobile, reactFlowInstance]);

	// Zoom controls for mobile
	const handleZoomIn = useCallback(() => {
		reactFlowInstance.zoomIn();
	}, [reactFlowInstance]);

	const handleZoomOut = useCallback(() => {
		reactFlowInstance.zoomOut();
	}, [reactFlowInstance]);

	const handleFitView = useCallback(() => {
		reactFlowInstance.fitView({ padding: 0.2 });
	}, [reactFlowInstance]);

	// Update the handleVerify function to update edge styles based on verification results
	const handleVerify = useCallback(() => {
		// Check if there are any edges
		if (edges.length === 0) {
			toast({
				title: 'No connections',
				description: 'Please connect the steps before verifying.',
				variant: 'destructive',
			});
			return;
		}

		// Check if all nodes are connected
		const connectedNodeIds = new Set<string>();
		edges.forEach((edge) => {
			connectedNodeIds.add(edge.source);
			connectedNodeIds.add(edge.target);
		});

		if (connectedNodeIds.size < nodes.length) {
			toast({
				title: 'Incomplete solution',
				description:
					'Not all steps are connected. Please connect all steps.',
				variant: 'destructive',
			});
			return;
		}

		// Verify the solution
		const result = verifySolution(edges, mathSolution);
		const grade = calculateGrade(result, mathSolution);

		// Update edges with verification results
		setEdges((eds) =>
			eds.map((edge) => ({
				...edge,
				style: {
					...edge.style,
					stroke: result.incorrectConnections.includes(edge.id)
						? '#ef4444'
						: '#22c55e',
					strokeWidth: isMobile ? 4 : 3,
				},
			}))
		);

		// Update nodes with verification results
		setNodes((nds) =>
			nds.map((node) => ({
				...node,
				data: {
					...node.data,
					isCorrect: !result.incorrectNodes.includes(node.id),
					showOrder: result.isCorrect, // Only show order if solution is correct
				},
			}))
		);

		// Only show step order if the solution is correct
		setShowStepOrder(result.isCorrect);

		// Update verification result
		setVerificationResult(result);

		// Notify parent component of verification result
		if (onVerificationUpdate) {
			onVerificationUpdate(result, grade);
		}

		// Show toast with verification result
		if (result.isCorrect) {
			toast({
				title: 'Solution correct!',
				description: `Great job! Your solution is correct. Your grade is ${grade}%.`,
			});
		} else {
			toast({
				title: 'Solution incorrect',
				description: `Your solution has ${result.incorrectConnections.length} incorrect connections. Your grade is ${grade}%.`,
				variant: 'destructive',
			});
		}

		// Fit view to show all nodes after verification
		setTimeout(() => {
			reactFlowInstance?.fitView({ padding: 0.2 });
		}, 50);
	}, [
		edges,
		nodes,
		mathSolution,
		onVerificationUpdate,
		isMobile,
		reactFlowInstance,
	]);

	// Function to automatically connect nodes based on proximity
	const autoConnectNodes = useCallback(() => {
		// Create a copy of nodes sorted by x position (left to right)
		const sortedNodes = [...nodes].sort(
			(a, b) => a.position.x - b.position.x
		);

		// Clear existing edges
		setEdges([]);

		// Connect each node to the next one in the sorted array
		const newEdges: MathEdge[] = [];

		for (let i = 0; i < sortedNodes.length - 1; i++) {
			const sourceNode = sortedNodes[i];
			const targetNode = sortedNodes[i + 1];

			// Find the source node to get its explanation
			const sourceExplanation = sourceNode.data.step.explanation || '';

			// Create a new edge
			const newEdge: MathEdge = {
				id: `e-${sourceNode.id}-${targetNode.id}`,
				source: sourceNode.id,
				target: targetNode.id,
				type: 'smoothstep',
				animated: true,
				style: {
					strokeWidth: isMobile ? 4 : 3,
					stroke: '#a1a1aa',
				},
				markerEnd: {
					type: MarkerType.ArrowClosed,
					width: isMobile ? 20 : 16,
					height: isMobile ? 20 : 16,
					color: '#a1a1aa',
				},
				label: sourceExplanation,
				labelBgPadding: [8, 4],
				labelBgBorderRadius: 4,
				labelBgStyle: {
					fill: '#fff',
					fillOpacity: 0.8,
				},
				labelStyle: {
					fill: '#27272a',
					fontSize: isMobile ? 12 : 14,
					fontWeight: 500,
				},
				data: {},
			};

			newEdges.push(newEdge);
		}

		// Set the new edges
		setEdges(newEdges);

		// Reset verification when connections change
		setVerificationResult(null);
		setGrade(null);

		toast({
			title: 'Auto-Connected Nodes',
			description:
				'Nodes have been automatically connected from left to right.',
			duration: 3000,
		});
	}, [nodes, setEdges, isMobile]);

	return (
		<div
			className='w-full h-full flex flex-col'
			onKeyDown={onKeyDown}
			tabIndex={0}
		>
			<div className='flex-1 relative'>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onEdgeClick={onEdgeClick}
					isValidConnection={isValidConnection}
					nodeTypes={nodeTypes}
					fitView
					className='h-full touch-manipulation'
					defaultEdgeOptions={{
						type: 'smoothstep',
						animated: true,
						style: {
							strokeWidth: isMobile ? 4 : 3,
							stroke: '#6366f1',
						},
						markerEnd: {
							type: MarkerType.ArrowClosed,
							width: isMobile ? 20 : 16,
							height: isMobile ? 20 : 16,
							color: '#6366f1',
						},
						labelBgPadding: [8, 4],
						labelBgBorderRadius: 4,
						labelBgStyle: {
							fill: '#fff',
							fillOpacity: 0.8,
						},
						labelStyle: {
							fill: '#6366f1',
							fontSize: isMobile ? 12 : 14,
							fontWeight: 500,
						},
					}}
					minZoom={0.2}
					maxZoom={2}
					zoomOnScroll={!isMobile}
					zoomOnPinch={true}
					panOnScroll={!isMobile}
					panOnDrag={true}
					selectionOnDrag={false}
					snapToGrid={isMobile}
					snapGrid={[20, 20]}
				>
					<Background
						variant={BackgroundVariant.Dots}
						gap={12}
						size={1}
					/>
					<Controls showInteractive={!isMobile} />

					{/* Control Panel */}
					<Panel
						position='top-right'
						className='bg-background border rounded-lg shadow-md p-2 flex flex-col gap-2 z-50'
					>
						{/* Auto-Connect Button */}
						<Button
							variant='outline'
							size='sm'
							onClick={autoConnectNodes}
							className='flex items-center gap-1'
							title='Auto-Connect Nodes'
						>
							<Wand2 className='h-4 w-4' />
							{!isMobile && <span>Connect</span>}
						</Button>

						<Button
							variant='outline'
							size='sm'
							onClick={handleArrangeNodes}
							className='flex items-center gap-1'
						>
							<ArrowRightLeft className='h-4 w-4' />
							{!isMobile && <span>Arrange</span>}
						</Button>

						{/* Reset button */}
						<Button
							variant='outline'
							size='sm'
							onClick={handleReset}
							className='flex items-center gap-1'
							title='Reset Nodes'
						>
							<RotateCcw className='h-4 w-4' />
							{!isMobile && <span>Reset</span>}
						</Button>

						{/* Fit view button */}
						<Button
							variant='outline'
							size='sm'
							onClick={handleFitView}
							className='flex items-center gap-1'
							title='Fit View'
						>
							<Maximize className='h-4 w-4' />
							{!isMobile && <span>Fit</span>}
						</Button>

						{/* Mobile-only zoom controls */}
						{isMobile && (
							<>
								<Button
									variant='outline'
									size='sm'
									onClick={handleZoomIn}
									className='flex items-center justify-center'
									title='Zoom In'
								>
									<ZoomIn className='h-4 w-4' />
								</Button>
								<Button
									variant='outline'
									size='sm'
									onClick={handleZoomOut}
									className='flex items-center justify-center'
									title='Zoom Out'
								>
									<ZoomOut className='h-4 w-4' />
								</Button>
							</>
						)}

						{/* Delete edge button */}
						<Button
							variant={selectedEdge ? 'destructive' : 'outline'}
							size='sm'
							onClick={handleDeleteSelectedEdge}
							disabled={!selectedEdge}
							className='flex items-center gap-1'
							title='Delete Selected Connection'
						>
							<Trash2 className='h-4 w-4' />
							{!isMobile && <span>Delete</span>}
						</Button>
					</Panel>

					{/* Mobile-specific controls */}
					{isMobile && (
						<Panel
							position='top-left'
							className='bg-background p-2 rounded-md shadow-md border flex gap-1'
						>
							<Button
								variant='outline'
								size='icon'
								onClick={handleZoomIn}
								className='h-8 w-8'
							>
								<ZoomIn className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='icon'
								onClick={handleZoomOut}
								className='h-8 w-8'
							>
								<ZoomOut className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='icon'
								onClick={handleFitView}
								className='h-8 w-8'
							>
								<Move className='h-4 w-4' />
							</Button>
						</Panel>
					)}

					{/* Selected edge notification */}
					{selectedEdge && !isMobile && (
						<Panel
							position='bottom-center'
							className='bg-background p-2 rounded-t-md shadow-md border mb-4'
						>
							<p className='text-sm flex items-center'>
								<span className='font-medium mr-1'>
									Connection selected.
								</span>
								Press Delete key or use the Delete button to
								remove it.
							</p>
						</Panel>
					)}
				</ReactFlow>
			</div>

			<div className={`bg-muted border-t ${isMobile ? 'p-2' : 'p-4'}`}>
				<div className='flex flex-col gap-2'>
					<div
						className={`flex items-center ${isMobile ? 'flex-col gap-2' : 'justify-between'}`}
					>
						<div
							className={`flex items-center ${isMobile ? 'w-full justify-between' : 'gap-2'}`}
						>
							<Button
								variant='outline'
								size={isMobile ? 'sm' : 'sm'}
								onClick={handleReset}
								className={
									isMobile ? 'text-xs px-2 py-1 h-8' : ''
								}
							>
								<RotateCcw
									className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`}
								/>
								Reset
							</Button>

							{/* <Button
								variant='outline'
								size={isMobile ? 'sm' : 'sm'}
								onClick={handleToggleStepOrder}
								className={
									isMobile ? 'text-xs px-2 py-1 h-8' : ''
								}
							>
								<Eye
									className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`}
								/>
								{isMobile
									? showStepOrder
										? 'Hide'
										: 'Show'
									: showStepOrder
										? 'Hide Step Order'
										: 'Reveal Step Order'}
							</Button> */}

							<Button
								variant='default'
								size={isMobile ? 'sm' : 'sm'}
								onClick={handleVerify}
								className={
									isMobile ? 'text-xs px-2 py-1 h-8' : ''
								}
							>
								<Check
									className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`}
								/>
								{isMobile ? 'Check' : 'Check Solution'}
							</Button>
						</div>

						{grade !== null && (
							<div
								className={`flex items-center gap-2 ${isMobile ? 'mt-1 w-full justify-center' : ''}`}
							>
								<Award
									className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} ${grade >= 80 ? 'text-yellow-500' : 'text-muted-foreground'}`}
								/>
								<Badge
									variant={
										grade >= 80 ? 'default' : 'outline'
									}
									className={isMobile ? 'text-xs' : 'text-sm'}
								>
									Grade: {grade}%
								</Badge>
							</div>
						)}
					</div>

					{verificationResult && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className='w-full'
						>
							<div className='flex items-center mb-1'>
								{verificationResult.isCorrect ? (
									<Check
										className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-green-600`}
									/>
								) : (
									<AlertTriangle
										className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-amber-600`}
									/>
								)}
								<span
									className={`${isMobile ? 'text-xs' : 'text-sm'} ${
										verificationResult.isCorrect
											? 'text-green-600'
											: 'text-amber-600'
									}`}
								>
									{verificationResult.feedback}
								</span>
							</div>
							{!verificationResult.isCorrect &&
								grade !== null && (
									<Progress
										value={grade}
										className='h-2 w-full'
									/>
								)}
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
}
