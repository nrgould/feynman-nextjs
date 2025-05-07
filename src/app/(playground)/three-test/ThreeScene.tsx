'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { Filter, Maximize, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
} from '@/components/ui/drawer';
import NodeDetailsDrawer from './NodeDetailsDrawer';
import useMediaQuery from '@/hooks/useMediaQuery';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetTrigger,
} from '@/components/ui/sheet';
import { FilterPanelContent } from './FilterPanelContent';
import { AddNodePanelContent } from './AddNodePanelContent';
import { useUser } from '@clerk/nextjs';
import { addConceptAction } from './actions'; // Keep addConceptAction
import { toast } from 'sonner';
import { UMAP } from 'umap-js'; // <-- Add UMAP import
import { PCA } from 'ml-pca'; // Keep PCA import for potential pre-processing

// Concept categories
const categories = [
	'Mathematics',
	'Physics',
	'Chemistry',
	'Biology',
	'Computer Science',
	'All',
];

// Concept colors for categories - map each category to a specific color
const categoryColors = {
	Mathematics: new THREE.Color(0x4287f5),
	Physics: new THREE.Color(0xf58442),
	Chemistry: new THREE.Color(0x42f572),
	Biology: new THREE.Color(0xf542a7),
	'Computer Science': new THREE.Color(0x8442f5),
	All: new THREE.Color(0x42e8f5),
};

// Shared geometries and materials
const nodeGeometry = new THREE.SphereGeometry(0.05, 32, 16); // Increased segments for smoother sphere
const originalNodeColor = new THREE.Color(0x000000); // Nodes are now black by default
const highlightColor = new THREE.Color(0xaaaaaa); // Light grey highlight for black nodes
const lineMaterial = new THREE.LineBasicMaterial({
	color: 0xff5500, // Keep lines orange for now
	transparent: true,
	opacity: 0.8,
	linewidth: 2,
});

// Standard Material Configuration
const createStandardMaterial = (
	color: THREE.Color,
	metalness = 0.0,
	roughness = 0.9
) => {
	return new THREE.MeshStandardMaterial({
		color: color,
		metalness: metalness,
		roughness: roughness,
		envMapIntensity: 0.8,
	});
};

// Physical Material Configuration (for center sphere)
const createPhysicalMaterial = (
	color: THREE.Color,
	metalness = 0.8,
	roughness = 0.2,
	iors = 1.5,
	transmission = 0.0 // 0 = opaque, 1 = fully transparent/glassy
) => {
	return new THREE.MeshPhysicalMaterial({
		color: color,
		metalness: metalness,
		roughness: roughness,
		ior: iors,
		transmission: transmission,
		thickness: 0.5, // Required for transmission
		specularIntensity: 0.5,
		envMapIntensity: 1.0,
	});
};

// Define a type for our animation tracking
type AnimationTracker =
	| { type: 'gsap'; tween: gsap.core.Tween }
	| { type: 'raf'; id: number };

// Default filter values
const DEFAULT_CATEGORY = 'All';
const DEFAULT_MASTERY_RANGE: [number, number] = [0, 1];
const DEFAULT_SHOW_EDGES = true;

// Define the shape of the concept data fetched from DB (passed as prop)
interface FetchedConcept {
	id: number;
	name: string;
	category: string;
	mastery: number;
	embedding?: number[]; // Add embedding
}

// Define the shape of the concept data used in the component state
interface ConceptState extends FetchedConcept {
	color: THREE.Color; // Make color non-optional here
	visible: boolean; // Make visible non-optional here
}

