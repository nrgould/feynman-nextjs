'use client';

import {
	useState,
	useCallback,
	useMemo,
	useEffect,
	useImperativeHandle,
	forwardRef,
	useRef,
} from 'react';
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
	onPlacedStepsChange?: (placedStepIds: string[]) => void;
}

// Export the handle type for TypeScript
export interface MathSolutionFlowHandle {
	verifyCurrentSolution: () => void;
	resetCanvas: () => void;
}

export const MathSolutionFlow = forwardRef<
	MathSolutionFlowHandle,
	MathSolutionFlowProps
>(
	(
		{
			mathSolution,
			onEdgesUpdate,
			onVerificationUpdate,
			onPlacedStepsChange,
		},
		ref
	) => {
		// Check if device is mobile
		const isMobile = useMediaQuery('(max-width: 768px)');

		// Get ReactFlow instance for programmatic control
		const reactFlowInstance = useReactFlow();
		const reactFlowWrapper = useRef<HTMLDivElement>(null);

		// Track placed steps
		const [placedSteps, setPlacedSteps] = useState<string[]>([]);

		// Define node types
		const nodeTypes = useMemo(() => ({ mathStep: MathStepNode }), []);

		// State for nodes and edges - start with empty arrays
		const [nodes, setNodes] = useState<MathNode[]>([]);
		const [edges, setEdges] = useState<MathEdge[]>([]);

		// State for verification results
		const [verificationResult, setVerificationResult] =
			useState<VerificationResult | null>(null);
		const [grade, setGrade] = useState<number | null>(null);
		const [showStepOrder, setShowStepOrder] = useState(false);
		const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

		// Handle drag over event
		const onDragOver = useCallback(
			(event: React.DragEvent<HTMLDivElement>) => {
				event.preventDefault();
				event.dataTransfer.dropEffect = 'move';
			},
			[]
		);

		// Handle drop event
		const onDrop = useCallback(
			(event: React.DragEvent<HTMLDivElement>) => {
				event.preventDefault();

				if (!reactFlowWrapper.current || !reactFlowInstance) return;

				// Get the step data from the drag event
				const stepData = JSON.parse(
					event.dataTransfer.getData('application/json')
				);

				// Check if this step is already on the canvas
				if (placedSteps.includes(stepData.id)) return;

				// Get the position where the step was dropped
				const reactFlowBounds =
					reactFlowWrapper.current.getBoundingClientRect();
				const position = reactFlowInstance.screenToFlowPosition({
					x: event.clientX - reactFlowBounds.left,
					y: event.clientY - reactFlowBounds.top,
				});

				// Create a new node for the step
				const newNode: MathNode = {
					id: stepData.id,
					type: 'mathStep',
					position,
					data: {
						step: stepData,
						showOrder: showStepOrder,
						isMobile,
					},
				};

				// Add the new node to the canvas
				setNodes((nds) => [...nds, newNode]);

				// Update the list of placed steps
				const updatedPlacedSteps = [...placedSteps, stepData.id];
				setPlacedSteps(updatedPlacedSteps);

				// Notify parent component of placed steps change
				if (onPlacedStepsChange) {
					onPlacedStepsChange(updatedPlacedSteps);
				}
			},
			[
				reactFlowInstance,
				placedSteps,
				showStepOrder,
				isMobile,
				onPlacedStepsChange,
			]
		);

		// Reset the canvas
		const resetCanvas = useCallback(() => {
			// Clear all nodes and edges
			setNodes([]);
			setEdges([]);

			// Reset state
			setVerificationResult(null);
			setGrade(null);
			setShowStepOrder(false);
			setSelectedEdge(null);

			// Clear the placed steps list
			setPlacedSteps([]);

			// Notify parent component that all steps have been removed from the canvas
			if (onPlacedStepsChange) {
				onPlacedStepsChange([]);
			}

			// Notify parent component of edges update
			if (onEdgesUpdate) {
				onEdgesUpdate([]);
			}

			// Notify parent component of verification update
			if (onVerificationUpdate) {
				onVerificationUpdate(
					{
						isCorrect: false,
						incorrectConnections: [],
						incorrectNodes: [],
						feedback: '',
					},
					0
				);
			}

			// Show confirmation toast
			toast({
				title: 'Canvas Reset',
				description: 'All steps have been returned to the sidebar.',
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [onPlacedStepsChange, onEdgesUpdate, onVerificationUpdate, toast]);

		// Expose functions through the ref
		useImperativeHandle(ref, () => ({
			verifyCurrentSolution: handleVerify,
			resetCanvas,
		}));

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
				correctConnectionsMap.set(
					sortedSteps[i].id,
					sortedSteps[i + 1].id
				);
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

		// Function to check if a node already has a connection
		const hasConnection = useCallback(
			(nodeId: string, isSource: boolean) => {
				return edges.some((edge) =>
					isSource ? edge.source === nodeId : edge.target === nodeId
				);
			},
			[edges]
		);

		// Function to validate connections
		const isValidConnection = useCallback(
			(connection: Connection | MathEdge): boolean => {
				// Prevent connecting a node to itself
				if (connection.source === connection.target) {
					toast({
						title: 'Invalid connection',
						description: 'You cannot connect a step to itself.',
						variant: 'destructive',
					});
					return false;
				}

				// Check if source already has an outgoing connection
				const sourceHasConnection = hasConnection(
					connection.source,
					true
				);
				if (sourceHasConnection) {
					toast({
						title: 'Connection already exists',
						description:
							'This step already has an outgoing connection. Delete it first before creating a new one.',
						variant: 'destructive',
					});
					return false;
				}

				// Check if target already has an incoming connection
				const targetHasConnection = hasConnection(
					connection.target,
					false
				);
				if (targetHasConnection) {
					toast({
						title: 'Connection already exists',
						description:
							'This step already has an incoming connection. Delete it first before creating a new one.',
						variant: 'destructive',
					});
					return false;
				}

				return true;
			},
			[hasConnection, toast]
		);

		// Handle edge connections
		const onConnect = useCallback(
			(params: Connection) => {
				// Check if the connection is valid
				if (!isValidConnection(params)) {
					return;
				}

				// Find the source and target nodes to get their data
				const sourceNode = nodes.find(
					(node) => node.id === params.source
				);
				const targetNode = nodes.find(
					(node) => node.id === params.target
				);

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
					markerEnd: {
						type: MarkerType.ArrowClosed,
						width: isMobile ? 20 : 16,
						height: isMobile ? 20 : 16,
						color: '#6366f1',
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
			[
				edges,
				nodes,
				onEdgesUpdate,
				isMobile,
				setEdges,
				toast,
				isValidConnection,
			]
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
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[isMobile]
		);

		// Handle edge deletion with Delete key
		const onKeyDown = useCallback(
			(event: React.KeyboardEvent) => {
				if (event.key === 'Delete' && selectedEdge) {
					handleDeleteSelectedEdge();
				}
			},
			[selectedEdge]
		);

		// Function to delete the selected edge
		const handleDeleteSelectedEdge = useCallback(() => {
			if (selectedEdge) {
				setEdges((eds) => eds.filter((e) => e.id !== selectedEdge));

				// Notify parent component of edges update
				if (onEdgesUpdate) {
					onEdgesUpdate(edges.filter((e) => e.id !== selectedEdge));
				}

				setSelectedEdge(null);
				toast({
					title: 'Connection deleted',
					description: 'The connection has been removed.',
				});
			}
		}, [selectedEdge, setEdges, edges, onEdgesUpdate, toast]);

		// Handle reset button click
		const handleReset = useCallback(() => {
			toast({
				title: 'Resetting Canvas',
				description: 'Returning all steps to the sidebar...',
				duration: 2000,
			});
			resetCanvas();
		}, [resetCanvas, toast]);

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
					description:
						'Challenge yourself to find the correct order.',
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

		// Update the handleVerify function to check if all steps are placed
		const handleVerify = useCallback(() => {
			// Check if all steps have been placed on the canvas
			if (placedSteps.length < mathSolution.steps.length) {
				toast({
					title: 'Incomplete Solution',
					description:
						'Please place all steps on the canvas before verifying.',
					variant: 'destructive',
				});
				return;
			}

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
			const calculatedGrade = calculateGrade(result, mathSolution);

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
			setGrade(calculatedGrade);

			// Notify parent component of verification result
			if (onVerificationUpdate) {
				onVerificationUpdate(result, calculatedGrade);
			}

			// Show toast with verification result
			if (result.isCorrect) {
				toast({
					title: 'Solution correct!',
					description: `Great job! Your solution is correct. Your grade is ${calculatedGrade}%.`,
				});
			} else {
				toast({
					title: 'Solution incorrect',
					description: `Your solution has ${result.incorrectConnections.length} incorrect connections. Your grade is ${calculatedGrade}%.`,
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
			placedSteps,
			setEdges,
			setNodes,
			setShowStepOrder,
			setVerificationResult,
			verifySolution,
			calculateGrade,
			toast,
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
				const sourceExplanation =
					sourceNode.data.step.explanation || '';

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
				className='h-full w-full'
				ref={reactFlowWrapper}
				onKeyDown={onKeyDown}
				tabIndex={0}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={(changes) => {
						setNodes((nds) => applyNodeChanges(changes, nds));
					}}
					onEdgesChange={(changes) => {
						setEdges((eds) => applyEdgeChanges(changes, eds));
					}}
					onConnect={onConnect}
					onEdgeClick={onEdgeClick}
					onDragOver={onDragOver}
					onDrop={onDrop}
					nodeTypes={nodeTypes}
					fitView
					fitViewOptions={{ padding: 0.2 }}
					minZoom={0.5}
					maxZoom={2}
					defaultViewport={{ x: 0, y: 0, zoom: 1 }}
					proOptions={{ hideAttribution: true }}
					deleteKeyCode={null} // Disable default delete key behavior
				>
					<Background
						variant={BackgroundVariant.Dots}
						gap={isMobile ? 15 : 20}
						size={isMobile ? 0.5 : 1}
					/>
					<Controls showInteractive={false} />

					{/* Top panel for step count */}
					<Panel
						position='top-center'
						className='flex justify-center'
					>
						{placedSteps.length > 0 && (
							<Badge variant='outline' className='mb-2 text-sm'>
								{placedSteps.length} /{' '}
								{mathSolution.steps.length} Steps Placed
							</Badge>
						)}
					</Panel>

					{/* Top-right panel for utility buttons */}
					<Panel position='top-right' className='space-y-2'>
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

					{/* Bottom panel for verification */}
					<Panel position='bottom-center' className='mb-4'>
						<Button
							variant='default'
							size='lg'
							onClick={handleVerify}
							disabled={
								placedSteps.length < 2 || edges.length === 0
							}
							className='flex items-center gap-2 shadow-md'
						>
							<Check className='h-5 w-5' />
							Verify Solution
						</Button>
					</Panel>
				</ReactFlow>
			</div>
		);
	}
);

// Add display name to fix the linter error
MathSolutionFlow.displayName = 'MathSolutionFlow';