// Define props for ThreeScene
interface ThreeSceneProps {
	initialConceptsData: FetchedConcept[]; // Accept initial data as prop
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ initialConceptsData }) => {
	// --- Refs --- //
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const controlsRef = useRef<OrbitControls | null>(null);
	const groupRef = useRef<THREE.Group | null>(null);
	const nodesRef = useRef<THREE.Mesh[]>([]);
	const edgesRef = useRef<THREE.Line[]>([]);
	const mouseRef = useRef(new THREE.Vector2());
	const raycasterRef = useRef(new THREE.Raycaster());
	const gradientMapRef = useRef<THREE.Texture | null>(null);
	const initializedRef = useRef<boolean>(false);
	const activeAnimationsRef = useRef<AnimationTracker[]>([]);
	const initialLoadCompletedRef = useRef<boolean>(false);
	const hoveredNodeRef = useRef<THREE.Mesh | null>(null);
	const originalColorRef = useRef<THREE.Color | null>(null);
	const selectedNodeRef = useRef<THREE.Mesh | null>(null);
	const originalCameraPositionRef = useRef<THREE.Vector3 | null>(null);
	const originalTargetRef = useRef<THREE.Vector3 | null>(null);
	const isRotatingRef = useRef<boolean>(true);

	// --- Hooks --- //
	const user = useUser();
	const router = useRouter();
	const searchParams = useSearchParams();
	const isDesktop = useMediaQuery('(min-width: 1024px)');

	// --- State --- //
	// Input/State for Adding Nodes
	const [newConceptName, setNewConceptName] = useState<string>('');
	const [masteryLevel, setMasteryLevel] = useState<number>(0.5);
	const [addNodeCategory, setAddNodeCategory] =
		useState<string>(DEFAULT_CATEGORY);
	const [isAddingNode, setIsAddingNode] = useState<boolean>(false);
	const [isAddNodePanelOpen, setIsAddNodePanelOpen] =
		useState<boolean>(false);
	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

	// Filter State
	const [showEdges, setShowEdges] = useState<boolean>(() => {
		const paramValue = searchParams.get('edges');
		return paramValue !== null ? paramValue === 'true' : DEFAULT_SHOW_EDGES;
	});
	const [selectedCategories, setSelectedCategories] = useState<string[]>(
		() => {
			const paramValue = searchParams.get('categories');
			return paramValue ? paramValue.split(',') : [DEFAULT_CATEGORY];
		}
	);
	const [masteryFilter, setMasteryFilter] = useState<[number, number]>(() => {
		const minParam = searchParams.get('min');
		const maxParam = searchParams.get('max');
		const min =
			minParam !== null ? parseFloat(minParam) : DEFAULT_MASTERY_RANGE[0];
		const max =
			maxParam !== null ? parseFloat(maxParam) : DEFAULT_MASTERY_RANGE[1];
		return [min, max];
	});

	// Node Details/Interaction State
	const [isNodeDetailPanelOpen, setIsNodeDetailPanelOpen] =
		useState<boolean>(false);
	const [selectedNodeData, setSelectedNodeData] =
		useState<FetchedConcept | null>(null);
	const [tooltipContent, setTooltipContent] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);

	// State for concepts - Initialize from prop, mapping to internal state shape
	const [concepts, setConcepts] = useState<ConceptState[]>(() =>
		initialConceptsData.map((concept) => {
			let parsedEmbedding: number[] | undefined = undefined;
			if (typeof concept.embedding === 'string') {
				try {
					// Attempt to parse the string embedding
					parsedEmbedding = JSON.parse(concept.embedding);
					// Validate that the parsed result is an array of numbers
					if (
						!Array.isArray(parsedEmbedding) ||
						!parsedEmbedding.every((v) => typeof v === 'number')
					) {
						console.warn(
							`[Concept Init] Failed to parse embedding string into number array for concept ID ${concept.id}. Value:`,
							concept.embedding
						);
						parsedEmbedding = undefined; // Reset on invalid parse
					}
				} catch (error) {
					console.error(
						`[Concept Init] Error parsing embedding string for concept ID ${concept.id}:`,
						error,
						`Value: ${concept.embedding}`
					);
					parsedEmbedding = undefined; // Reset on error
				}
			} else if (Array.isArray(concept.embedding)) {
				// If it's already an array, use it (basic validation)
				parsedEmbedding = concept.embedding.every(
					(v) => typeof v === 'number'
				)
					? concept.embedding
					: undefined;
			}

			return {
				...concept,
				embedding: parsedEmbedding, // Use the parsed array or undefined
				color:
					categoryColors[concept.category] ||
					new THREE.Color(0xcccccc),
				visible: true,
			};
		})
	);

	// --- Constants --- //
	const sphereMinRadius = 1.0;
	const sphereMaxRadius = 3.0;
	// --- UMAP Parameters --- //
	// Moved here for easier tweaking
	const umapParams = {
		nNeighbors: 15, // Default: 15. Adjust based on data density. Higher values capture global structure, lower values capture local structure. Min ~5.
		minDist: 0.05, // Default: 0.1. Controls how tightly points are packed together. Lower values = tighter clusters.
		nComponents: 3, // Use 3 for 3D visualization
		spread: 0.1, // Default: 1.0. Affects the separation between clusters. Higher values spread points out more.
	};

	// --- Callbacks --- //

	const animateNodeFromCenter = useCallback(
		(node: THREE.Mesh, targetPosition: THREE.Vector3) => {
			node.position.set(0, 0, 0);
			node.visible = true;
			const tween = gsap.to(node.position, {
				x: targetPosition.x,
				y: targetPosition.y,
				z: targetPosition.z,
				duration: 1.5,
				ease: 'elastic.out(1, 0.9)',
				onComplete: () => {
					activeAnimationsRef.current =
						activeAnimationsRef.current.filter(
							(anim) =>
								anim.type !== 'gsap' ||
								(anim as any).tween !== tween
						);
				},
			});
			activeAnimationsRef.current.push({ type: 'gsap', tween });
			return tween;
		},
		[]
	);

	const createNodeMesh = useCallback(
		(
			concept: ConceptState,
			animate: boolean = false,
			position?: THREE.Vector3 // Add position parameter
		) => {
			// Use Standard Material, black nodes, no emission
			const nodeMaterial = createStandardMaterial(
				new THREE.Color(0x000000), // Base color black
				0.0, // metalness
				0.9 // roughness
			);
			console.log(
				`[Node Material] ID: ${concept.id}, Material Type: ${nodeMaterial.type}`
			); // Log material type

			const node = new THREE.Mesh(nodeGeometry.clone(), nodeMaterial);
			node.userData = { ...concept }; // Store all concept data
			node.visible = concept.visible;

			// --- Calculate Scale based on Mastery --- //
			const minScale = 0.5;
			const maxScale = 2.3;
			const masteryScale =
				minScale + (maxScale - minScale) * concept.mastery;
			node.scale.set(masteryScale, masteryScale, masteryScale);

			let targetPosition: THREE.Vector3;
			if (position) {
				// Use provided position if available
				targetPosition = position.clone();
			} else {
				// Otherwise, calculate random spherical position
				const phi = Math.random() * Math.PI;
				const theta = Math.random() * 2 * Math.PI;
				const x = sphereMinRadius * Math.sin(phi) * Math.cos(theta);
				const y = sphereMinRadius * Math.sin(phi) * Math.sin(theta);
				const z = sphereMinRadius * Math.cos(phi);
				targetPosition = new THREE.Vector3(x, y, z);
			}

			if (!animate) {
				node.position.copy(targetPosition);
			} else {
				node.userData.targetPosition = targetPosition;
			}

			return node;
		},
		[sphereMinRadius]
	);

	const applyFilters = useCallback(() => {
		if (!groupRef.current || nodesRef.current.length === 0) return;

		nodesRef.current.forEach((node) => {
			if (
				!node.userData ||
				typeof node.userData.mastery !== 'number' ||
				typeof node.userData.category !== 'string'
			)
				return;
			const { category, mastery } = node.userData as ConceptState;
			const categoryVisible =
				selectedCategories.includes('All') ||
				selectedCategories.includes(category);
			const masteryVisible =
				mastery >= masteryFilter[0] && mastery <= masteryFilter[1];
			node.visible = categoryVisible && masteryVisible;
		});

		edgesRef.current.forEach((edge) => {
			const lineGeometry = edge.geometry as THREE.BufferGeometry;
			const posArray = lineGeometry.attributes.position
				.array as Float32Array;
			const startPos = new THREE.Vector3(
				posArray[0],
				posArray[1],
				posArray[2]
			);
			const endPos = new THREE.Vector3(
				posArray[3],
				posArray[4],
				posArray[5]
			);
			let startNodeVisible = false;
			let endNodeVisible = false;

			for (const node of nodesRef.current) {
				if (!node.visible) continue;
				if (node.position.distanceTo(startPos) < 0.01)
					startNodeVisible = true;
				if (node.position.distanceTo(endPos) < 0.01)
					endNodeVisible = true;
				if (startNodeVisible && endNodeVisible) break;
			}
			edge.visible = showEdges && startNodeVisible && endNodeVisible;
		});
	}, [selectedCategories, masteryFilter, showEdges]);

	const addNode = useCallback(
		async (customName?: string) => {
			if (
				!groupRef.current ||
				!initializedRef.current ||
				!initialLoadCompletedRef.current ||
				isAddingNode
			) {
				console.warn(
					'Cannot add node: Scene not ready or already adding.'
				);
				return;
			}

			setIsAddingNode(true);

			try {
				const tempId = Date.now(); // Use timestamp for temporary client ID
				const conceptName = customName || `Concept ${tempId}`;
				const category =
					addNodeCategory === 'All'
						? categories[
								Math.floor(
									Math.random() * (categories.length - 1)
								)
							]
						: addNodeCategory;
				const nodeColor =
					categoryColors[category] || new THREE.Color(0x999999);
				const conceptPayload = {
					name: conceptName,
					category: category,
					mastery: masteryLevel,
					// Embedding is not set here, it should be added later if needed
				};

				console.log('Calling addConceptAction with:', conceptPayload);
				const result = await addConceptAction(conceptPayload);
				console.log('Server action result:', result);

				if (!result.success || !result.id) {
					throw new Error(
						result.error ||
							'Failed to add concept to database or get ID.'
					);
				}

				const dbConceptId = result.id;
				const newConcept: ConceptState = {
					id: dbConceptId,
					name: conceptName,
					color: nodeColor.clone(),
					mastery: masteryLevel,
					category: category,
					visible: true,
					// Newly added concepts won't have embeddings immediately
				};

				setConcepts((prevConcepts) => [...prevConcepts, newConcept]);

				const newNodeMesh = createNodeMesh(newConcept, true); // No position passed, uses random
				groupRef.current.add(newNodeMesh);
				nodesRef.current.push(newNodeMesh);

				if (newNodeMesh.userData.targetPosition) {
					animateNodeFromCenter(
						newNodeMesh,
						newNodeMesh.userData.targetPosition
					);
				}

				console.log(
					`Added node locally: ${newConcept.name} (DB ID: ${newConcept.id})`
				);

				// Add connection
				if (nodesRef.current.length > 1 && groupRef.current) {
					const randomIndex = Math.floor(
						Math.random() * (nodesRef.current.length - 1)
					);
					const targetNode = nodesRef.current[randomIndex];
					const lineGeometry = new THREE.BufferGeometry();
					const positions = new Float32Array(6);
					lineGeometry.setAttribute(
						'position',
						new THREE.BufferAttribute(positions, 3)
					);
					const line = new THREE.Line(
						lineGeometry,
						lineMaterial.clone()
					);
					line.material.opacity = 0;
					gsap.to(line.material, {
						opacity: 0.8,
						duration: 1.5,
						ease: 'power2.out',
					});

					const updateLine = () => {
						if (!line.parent) return; // Skip update if line was removed
						const posArray = lineGeometry.attributes.position
							.array as Float32Array;
						targetNode.getWorldPosition(tempVec1); // Use temp vectors
						newNodeMesh.getWorldPosition(tempVec2);
						posArray[0] = tempVec1.x;
						posArray[1] = tempVec1.y;
						posArray[2] = tempVec1.z;
						posArray[3] = tempVec2.x;
						posArray[4] = tempVec2.y;
						posArray[5] = tempVec2.z;
						lineGeometry.attributes.position.needsUpdate = true;
					};
					updateLine();
					let animationId = 0;
					const updateAnimation = () => {
						animationId = requestAnimationFrame(updateAnimation);
						updateLine();
					};
					updateAnimation();
					activeAnimationsRef.current.push({
						type: 'raf',
						id: animationId,
					});
					setTimeout(() => {
						cancelAnimationFrame(animationId);
						activeAnimationsRef.current =
							activeAnimationsRef.current.filter(
								(anim) =>
									anim.type !== 'raf' ||
									anim.id !== animationId
							);
					}, 2000);
					if (groupRef.current) {
						groupRef.current.add(line);
					}
					edgesRef.current.push(line);
					// Apply filters immediately after adding the line
					setTimeout(() => applyFilters(), 50); // Small delay might be needed
				}

				toast.success(`Concept "${conceptName}" added successfully!`);
				setIsAddNodePanelOpen(false);
				setNewConceptName(''); // Clear input on success
			} catch (error) {
				console.error('Error adding concept:', error);
				const errorMessage =
					error instanceof Error
						? error.message
						: 'An unexpected error occurred.';
				toast.error(`Failed to add concept: ${errorMessage}`);
			} finally {
				setIsAddingNode(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			addNodeCategory,
			masteryLevel,
			createNodeMesh,
			animateNodeFromCenter,
			isAddingNode,
			applyFilters,
		]
	);

	const handleAddCustomConcept = useCallback(async () => {
		if (newConceptName.trim() && !isAddingNode) {
			await addNode(newConceptName.trim());
		}
	}, [addNode, newConceptName, isAddingNode]);

	const resetCameraView = useCallback(() => {
		if (
			!cameraRef.current ||
			!controlsRef.current ||
			!originalCameraPositionRef.current
		)
			return;
		gsap.to(cameraRef.current.position, {
			...originalCameraPositionRef.current,
			duration: 1.0,
			ease: 'power2.inOut',
			onUpdate: () => {
				controlsRef.current?.update();
			},
		});
		const targetPos =
			originalTargetRef.current || new THREE.Vector3(0, 0, 0);
		gsap.to(controlsRef.current.target, {
			...targetPos,
			duration: 0.8,
			ease: 'power2.inOut',
			onUpdate: () => {
				controlsRef.current?.update();
			},
			onComplete: () => {
				isRotatingRef.current = true;
			},
		});
		selectedNodeRef.current = null;
		originalCameraPositionRef.current = null;
		originalTargetRef.current = null;
	}, []);

	const handleNodeClick = useCallback(
		(node: THREE.Mesh) => {
			if (!cameraRef.current || !controlsRef.current || !groupRef.current)
				return;
			const userData = node.userData as ConceptState;
			setSelectedNodeData({
				id: userData.id,
				name: userData.name,
				category: userData.category,
				mastery: userData.mastery,
			});
			setIsNodeDetailPanelOpen(true);

			if (selectedNodeRef.current === node) {
				resetCameraView();
				return;
			}

			if (!originalCameraPositionRef.current) {
				originalCameraPositionRef.current =
					cameraRef.current.position.clone();
				originalTargetRef.current = controlsRef.current.target.clone();
			}

			selectedNodeRef.current = node;
			isRotatingRef.current = false;
			const worldPosition = new THREE.Vector3();
			node.getWorldPosition(worldPosition);

			gsap.to(controlsRef.current.target, {
				x: worldPosition.x,
				y: worldPosition.y,
				z: worldPosition.z,
				duration: 0.8,
				ease: 'power2.inOut',
				onUpdate: () => {
					controlsRef.current?.update();
				},
			});

			const startPosition = cameraRef.current.position.clone();
			const nodeToCamera = startPosition.sub(worldPosition);
			nodeToCamera.normalize().multiplyScalar(2.0);
			const newCameraPosition = worldPosition.clone().add(nodeToCamera);

			gsap.to(cameraRef.current.position, {
				x: newCameraPosition.x,
				y: newCameraPosition.y,
				z: newCameraPosition.z,
				duration: 1.2,
				ease: 'power2.inOut',
				onUpdate: () => {
					controlsRef.current?.update();
				},
			});
		},
		[resetCameraView]
	);

	const handleNodeDetailPanelOpenChange = useCallback(
		(open: boolean) => {
			setIsNodeDetailPanelOpen(open);
			if (!open && selectedNodeRef.current) {
				resetCameraView();
			}
		},
		[resetCameraView]
	);

	const updateUrlParams = useCallback(() => {
		const params = new URLSearchParams();
		params.set('edges', showEdges.toString());
		params.set('categories', selectedCategories.join(','));
		params.set('min', masteryFilter[0].toString());
		params.set('max', masteryFilter[1].toString());
		const url = `${window.location.pathname}?${params.toString()}`;
		router.push(url, { scroll: false });
	}, [showEdges, selectedCategories, masteryFilter, router]);

	const toggleCategory = useCallback((category: string) => {
		setSelectedCategories((prev) => {
			if (category === 'All')
				return prev.includes('All') && prev.length === 1
					? prev
					: ['All'];
			const newCategories = prev.filter(
				(c) => c !== 'All' && c !== category
			);
			if (!prev.includes(category)) newCategories.push(category);
			return newCategories.length === 0 ? ['All'] : newCategories;
		});
	}, []);

	const resetFilters = useCallback(() => {
		setShowEdges(DEFAULT_SHOW_EDGES);
		setSelectedCategories([DEFAULT_CATEGORY]);
		setMasteryFilter(DEFAULT_MASTERY_RANGE);
		router.push(window.location.pathname, { scroll: false });
	}, [router]);

	// Apply filters when settings change
	useEffect(() => {
		if (initializedRef.current) {
			applyFilters();
		}
	}, [applyFilters, selectedCategories, masteryFilter, showEdges]);

	// Update URL when settings change
	useEffect(() => {
		updateUrlParams();
	}, [updateUrlParams]);

	// Temporary vectors for calculations to avoid allocations in loop/update
	const tempVec1 = new THREE.Vector3();
	const tempVec2 = new THREE.Vector3();

	// --- Effect for Initial Scene Setup --- //
	useEffect(() => {
		if (
			typeof window === 'undefined' ||
			!containerRef.current ||
			initializedRef.current
		) {
			return;
		}

		initializedRef.current = true;
		console.log('[useEffect Init] Initializing Three.js scene...');

		const container = containerRef.current;
		let animationFrameId: number;
		// let initialConnectionTimeoutId: NodeJS.Timeout;

		// Define handlers within useEffect scope
		const onMouseMove = (event: MouseEvent) => {
			if (
				!rendererRef.current ||
				!cameraRef.current ||
				!initialLoadCompletedRef.current
			)
				return;
			const rect = rendererRef.current.domElement.getBoundingClientRect();
			mouseRef.current.x =
				((event.clientX - rect.left) / rect.width) * 2 - 1;
			mouseRef.current.y =
				-((event.clientY - rect.top) / rect.height) * 2 + 1;
			raycasterRef.current.setFromCamera(
				mouseRef.current,
				cameraRef.current
			);
			const intersects = raycasterRef.current.intersectObjects(
				nodesRef.current
			);
			if (intersects.length > 0) {
				const intersectedNode = intersects[0].object as THREE.Mesh;
				if (hoveredNodeRef.current !== intersectedNode) {
					// Restore previous hovered node
					if (hoveredNodeRef.current) {
						const mat = hoveredNodeRef.current
							.material as THREE.MeshStandardMaterial;
						if (originalColorRef.current)
							mat.color.copy(originalColorRef.current);
					}
					// Store current node and its original material properties
					hoveredNodeRef.current = intersectedNode;
					const currentMat =
						intersectedNode.material as THREE.MeshStandardMaterial;
					originalColorRef.current = currentMat.color.clone();

					// Apply highlight
					currentMat.color.copy(highlightColor);

					// Update tooltip
					const userData = intersectedNode.userData as ConceptState;
					const masteryPercentage =
						userData.mastery !== undefined
							? `${(userData.mastery * 100).toFixed(0)}%`
							: 'N/A';
					setTooltipContent(
						`${userData.name}\nCategory: ${userData.category}\nMastery: ${masteryPercentage}`
					);
					setTooltipPosition({
						x: event.clientX + 10,
						y: event.clientY + 10,
					});
				}
			} else {
				// Restore previous hovered node if mouse moves off
				if (hoveredNodeRef.current) {
					const mat = hoveredNodeRef.current
						.material as THREE.MeshStandardMaterial;
					if (originalColorRef.current)
						mat.color.copy(originalColorRef.current);
				}
				hoveredNodeRef.current = null;
				originalColorRef.current = null;
				setTooltipContent(null);
				setTooltipPosition(null);
			}
		};

		const onMouseClick = (event: MouseEvent) => {
			if (!rendererRef.current || !cameraRef.current) return;
			const rect = rendererRef.current.domElement.getBoundingClientRect();
			mouseRef.current.x =
				((event.clientX - rect.left) / rect.width) * 2 - 1;
			mouseRef.current.y =
				-((event.clientY - rect.top) / rect.height) * 2 + 1;
			raycasterRef.current.setFromCamera(
				mouseRef.current,
				cameraRef.current
			);
			const intersects = raycasterRef.current.intersectObjects(
				nodesRef.current
			);
			if (intersects.length > 0)
				handleNodeClick(intersects[0].object as THREE.Mesh);
		};

		const handleResize = () => {
			if (
				!rendererRef.current ||
				!cameraRef.current ||
				!containerRef.current
			)
				return;
			const width = containerRef.current.clientWidth;
			const height = containerRef.current.clientHeight;
			cameraRef.current.aspect = width / height;
			cameraRef.current.updateProjectionMatrix();
			rendererRef.current.setSize(width, height);
		};

		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);
			if (
				!controlsRef.current ||
				!groupRef.current ||
				!rendererRef.current ||
				!sceneRef.current ||
				!cameraRef.current
			)
				return;
			controlsRef.current.update();
			if (isRotatingRef.current) groupRef.current.rotation.y += 0.001;
			rendererRef.current.render(sceneRef.current, cameraRef.current);
		};

		// --- Scene Setup --- //
		const scene = new THREE.Scene();
		sceneRef.current = scene;
		scene.background = new THREE.Color(0xffffff); // White background
		const camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		cameraRef.current = camera;
		camera.position.z = 5;
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		rendererRef.current = renderer;
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		container.appendChild(renderer.domElement);

		// Lighting (Adjusted for contrast)
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased intensity
		directionalLight.position.set(5, 5, 5);
		scene.add(directionalLight);
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Decreased ambient light
		scene.add(ambientLight);

		// Controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controlsRef.current = controls;
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.screenSpacePanning = false;
		controls.minDistance = 2;
		controls.maxDistance = 10;

		// Group and Center Sphere
		const group = new THREE.Group();
		groupRef.current = group;
		scene.add(group);
		const centerSphereGeometry = new THREE.SphereGeometry(0.2, 32, 16); // Smoother geometry
		// Use Physical Material for center sphere - brighter, more reflective
		const centerSphereMaterial = createPhysicalMaterial(
			new THREE.Color(0x88bbff), // Brighter blue
			0.8, // metalness (slightly more metallic)
			0.15, // roughness (smoother/shinier)
			1.5, // ior
			0.0 // transmission (opaque)
		);
		const centerSphere = new THREE.Mesh(
			centerSphereGeometry,
			centerSphereMaterial
		);
		centerSphere.position.set(0, 0, 0);
		centerSphere.userData = { isCenterSphere: true };
		group.add(centerSphere);

		// --- Layout Calculation (UMAP/t-SNE) --- //
		// Rename tsnePositions to layoutPositions for generality
		let layoutPositions = new Map<number, THREE.Vector3>();
		try {
			const conceptsWithEmbeddings = concepts.filter(
				(c) => c.embedding && c.embedding.length > 0
			);

			if (conceptsWithEmbeddings.length > 1) {
				// Need at least 2 points for t-SNE
				console.log(
					`[Layout Calc] Calculating layout for ${conceptsWithEmbeddings.length} concepts.`
				);
				const embeddings = conceptsWithEmbeddings.map(
					(c) => c.embedding!
				); // Non-null assertion safe due to filter

				// --- DEBUG: Log input embeddings ---
				console.log(
					'[Layout Calc Debug] Input embeddings:',
					embeddings
				);
				const hasInvalidEmbedding = embeddings.some((emb, index) => {
					// Robust check: ensure emb is an array before calling .some
					if (!Array.isArray(emb)) {
						console.error(
							`[Layout Calc Error] Embedding at index ${index} is not an array! Type: ${typeof emb}, Value:`,
							emb
						);
						return true; // Found an invalid embedding
					}
					// Now it's safe to call .some
					const hasInvalidValue = emb.some(
						(val) => !Number.isFinite(val)
					);
					if (hasInvalidValue) {
						console.error(
							`[Layout Calc Error] Embedding at index ${index} contains non-finite value:`,
							emb
						);
					}
					return hasInvalidValue;
				});

				if (hasInvalidEmbedding) {
					console.error(
						'[Layout Calc Error] Input embeddings contain invalid data!'
					);
					throw new Error(
						'Invalid embedding data for layout calculation.'
					);
				}
				// --- END DEBUG ---

				// --- PCA Pre-processing (Optional but Recommended) --- //
				const originalDim = embeddings[0].length;
				const targetPcaDim = Math.min(40, originalDim);
				let dataForUmap = embeddings;
				if (
					originalDim > 50 &&
					conceptsWithEmbeddings.length > targetPcaDim
				) {
					console.log(
						`[Layout Calc] Running PCA to reduce from ${originalDim}D to ${targetPcaDim}D`
					);
					const pca = new PCA(embeddings, {
						center: true,
						scale: true,
					});
					dataForUmap = pca
						.predict(embeddings, { nComponents: targetPcaDim })
						.to2DArray();
					console.log('[Layout Calc] PCA complete.');
				} else {
					console.log(
						'[Layout Calc] Skipping PCA (dim <= 50 or not enough data).'
					);
				}
				// --- End PCA ---

				// --- UMAP Calculation --- //
				const nPoints = dataForUmap.length;
				// Adjust nNeighbors dynamically if necessary
				const adjustedParams = {
					...umapParams,
					nNeighbors: Math.min(
						umapParams.nNeighbors,
						Math.max(5, nPoints - 1) // Ensure nNeighbors is between 5 and nPoints-1
					),
				};
				console.log(
					'[Layout Calc] Running UMAP with params:',
					adjustedParams
				);
				const umap = new UMAP(adjustedParams);
				const rawOutput = umap.fit(dataForUmap); // Use fit directly
				console.log('[Layout Calc] UMAP complete.');

				if (!rawOutput || rawOutput.length !== nPoints) {
					throw new Error('UMAP did not return valid output.');
				}
				// --- End UMAP --- //

				// --- Sphere Normalization --- //
				console.log(
					'[Layout Calc] Normalizing UMAP output into sphere...'
				);
				const vecMagnitude = (vec: number[]) =>
					Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));

				// 1. Centre at origin
				const centroid = rawOutput
					.reduce((c, v) => c.map((d, i) => d + v[i]), [0, 0, 0])
					.map((d) => d / nPoints);
				const centred = rawOutput.map((v) =>
					v.map((d, i) => d - centroid[i])
				);

				// 2. Find the *max* radius after centering
				let maxR = 0;
				for (const v of centred) {
					maxR = Math.max(maxR, vecMagnitude(v));
				}

				// 3. Scale so that maxR -> sphereMaxRadius
				const scale = maxR > 1e-9 ? sphereMaxRadius / maxR : 1.0; // Avoid division by zero

				centred.forEach((v, index) => {
					const id = conceptsWithEmbeddings[index].id;
					const finalPos = new THREE.Vector3(
						v[0] * scale,
						v[1] * scale,
						v[2] * scale
					);
					layoutPositions.set(id, finalPos);
				});
				console.log('[Layout Calc] UMAP + Normalization complete.');
				// --- End Normalization --- //
			} else {
				console.log(
					'[Layout Calc] Not enough concepts with embeddings, using random positions.'
				);
			}
		} catch (error) {
			console.error(
				'[Layout Calc] Error during UMAP/Normalization:',
				error
			);
			// Fallback to random positions if calculation fails
			layoutPositions = new Map<number, THREE.Vector3>();
		}

		// --- Create Initial Nodes from State --- //
		console.log(
			`[useEffect Init] Creating ${concepts.length} nodes from initial state...`
		);
		nodesRef.current = [];
		edgesRef.current = [];
		// Clear previous objects except center sphere
		const objectsToRemove = group.children.filter(
			(child) => child !== centerSphere
		);
		objectsToRemove.forEach((child) => group.remove(child));

		concepts.forEach((concept) => {
			// Use layoutPositions map (contains UMAP or empty)
			const precalculatedPosition = layoutPositions.get(concept.id);
			const nodeMesh = createNodeMesh(
				concept,
				true,
				precalculatedPosition // Pass position if available
			);
			group.add(nodeMesh);
			nodesRef.current.push(nodeMesh);
		});
		console.log(
			`[useEffect Init] Created ${nodesRef.current.length} node meshes.`
		);

		// --- Animate Nodes --- //
		console.log(
			`[useEffect Init] Starting animations for ${nodesRef.current.length} nodes`
		);
		nodesRef.current.forEach((nodeMesh, index) => {
			if (nodeMesh.userData && nodeMesh.userData.targetPosition) {
				setTimeout(() => {
					animateNodeFromCenter(
						nodeMesh,
						nodeMesh.userData.targetPosition
					);
				}, index * 50);
			}
		});

		// --- Add Initial Connections --- //
		const initialConnectionTimeoutId = setTimeout(() => {
			console.log('[useEffect Init] Creating initial connections...');
			const initialConnections = Math.min(
				30,
				Math.floor(nodesRef.current.length * 1.5)
			);
			let createdCount = 0;
			for (
				let i = 0;
				i < initialConnections && nodesRef.current.length > 1;
				i++
			) {
				const startIndex = Math.floor(
					Math.random() * nodesRef.current.length
				);
				let endIndex = Math.floor(
					Math.random() * nodesRef.current.length
				);
				while (startIndex === endIndex)
					endIndex = Math.floor(
						Math.random() * nodesRef.current.length
					);
				const startNode = nodesRef.current[startIndex];
				const endNode = nodesRef.current[endIndex];
				const lineGeometry = new THREE.BufferGeometry();
				const positions = new Float32Array(6);
				lineGeometry.setAttribute(
					'position',
					new THREE.BufferAttribute(positions, 3)
				);
				const line = new THREE.Line(lineGeometry, lineMaterial.clone());
				line.material.opacity = 0;
				gsap.to(line.material, {
					opacity: 0.8,
					duration: 1.5,
					delay: 0.5,
					ease: 'power2.out',
				});
				line.visible = showEdges;

				const updateLine = () => {
					if (!line.parent) return; // Skip update if line removed
					const posArray = lineGeometry.attributes.position
						.array as Float32Array;
					startNode.getWorldPosition(tempVec1);
					endNode.getWorldPosition(tempVec2);
					posArray[0] = tempVec1.x;
					posArray[1] = tempVec1.y;
					posArray[2] = tempVec1.z;
					posArray[3] = tempVec2.x;
					posArray[4] = tempVec2.y;
					posArray[5] = tempVec2.z;
					lineGeometry.attributes.position.needsUpdate = true;
				};
				updateLine();
				let connectionRafId = 0;
				const updateConnectionAnimation = () => {
					connectionRafId = requestAnimationFrame(
						updateConnectionAnimation
					);
					updateLine();
				};
				updateConnectionAnimation();
				activeAnimationsRef.current.push({
					type: 'raf',
					id: connectionRafId,
				});
				setTimeout(() => {
					cancelAnimationFrame(connectionRafId);
					activeAnimationsRef.current =
						activeAnimationsRef.current.filter(
							(anim) =>
								anim.type !== 'raf' ||
								anim.id !== connectionRafId
						);
				}, 2000);
				if (groupRef.current) {
					groupRef.current.add(line);
				}
				edgesRef.current.push(line);
				createdCount++;
			}
			console.log(
				`[useEffect Init] Created ${createdCount} initial connections.`
			);
			initialLoadCompletedRef.current = true;
			console.log('[useEffect Init] Initial load marked complete.');
			applyFilters(); // Apply initial filters
		}, 300);

		// Add event listeners
		container.addEventListener('mousemove', onMouseMove);
		container.addEventListener('click', onMouseClick);
		window.addEventListener('resize', handleResize);

		// Start animation loop
		animate();

		// --- Cleanup --- //
		return () => {
			console.log('[useEffect Init] Cleaning up Three.js scene...');
			clearTimeout(initialConnectionTimeoutId);
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener('resize', handleResize);
			if (containerRef.current) {
				containerRef.current.removeEventListener(
					'mousemove',
					onMouseMove
				);
				containerRef.current.removeEventListener('click', onMouseClick);
			}
			activeAnimationsRef.current.forEach((anim) => {
				if (anim.type === 'gsap')
					(
						anim as { type: 'gsap'; tween: gsap.core.Tween }
					).tween.kill();
				else if (anim.type === 'raf')
					cancelAnimationFrame(
						(anim as { type: 'raf'; id: number }).id
					);
			});
			activeAnimationsRef.current = [];
			if (controlsRef.current) controlsRef.current.dispose();
			if (rendererRef.current) {
				if (
					containerRef.current?.contains(
						rendererRef.current.domElement
					)
				) {
					containerRef.current.removeChild(
						rendererRef.current.domElement
					);
				}
				rendererRef.current.dispose();
			}
			// Dispose geometries/materials
			nodeGeometry.dispose();
			lineMaterial.dispose();
			centerSphereGeometry.dispose();
			(centerSphereMaterial as THREE.Material)?.dispose(); // Dispose main material
			// (centerOutlineMaterial as THREE.Material)?.dispose(); // Outline removed
			gradientMapRef.current?.dispose();
			// Clear refs
			groupRef.current = null;
			sceneRef.current = null;
			cameraRef.current = null;
			rendererRef.current = null;
			controlsRef.current = null;
			nodesRef.current = [];
			edgesRef.current = [];
			initialLoadCompletedRef.current = false;
			initializedRef.current = false;
		};
		// Re-run effect if the initial data identity changes (though unlikely for props)
		// Or if callbacks change (they are memoized, so should be stable)
	}, [
		initialConceptsData,
		createNodeMesh,
		animateNodeFromCenter,
		applyFilters,
	]);

	// --- Props for Panels --- //
	const filterContentProps = {
		categories,
		showEdges,
		setShowEdges,
		selectedCategories,
		toggleCategory,
		masteryFilter,
		setMasteryFilter,
		resetFilters,
	};
	const addNodeContentProps = {
		categories,
		masteryLevel,
		setMasteryLevel,
		addNodeCategory,
		setAddNodeCategory,
		onAddRandom: async () => {
			if (!isAddingNode) await addNode();
		},
		onAddCustom: handleAddCustomConcept,
		isAdding: isAddingNode,
		newConceptName: newConceptName,
		setNewConceptName: setNewConceptName,
	};

	// --- Render Component --- //
	return (
		<div style={{ width: '100%', height: '100vh', position: 'relative' }}>
			{/* Title */}
			<h1 className='absolute top-5 left-5 z-10 text-3xl font-bold text-gray-800 select-none'>
				{user?.user?.username}&apos;s Mind Map
			</h1>

			{/* Action Buttons Group */}
			<div className='absolute top-5 right-5 z-50 flex flex-col space-y-2'>
				{/* Add Node Panel */}
				{isDesktop ? (
					<Sheet
						open={isAddNodePanelOpen}
						onOpenChange={setIsAddNodePanelOpen}
					>
						<SheetTrigger asChild>
							<Button
								variant='outline'
								size='icon'
								title='Add Concept'
							>
								<Plus className='h-4 w-4' />
							</Button>
						</SheetTrigger>
						<SheetContent
							side='right'
							className='w-[350px] sm:w-[400px]'
						>
							<SheetHeader>
								<SheetTitle>Add New Concept</SheetTitle>
								<SheetDescription>
									Configure and add a new concept node.
								</SheetDescription>
							</SheetHeader>
							<div>
								<AddNodePanelContent
									{...addNodeContentProps}
									onClose={() => setIsAddNodePanelOpen(false)}
								/>
							</div>
						</SheetContent>
					</Sheet>
				) : (
					<Drawer
						open={isAddNodePanelOpen}
						onOpenChange={setIsAddNodePanelOpen}
						shouldScaleBackground={false}
					>
						<DrawerTrigger asChild>
							<Button
								variant='outline'
								size='icon'
								title='Add Concept'
							>
								<Plus className='h-4 w-4' />
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<div className='mx-auto w-full max-w-sm'>
								<DrawerHeader>
									<DrawerTitle>Add New Concept</DrawerTitle>
									<DrawerDescription>
										Configure and add a new concept node.
									</DrawerDescription>
								</DrawerHeader>
								<div className='pb-0'>
									<AddNodePanelContent
										{...addNodeContentProps}
										onClose={() =>
											setIsAddNodePanelOpen(false)
										}
									/>
								</div>
							</div>
						</DrawerContent>
					</Drawer>
				)}
				{/* Filter Panel */}
				{isDesktop ? (
					<Sheet
						open={isFilterPanelOpen}
						onOpenChange={setIsFilterPanelOpen}
					>
						<SheetTrigger asChild>
							<Button
								variant='outline'
								size='icon'
								title='Filters'
							>
								<Filter className='h-4 w-4' />
							</Button>
						</SheetTrigger>
						<SheetContent
							side='right'
							className='w-[300px] sm:w-[350px]'
						>
							<SheetHeader>
								<SheetTitle>Filters</SheetTitle>
								<SheetDescription>
									Adjust node visibility.
								</SheetDescription>
							</SheetHeader>
							<div className='pb-0'>
								<FilterPanelContent
									{...filterContentProps}
									onClose={() => setIsFilterPanelOpen(false)}
								/>
							</div>
						</SheetContent>
					</Sheet>
				) : (
					<Drawer
						open={isFilterPanelOpen}
						onOpenChange={setIsFilterPanelOpen}
						shouldScaleBackground={false}
					>
						<DrawerTrigger asChild>
							<Button
								variant='outline'
								size='icon'
								title='Filters'
							>
								<Filter className='h-4 w-4' />
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<div className='mx-auto w-full max-w-sm'>
								<DrawerHeader>
									<DrawerTitle>Filters</DrawerTitle>
									<DrawerDescription>
										Adjust node visibility.
									</DrawerDescription>
								</DrawerHeader>
								<div className='pb-0'>
									<FilterPanelContent
										{...filterContentProps}
										onClose={() =>
											setIsFilterPanelOpen(false)
										}
									/>
								</div>
							</div>
						</DrawerContent>
					</Drawer>
				)}
				{/* Reset View Button */}
				<Button
					variant='outline'
					size='icon'
					onClick={resetCameraView}
					title='Reset View'
				>
					<Maximize className='h-4 w-4' />
				</Button>
			</div>

			{/* Canvas Container */}
			<div
				ref={containerRef}
				style={{
					width: '100%',
					height: '100%',
					cursor: 'grab',
					position: 'absolute',
					top: 0,
					left: 0,
				}}
			/>

			{/* Tooltip */}
			{tooltipContent && tooltipPosition && (
				<div
					style={{
						position: 'absolute',
						left: `${tooltipPosition.x}px`,
						top: `${tooltipPosition.y}px`,
						background: 'rgba(0, 0, 0, 0.7)',
						color: 'white',
						padding: '5px 10px',
						borderRadius: '3px',
						fontSize: '12px',
						pointerEvents: 'none',
						whiteSpace: 'pre-line',
						zIndex: 20,
					}}
				>
					{tooltipContent}
				</div>
			)}

			{/* Node Details Drawer */}
			<NodeDetailsDrawer
				isOpen={isNodeDetailPanelOpen}
				onOpenChange={handleNodeDetailPanelOpenChange}
				nodeData={selectedNodeData}
			/>
		</div>
	);
};

export default ThreeScene;
