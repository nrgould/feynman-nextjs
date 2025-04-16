'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { gsap } from 'gsap';
import {
	ChevronLeft,
	ChevronRight,
	X,
	Eye,
	EyeOff,
	Filter,
	Maximize,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import NodeDetailsDrawer from './NodeDetailsDrawer';

// Initial Dummy concept data
const initialConceptNames = Array.from(
	{ length: 20 },
	(_, i) => `Concept ${i + 1}`
);

// Concept categories
const categories = [
	'Mathematics',
	'Physics',
	'Chemistry',
	'Biology',
	'Computer Science',
	'All',
];

// Concept colors for swatches
const conceptColors = [
	{ name: 'Blue', hex: '#4287f5', color: new THREE.Color(0x4287f5) },
	{ name: 'Green', hex: '#42f572', color: new THREE.Color(0x42f572) },
	{ name: 'Purple', hex: '#8442f5', color: new THREE.Color(0x8442f5) },
	{ name: 'Orange', hex: '#f58442', color: new THREE.Color(0xf58442) },
	{ name: 'Pink', hex: '#f542a7', color: new THREE.Color(0xf542a7) },
	{ name: 'Cyan', hex: '#42e8f5', color: new THREE.Color(0x42e8f5) },
];

// Shared geometries and materials (can be reused)
const nodeGeometry = new THREE.SphereGeometry(0.05, 8, 8); // Reduced segments for blocky look
const originalNodeColor = new THREE.Color(0x4287f5); // Blue
const highlightColor = new THREE.Color(0xf5a742); // Amber highlight
const lineMaterial = new THREE.LineBasicMaterial({
	color: 0xff5500, // Changed to bright orange for better contrast
	transparent: true,
	opacity: 0.8, // Increased opacity
	linewidth: 2, // Note: linewidth only works in WebGLRenderer with certain extensions
});

// Toon shader configuration
const createToonMaterial = (color) => {
	return new THREE.MeshToonMaterial({
		color: color,
		gradientMap: null, // We'll set this up in the effect
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

const ThreeScene: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const controlsRef = useRef<OrbitControls | null>(null);
	const groupRef = useRef<THREE.Group | null>(null);
	const nodesRef = useRef<THREE.Mesh[]>([]); // Ref to store node meshes
	const mouseRef = useRef(new THREE.Vector2());
	const raycasterRef = useRef(new THREE.Raycaster());
	const gradientMapRef = useRef<THREE.Texture | null>(null);
	const initializedRef = useRef<boolean>(false); // Track if the scene has been initialized
	const [newConceptName, setNewConceptName] = useState<string>('');
	const [selectedColor, setSelectedColor] = useState<
		(typeof conceptColors)[0]
	>(conceptColors[0]);
	const [masteryLevel, setMasteryLevel] = useState<number>(0.5); // Default to middle value
	const sphereMinRadius = 1.0; // Minimum radius (center)
	const sphereMaxRadius = 3.0; // Maximum radius (edge)

	// UI state
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const [showEdges, setShowEdges] = useState<boolean>(DEFAULT_SHOW_EDGES);
	const [selectedCategory, setSelectedCategory] =
		useState<string>(DEFAULT_CATEGORY);
	const [addNodeCategory, setAddNodeCategory] =
		useState<string>(DEFAULT_CATEGORY);
	const [masteryFilter, setMasteryFilter] = useState<[number, number]>(
		DEFAULT_MASTERY_RANGE
	); // [min, max]
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [selectedNodeData, setSelectedNodeData] = useState<{
		name: string;
		mastery: number;
		category: string;
		id: number;
	} | null>(null);

	// Animation tweens collection
	const activeAnimationsRef = useRef<AnimationTracker[]>([]);
	const edgesRef = useRef<THREE.Line[]>([]);
	const applyFiltersRef = useRef<() => void>(() => {});

	// State for concepts with expanded type
	const [concepts, setConcepts] = useState<
		{
			id: number;
			name: string;
			color?: THREE.Color;
			mastery?: number;
			category?: string;
			visible?: boolean;
		}[]
	>(
		initialConceptNames.map((name, i) => ({
			id: i,
			name,
			color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
			mastery: Math.random(), // Random mastery level for initial nodes
			category:
				categories[Math.floor(Math.random() * (categories.length - 1))], // Random category (not "All")
			visible: true,
		}))
	);
	const [tooltipContent, setTooltipContent] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const hoveredNodeRef = useRef<THREE.Mesh | null>(null);
	const originalColorRef = useRef<THREE.Color | null>(null);
	const selectedNodeRef = useRef<THREE.Mesh | null>(null);
	const isRotatingRef = useRef<boolean>(true);
	const originalCameraPositionRef = useRef<THREE.Vector3 | null>(null);
	const originalTargetRef = useRef<THREE.Vector3 | null>(null);

	// Add a new ref to track initial load
	const initialLoadCompletedRef = useRef<boolean>(false);

	// Function to animate node from center to target position
	const animateNodeFromCenter = useCallback(
		(node: THREE.Mesh, targetPosition: THREE.Vector3) => {
			// Store original position
			const targetX = targetPosition.x;
			const targetY = targetPosition.y;
			const targetZ = targetPosition.z;

			// Set initial position at center
			node.position.set(0, 0, 0);

			// Ensure node is visible
			node.visible = true;

			// Create animation
			const tween = gsap.to(node.position, {
				x: targetX,
				y: targetY,
				z: targetZ,
				duration: 1.5,
				ease: 'elastic.out(1, 0.8)',
				onComplete: () => {
					// Remove this tween from active animations when complete
					activeAnimationsRef.current =
						activeAnimationsRef.current.filter(
							(anim) =>
								anim.type !== 'gsap' ||
								(anim as any).tween !== tween
						);

					// Apply visibility filters after animation completes
					if (applyFiltersRef.current) {
						applyFiltersRef.current();
					}
				},
			});

			// Add to active animations
			activeAnimationsRef.current.push({ type: 'gsap', tween });

			return tween;
		},
		[]
	);

	// Function to create a single node mesh with animation capability
	const createNodeMesh = useCallback(
		(
			concept: {
				id: number;
				name: string;
				color?: THREE.Color;
				mastery?: number;
				category?: string;
				visible?: boolean;
			},
			animate: boolean = false
		) => {
			// Use provided color or generate a random one
			const nodeColor =
				concept.color ||
				new THREE.Color().setHSL(
					0.3 + Math.random() * 0.15,
					0.7 + Math.random() * 0.3,
					0.5 + Math.random() * 0.2
				);
			const nodeMaterial = createToonMaterial(nodeColor);

			const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
			node.userData = {
				id: concept.id,
				name: concept.name,
				mastery: concept.mastery !== undefined ? concept.mastery : 0.5, // Default to middle if not provided
				category: concept.category || categories[0], // Default to first category if not provided
				visible: concept.visible !== undefined ? concept.visible : true,
			};

			// Set initial visibility
			node.visible = node.userData.visible;

			// Calculate target position based on mastery level
			const mastery =
				concept.mastery !== undefined ? concept.mastery : 0.5;
			const sphereRadius =
				sphereMinRadius + (sphereMaxRadius - sphereMinRadius) * mastery;

			const phi = Math.random() * Math.PI;
			const theta = Math.random() * 2 * Math.PI;
			const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
			const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
			const z = sphereRadius * Math.cos(phi);

			// If animated, position will be set by the animation
			// If not animated, set position immediately
			if (!animate) {
				node.position.set(x, y, z);
			} else {
				// For animated nodes, we'll store the target position in userData for later
				node.userData.targetPosition = new THREE.Vector3(x, y, z);
			}

			// Add black outline to enhance cartoon look
			const outlineMaterial = new THREE.MeshBasicMaterial({
				color: 0x000000,
				side: THREE.BackSide,
			});
			const outlineMesh = new THREE.Mesh(
				nodeGeometry.clone().scale(1.15, 1.15, 1.15),
				outlineMaterial
			);
			node.add(outlineMesh);

			return node;
		},
		[sphereMinRadius, sphereMaxRadius]
	);

	// Function to add a new concept/node with correct typing
	const addNode = useCallback(
		(customName?: string) => {
			if (!groupRef.current || !initializedRef.current) return;

			// Ensure we only add nodes after initial loading is complete
			if (!initialLoadCompletedRef.current) {
				console.warn(
					'Cannot add node until initial loading is complete'
				);
				return;
			}

			const newId = concepts.length;
			const conceptName = customName || `Concept ${newId + 1}`;
			const newConcept = {
				id: newId,
				name: conceptName,
				color: selectedColor.color.clone(),
				mastery: masteryLevel,
				category:
					addNodeCategory === 'All'
						? categories[
								Math.floor(
									Math.random() * (categories.length - 1)
								)
							]
						: addNodeCategory,
				visible: true,
			};

			// Update React state
			setConcepts((prevConcepts) => [...prevConcepts, newConcept]);

			// Create and add Three.js object - with animation
			const newNodeMesh = createNodeMesh(newConcept, true);
			groupRef.current.add(newNodeMesh);
			nodesRef.current.push(newNodeMesh); // Keep track of the mesh for interaction

			// Animate the node from center
			if (newNodeMesh.userData.targetPosition) {
				animateNodeFromCenter(
					newNodeMesh,
					newNodeMesh.userData.targetPosition
				);
			}

			console.log(
				`Added node: ${newConcept.name} with mastery: ${newConcept.mastery}`
			);

			// Maybe add a connection?
			if (nodesRef.current.length > 1) {
				const randomIndex = Math.floor(
					Math.random() * (nodesRef.current.length - 1)
				); // Connect to any node except the last one (itself)
				const targetNode = nodesRef.current[randomIndex];

				// Create the line geometry
				const lineGeometry = new THREE.BufferGeometry();
				const positions = new Float32Array(6); // 2 points * 3 dimensions = 6 values
				lineGeometry.setAttribute(
					'position',
					new THREE.BufferAttribute(positions, 3)
				);

				const line = new THREE.Line(lineGeometry, lineMaterial.clone());

				// Make line initially invisible and fade it in
				line.material.opacity = 0;
				gsap.to(line.material, {
					opacity: 0.8,
					duration: 1.5,
					ease: 'power2.out',
				});

				// Function to update line position during animation
				const updateLine = () => {
					const positionArray = lineGeometry.attributes.position
						.array as Float32Array;

					// Set the first point (target node)
					positionArray[0] = targetNode.position.x;
					positionArray[1] = targetNode.position.y;
					positionArray[2] = targetNode.position.z;

					// Set the second point (new node)
					positionArray[3] = newNodeMesh.position.x;
					positionArray[4] = newNodeMesh.position.y;
					positionArray[5] = newNodeMesh.position.z;

					lineGeometry.attributes.position.needsUpdate = true;
				};

				// Initial update
				updateLine();

				// Create animation loop for line updates
				let animationId = 0;
				const updateAnimation = () => {
					animationId = requestAnimationFrame(updateAnimation);
					updateLine();
				};

				// Start animation
				updateAnimation();

				// Add to active animations for cleanup
				activeAnimationsRef.current.push({
					type: 'raf',
					id: animationId,
				});

				// Stop updating after node animations finish
				setTimeout(() => {
					cancelAnimationFrame(animationId);
					// Remove from active animations
					activeAnimationsRef.current =
						activeAnimationsRef.current.filter(
							(anim) =>
								anim.type !== 'raf' || anim.id !== animationId
						);
				}, 2000); // Allow a little longer than node animation (1.5s)

				groupRef.current.add(line);

				// Store the line in edgesRef for toggling visibility
				edgesRef.current.push(line);

				// Apply filters to ensure proper visibility on the new line
				if (applyFiltersRef.current) {
					setTimeout(() => {
						applyFiltersRef.current();
					}, 100);
				}
			}
		},
		[
			concepts,
			createNodeMesh,
			selectedColor,
			masteryLevel,
			addNodeCategory,
			animateNodeFromCenter,
		]
	);

	const handleAddRandomConcept = useCallback(() => {
		addNode();
	}, [addNode]);

	const handleAddCustomConcept = useCallback(() => {
		if (newConceptName.trim()) {
			addNode(newConceptName.trim());
			setNewConceptName(''); // Reset input field
		}
	}, [addNode, newConceptName]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				handleAddCustomConcept();
			}
		},
		[handleAddCustomConcept]
	);

	// Function to apply visibility filters - defined first to use in effect
	const applyFilters = useCallback(() => {
		if (!groupRef.current || nodesRef.current.length === 0) return;

		// Apply category and mastery filters to nodes
		nodesRef.current.forEach((node) => {
			if (!node.userData) return;

			const { category, mastery } = node.userData;
			const categoryVisible =
				selectedCategory === 'All' || category === selectedCategory;
			const masteryVisible =
				mastery >= masteryFilter[0] && mastery <= masteryFilter[1];
			node.visible = categoryVisible && masteryVisible;
		});

		// Apply edge visibility based on showEdges setting and connected nodes
		edgesRef.current.forEach((edge) => {
			// Only show edge if showEdges is true AND both connected nodes are visible
			const lineGeometry = edge.geometry as THREE.BufferGeometry;
			const posArray = lineGeometry.attributes.position
				.array as Float32Array;

			// Check if we can find visible nodes at both endpoints of this line
			let startNodeVisible = false;
			let endNodeVisible = false;

			// Get positions from line geometry
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

			// Find if nodes at these positions are visible
			for (const node of nodesRef.current) {
				if (!node.visible) continue;

				// Use small threshold for position comparison
				if (node.position.distanceTo(startPos) < 0.01) {
					startNodeVisible = true;
				}
				if (node.position.distanceTo(endPos) < 0.01) {
					endNodeVisible = true;
				}

				if (startNodeVisible && endNodeVisible) break;
			}

			edge.visible = showEdges && startNodeVisible && endNodeVisible;
		});
	}, [selectedCategory, masteryFilter, showEdges]);

	// Store applyFilters in ref to avoid circular dependencies
	useEffect(() => {
		applyFiltersRef.current = applyFilters;
	}, [applyFilters]);

	// Apply filters when filter settings change
	useEffect(() => {
		// Only apply filters after scene initialization
		if (initializedRef.current) {
			applyFilters();
		}
	}, [applyFilters, initializedRef.current]);

	// Function to reset all filters to defaults
	const resetFilters = useCallback(() => {
		setShowEdges(DEFAULT_SHOW_EDGES);
		setSelectedCategory(DEFAULT_CATEGORY);
		setMasteryFilter(DEFAULT_MASTERY_RANGE);
	}, []);

	// Function to reset the camera view
	const resetCameraView = useCallback(() => {
		if (
			!cameraRef.current ||
			!controlsRef.current ||
			!originalCameraPositionRef.current
		)
			return;

		// Animate camera back to original position
		gsap.to(cameraRef.current.position, {
			x: originalCameraPositionRef.current.x,
			y: originalCameraPositionRef.current.y,
			z: originalCameraPositionRef.current.z,
			duration: 1.0,
			ease: 'power2.inOut',
			onUpdate: () => {
				if (controlsRef.current) controlsRef.current.update();
			},
		});

		// Get target position - either stored original or default to origin
		const targetPos =
			originalTargetRef.current || new THREE.Vector3(0, 0, 0);

		// Animate target back to original position
		gsap.to(controlsRef.current.target, {
			x: targetPos.x,
			y: targetPos.y,
			z: targetPos.z,
			duration: 0.8,
			ease: 'power2.inOut',
			onUpdate: () => {
				if (controlsRef.current) controlsRef.current.update();
			},
			onComplete: () => {
				// Resume rotation when animation completes
				isRotatingRef.current = true;
			},
		});

		// Clear selected node
		selectedNodeRef.current = null;
	}, []);

	// Function to handle node click
	const handleNodeClick = useCallback(
		(node: THREE.Mesh) => {
			if (!cameraRef.current || !controlsRef.current || !groupRef.current)
				return;

			// Get node data to display in drawer
			const userData = node.userData;
			setSelectedNodeData({
				name: userData.name || 'Unnamed Concept',
				mastery:
					userData.mastery !== undefined ? userData.mastery : 0.5,
				category: userData.category || 'Uncategorized',
				id: userData.id,
			});

			// Open the drawer
			setDrawerOpen(true);

			// If this node is already selected, reset the view
			if (selectedNodeRef.current === node) {
				resetCameraView();
				return;
			}

			// Store the original camera distance if not already saved
			if (!originalCameraPositionRef.current) {
				originalCameraPositionRef.current =
					cameraRef.current.position.clone();
				// Also store original target
				if (controlsRef.current) {
					originalTargetRef.current =
						controlsRef.current.target.clone();
				}
			}

			// Set node as selected
			selectedNodeRef.current = node;

			// Pause rotation
			isRotatingRef.current = false;

			// Get node's current WORLD position (accounting for group rotation)
			// This is crucial - we need to use getWorldPosition to get the correct position after rotation
			const worldPosition = new THREE.Vector3();
			node.getWorldPosition(worldPosition);

			// First move the camera focus target to the node's world position
			gsap.to(controlsRef.current.target, {
				x: worldPosition.x,
				y: worldPosition.y,
				z: worldPosition.z,
				duration: 0.8,
				ease: 'power2.inOut',
				onUpdate: () => {
					if (controlsRef.current) controlsRef.current.update();
				},
			});

			// Calculate a new camera position
			// Start with current camera position
			const startPosition = cameraRef.current.position.clone();

			// Calculate vector from node to camera
			const nodeToCamera = startPosition.clone().sub(worldPosition);

			// Maintain direction but reduce distance for zooming effect
			nodeToCamera.normalize().multiplyScalar(2.0); // zoom scale (distance from node)

			// Calculate new camera position: node + distance * direction
			const newCameraPosition = worldPosition.clone().add(nodeToCamera);

			// Animate camera to new position
			gsap.to(cameraRef.current.position, {
				x: newCameraPosition.x,
				y: newCameraPosition.y,
				z: newCameraPosition.z,
				duration: 1.2,
				ease: 'power2.inOut',
				onUpdate: () => {
					if (controlsRef.current) controlsRef.current.update();
				},
			});
		},
		[resetCameraView]
	);

	// Handle drawer open/close
	const handleDrawerOpenChange = useCallback(
		(open: boolean) => {
			setDrawerOpen(open);

			// If drawer is closing and we have a selected node, reset the camera view
			if (!open && selectedNodeRef.current) {
				resetCameraView();
			}
		},
		[resetCameraView]
	);

	// Effect for initial setup and cleanup
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			containerRef.current &&
			!initializedRef.current
		) {
			initializedRef.current = true; // Mark as initialized to prevent re-initialization
			console.log('Initializing scene');

			// Reset any filters to default at initialization
			setShowEdges(DEFAULT_SHOW_EDGES);
			setSelectedCategory(DEFAULT_CATEGORY);
			setMasteryFilter(DEFAULT_MASTERY_RANGE);

			const container = containerRef.current;

			// --- Initialize Scene, Camera, Renderer, Controls ---
			const scene = new THREE.Scene();
			sceneRef.current = scene;
			scene.background = new THREE.Color(0xffffff); // Changed to white background

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

			// Create and apply gradient map for toon shading
			const createGradientTexture = () => {
				const size = 256;
				const canvas = document.createElement('canvas');
				canvas.width = size;
				canvas.height = size;

				const context = canvas.getContext('2d');
				if (!context) return null;

				// Create a gradient going from dark to light (cartoon-like)
				const gradient = context.createLinearGradient(0, 0, size, size);
				gradient.addColorStop(0, '#333333');
				gradient.addColorStop(0.3, '#666666');
				gradient.addColorStop(0.5, '#999999');
				gradient.addColorStop(0.7, '#CCCCCC');
				gradient.addColorStop(1, '#FFFFFF');

				context.fillStyle = gradient;
				context.fillRect(0, 0, size, size);

				const texture = new THREE.CanvasTexture(canvas);
				texture.minFilter = THREE.NearestFilter;
				texture.magFilter = THREE.NearestFilter;
				texture.generateMipmaps = false;

				return texture;
			};

			const gradientMap = createGradientTexture();
			gradientMapRef.current = gradientMap;

			// Add cartoon-style lighting - flat and directional
			const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
			directionalLight.position.set(5, 3, 5);
			scene.add(directionalLight);

			// Add ambient light for flat illumination in shadows
			const ambientLight = new THREE.AmbientLight(0x9090a0, 0.8);
			scene.add(ambientLight);

			const controls = new OrbitControls(camera, renderer.domElement);
			controlsRef.current = controls;
			controls.enableDamping = true;
			controls.dampingFactor = 0.05;
			controls.screenSpacePanning = false;
			controls.minDistance = 2;
			controls.maxDistance = 10;

			const group = new THREE.Group();
			groupRef.current = group;
			scene.add(group);

			// Create center sphere with cartoon aesthetic
			const centerSphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
			const centerSphereMaterial = createToonMaterial(0x2255cc); // Changed to deeper blue
			const centerSphere = new THREE.Mesh(
				centerSphereGeometry,
				centerSphereMaterial
			);

			// Add black outline to center sphere
			const centerOutlineMaterial = new THREE.MeshBasicMaterial({
				color: 0x000000,
				side: THREE.BackSide,
			});
			const centerOutlineMesh = new THREE.Mesh(
				centerSphereGeometry.clone().scale(1.15, 1.15, 1.15),
				centerOutlineMaterial
			);
			centerSphere.add(centerOutlineMesh);

			centerSphere.position.set(0, 0, 0);
			group.add(centerSphere);

			// --- Create Initial Nodes and Lines ---
			console.log('Creating nodes...');
			nodesRef.current = []; // Clear previous nodes if effect re-runs
			edgesRef.current = []; // Clear edges

			// Start with an empty scene
			while (group.children.length > 1) {
				// Keep just the center sphere
				const obj = group.children[group.children.length - 1];
				if (obj !== centerSphere) {
					group.remove(obj);
				}
			}

			// Get the current concepts snapshot for initialization
			// instead of using concepts from deps
			const initialConcepts = concepts;

			// Create nodes
			initialConcepts.forEach((concept) => {
				const nodeMesh = createNodeMesh(concept, true); // Set animate=true
				nodeMesh.visible = true; // Force visibility
				group.add(nodeMesh);
				nodesRef.current.push(nodeMesh);
				console.log(
					`Created node: ${concept.name}, visible: ${nodeMesh.visible}`
				);
			});

			// Animate all nodes from center with staggered timing
			console.log(
				`Starting animations for ${nodesRef.current.length} nodes`
			);
			nodesRef.current.forEach((nodeMesh, index) => {
				if (nodeMesh.userData && nodeMesh.userData.targetPosition) {
					// Stagger the animations slightly for visual interest
					setTimeout(() => {
						nodeMesh.visible = true; // Ensure visible before animation
						animateNodeFromCenter(
							nodeMesh,
							nodeMesh.userData.targetPosition
						);
						console.log(`Started animation for node ${index + 1}`);
					}, index * 50); // 50ms delay between each node
				}
			});

			// Add connections after a delay to allow nodes to start moving
			setTimeout(() => {
				console.log('Creating connections...');
				const initialConnections = Math.min(
					30,
					Math.floor(nodesRef.current.length * 1.5)
				);
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
					// Ensure we don't connect a node to itself
					while (startIndex === endIndex) {
						endIndex = Math.floor(
							Math.random() * nodesRef.current.length
						);
					}

					const startNode = nodesRef.current[startIndex];
					const endNode = nodesRef.current[endIndex];

					// Create the line geometry with dynamic positions
					const lineGeometry = new THREE.BufferGeometry();
					const positions = new Float32Array(6); // 2 points * 3 dimensions = 6 values
					lineGeometry.setAttribute(
						'position',
						new THREE.BufferAttribute(positions, 3)
					);

					const line = new THREE.Line(
						lineGeometry,
						lineMaterial.clone()
					);

					// Start with transparent line and fade in
					line.material.opacity = 0;
					gsap.to(line.material, {
						opacity: 0.8,
						duration: 1.5,
						delay: 0.5, // Start fading in after nodes have started moving
						ease: 'power2.out',
					});

					// Make visible based on initial state
					line.visible = showEdges;

					// Function to update line position during animation
					const updateLine = () => {
						const positionArray = lineGeometry.attributes.position
							.array as Float32Array;

						// Update the line position
						positionArray[0] = startNode.position.x;
						positionArray[1] = startNode.position.y;
						positionArray[2] = startNode.position.z;

						positionArray[3] = endNode.position.x;
						positionArray[4] = endNode.position.y;
						positionArray[5] = endNode.position.z;

						lineGeometry.attributes.position.needsUpdate = true;
					};

					// Initial update
					updateLine();

					// Create animation loop for line updates
					let animationId = 0;
					const updateAnimation = () => {
						animationId = requestAnimationFrame(updateAnimation);
						updateLine();
					};

					// Start animation
					updateAnimation();

					// Add to active animations for cleanup
					activeAnimationsRef.current.push({
						type: 'raf',
						id: animationId,
					});

					// Stop updating after node animations finish
					setTimeout(() => {
						cancelAnimationFrame(animationId);
						// Remove from active animations
						activeAnimationsRef.current =
							activeAnimationsRef.current.filter(
								(anim) =>
									anim.type !== 'raf' ||
									anim.id !== animationId
							);
					}, 2000); // Allow a little longer than node animation (1.5s)

					group.add(line);
					edgesRef.current.push(line);
				}
				console.log(`Created ${edgesRef.current.length} connections`);

				// Mark initial load as complete
				initialLoadCompletedRef.current = true;
			}, 300); // Slight delay before adding connections

			// --- Raycasting Setup ---
			const raycaster = raycasterRef.current;
			const mouse = mouseRef.current;

			const onMouseMove = (event: MouseEvent) => {
				if (!rendererRef.current || !cameraRef.current) return;
				const rect =
					rendererRef.current.domElement.getBoundingClientRect();
				mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
				mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

				raycaster.setFromCamera(mouse, cameraRef.current);
				const intersects = raycaster.intersectObjects(nodesRef.current);

				if (intersects.length > 0) {
					const intersectedNode = intersects[0].object as THREE.Mesh;
					if (hoveredNodeRef.current !== intersectedNode) {
						// Restore previous
						if (
							hoveredNodeRef.current &&
							originalColorRef.current
						) {
							(
								hoveredNodeRef.current
									.material as THREE.MeshToonMaterial
							).color.copy(originalColorRef.current);
						}

						hoveredNodeRef.current = intersectedNode;
						originalColorRef.current = (
							intersectedNode.material as THREE.MeshToonMaterial
						).color.clone();
						(
							intersectedNode.material as THREE.MeshToonMaterial
						).color.copy(highlightColor);

						const userData = intersectedNode.userData;
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
					// Restore previous
					if (hoveredNodeRef.current && originalColorRef.current) {
						(
							hoveredNodeRef.current
								.material as THREE.MeshToonMaterial
						).color.copy(originalColorRef.current);
					}
					hoveredNodeRef.current = null;
					originalColorRef.current = null;
					setTooltipContent(null);
					setTooltipPosition(null);
				}
			};

			// Add mouse click handler
			const onMouseClick = (event: MouseEvent) => {
				if (!rendererRef.current || !cameraRef.current) return;
				const rect =
					rendererRef.current.domElement.getBoundingClientRect();
				mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
				mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

				raycaster.setFromCamera(mouse, cameraRef.current);
				const intersects = raycaster.intersectObjects(nodesRef.current);

				if (intersects.length > 0) {
					const intersectedNode = intersects[0].object as THREE.Mesh;
					handleNodeClick(intersectedNode);
				}
			};

			container.addEventListener('mousemove', onMouseMove);
			container.addEventListener('click', onMouseClick);

			// --- Animation Loop ---
			let animationFrameId: number;
			const animate = () => {
				animationFrameId = requestAnimationFrame(animate);

				// Add null checks for refs used in animation loop
				if (
					!controlsRef.current ||
					!groupRef.current ||
					!rendererRef.current ||
					!sceneRef.current ||
					!cameraRef.current
				) {
					console.warn(
						'Skipping animation frame: refs not yet initialized.'
					);
					return;
				}

				controlsRef.current.update();

				// Only rotate if not focused on a node
				if (isRotatingRef.current) {
					groupRef.current.rotation.y += 0.001;
				}

				rendererRef.current.render(sceneRef.current, cameraRef.current);
			};

			animate();

			// --- Resize Handling ---
			const handleResize = () => {
				if (!rendererRef.current || !cameraRef.current) return;
				const width = container.clientWidth;
				const height = container.clientHeight;
				cameraRef.current.aspect = width / height;
				cameraRef.current.updateProjectionMatrix();
				rendererRef.current.setSize(width, height);
			};

			window.addEventListener('resize', handleResize);

			// --- Cleanup ---
			return () => {
				cancelAnimationFrame(animationFrameId);
				window.removeEventListener('resize', handleResize);
				if (containerRef.current) {
					// Check containerRef before removing listener
					containerRef.current.removeEventListener(
						'mousemove',
						onMouseMove
					);
					containerRef.current.removeEventListener(
						'click',
						onMouseClick
					);
				}

				// Kill all active animations
				activeAnimationsRef.current.forEach((anim) => {
					if (anim.type === 'gsap') {
						// It's a GSAP tween
						(
							anim as { type: 'gsap'; tween: gsap.core.Tween }
						).tween.kill();
					} else if (anim.type === 'raf') {
						// It's a requestAnimationFrame animation
						cancelAnimationFrame(
							(anim as { type: 'raf'; id: number }).id
						);
					}
				});
				activeAnimationsRef.current = [];

				if (controlsRef.current) controlsRef.current.dispose();
				if (rendererRef.current && containerRef.current) {
					// Check containerRef again before removing child
					if (
						containerRef.current.contains(
							rendererRef.current.domElement
						)
					) {
						containerRef.current.removeChild(
							rendererRef.current.domElement
						);
					}
					rendererRef.current.dispose(); // Dispose renderer resources
				}
				// Optional: Dispose geometries/materials if not reused elsewhere
				// nodeGeometry.dispose();
				// lineMaterial.dispose();
				groupRef.current = null;
				sceneRef.current = null;
				cameraRef.current = null;
				rendererRef.current = null;
				controlsRef.current = null;
				nodesRef.current = [];
				initialLoadCompletedRef.current = false; // Reset initial load flag
				initializedRef.current = false; // Reset initialized state
			};
		}
	}, [createNodeMesh, animateNodeFromCenter]); // Remove concepts and showEdges dependencies

	// Log node visibility for debugging
	useEffect(() => {
		if (nodesRef.current.length > 0) {
			console.log(`Total nodes: ${nodesRef.current.length}`);
			console.log(
				`Visible nodes: ${nodesRef.current.filter((n) => n.visible).length}`
			);
		}
	}, [selectedCategory, masteryFilter, showEdges]);

	return (
		<div style={{ width: '100%', height: '100vh', position: 'relative' }}>
			{/* Add Concept Card */}
			<Card className='absolute top-5 left-5 z-50 w-80'>
				<CardHeader className='p-4 pb-2'>
					<CardTitle className='text-lg'>Add Concept Node</CardTitle>
				</CardHeader>
				<CardContent className='p-4 pt-0 pb-2'>
					<Input
						placeholder='Enter concept name...'
						value={newConceptName}
						onChange={(e) => setNewConceptName(e.target.value)}
						onKeyDown={handleKeyPress}
						className='mb-4'
					/>

					<div className='mb-4'>
						<Label className='block mb-2'>
							Mastery Level: {masteryLevel.toFixed(2)}
						</Label>
						<input
							type='range'
							min='0'
							max='1'
							step='0.01'
							value={masteryLevel}
							onChange={(e) =>
								setMasteryLevel(parseFloat(e.target.value))
							}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
						/>
						<div className='flex items-center justify-between text-xs text-muted-foreground mt-1'>
							<span>Beginner (Center)</span>
							<span>Master (Edge)</span>
						</div>
					</div>

					<div className='mb-4'>
						<Label className='block mb-2'>Category:</Label>
						<Select
							value={addNodeCategory}
							onValueChange={setAddNodeCategory}
						>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Select a category' />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label className='block mb-2'>Concept Color:</Label>
						<div className='flex flex-wrap gap-2'>
							{conceptColors.map((colorOption) => (
								<button
									key={colorOption.name}
									type='button'
									className={`w-8 h-8 rounded-full border-2 transition-all ${
										selectedColor.name === colorOption.name
											? 'border-black scale-110'
											: 'border-transparent'
									}`}
									style={{ backgroundColor: colorOption.hex }}
									onClick={() =>
										setSelectedColor(colorOption)
									}
									title={colorOption.name}
									aria-label={`Select ${colorOption.name} color`}
								/>
							))}
						</div>
					</div>
				</CardContent>
				<CardFooter className='flex justify-between p-4 pt-0'>
					<Button
						variant='outline'
						onClick={handleAddRandomConcept}
						className='mr-2'
					>
						Add Random
					</Button>
					<Button
						onClick={handleAddCustomConcept}
						disabled={!newConceptName.trim()}
					>
						Add Custom
					</Button>
				</CardFooter>
			</Card>

			{/* Filter Menu - Changed to vertical collapse */}
			<div
				className={`absolute top-5 right-5 z-50 transition-all duration-300 ease-in-out ${
					menuOpen
						? 'translate-y-0'
						: 'translate-y-[calc(-100%+40px)]'
				}`}
			>
				<Card className='w-64'>
					<div className='flex items-center justify-between border-b'>
						<CardHeader className='p-3 pb-2 flex-1'>
							<CardTitle className='text-md flex items-center'>
								<Filter size={16} className='mr-2' />
								Filters
							</CardTitle>
						</CardHeader>
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className='h-full p-3 hover:bg-gray-100 transition-colors'
							aria-label={
								menuOpen
									? 'Close filters menu'
									: 'Open filters menu'
							}
						>
							{menuOpen ? <X size={18} /> : <Filter size={18} />}
						</button>
					</div>

					{menuOpen && (
						<CardContent className='p-3 pt-2'>
							<div className='flex items-center space-x-2 py-2 border-b'>
								<Checkbox
									id='showEdges'
									checked={showEdges}
									onCheckedChange={(checked) =>
										setShowEdges(checked as boolean)
									}
								/>
								<Label
									htmlFor='showEdges'
									className='cursor-pointer'
								>
									{showEdges ? (
										<Eye
											size={16}
											className='inline mr-1'
										/>
									) : (
										<EyeOff
											size={16}
											className='inline mr-1'
										/>
									)}
									Show Connections
								</Label>
							</div>

							<div className='py-2 border-b'>
								<Label className='block mb-2'>
									Filter by Category:
								</Label>
								<Select
									value={selectedCategory}
									onValueChange={setSelectedCategory}
								>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Select a category' />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem
												key={category}
												value={category}
											>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className='py-2'>
								<Label className='block mb-2'>
									Mastery Range: {masteryFilter[0].toFixed(1)}{' '}
									- {masteryFilter[1].toFixed(1)}
								</Label>
								<div className='mb-2'>
									<Label className='text-xs'>
										Min Mastery:
									</Label>
									<input
										type='range'
										min='0'
										max='1'
										step='0.1'
										value={masteryFilter[0]}
										onChange={(e) =>
											setMasteryFilter([
												parseFloat(e.target.value),
												masteryFilter[1],
											])
										}
										className='w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer'
									/>
								</div>
								<div>
									<Label className='text-xs'>
										Max Mastery:
									</Label>
									<input
										type='range'
										min='0'
										max='1'
										step='0.1'
										value={masteryFilter[1]}
										onChange={(e) =>
											setMasteryFilter([
												masteryFilter[0],
												parseFloat(e.target.value),
											])
										}
										className='w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer'
									/>
								</div>
							</div>

							<div className='pt-3'>
								<Button
									variant='outline'
									className='w-full'
									onClick={resetFilters}
								>
									Reset Filters
								</Button>
							</div>
						</CardContent>
					)}
				</Card>
			</div>

			{/* Reset View Button */}
			<Button
				variant='outline'
				size='icon'
				onClick={resetCameraView}
				className='absolute bottom-5 right-5 z-50 rounded-full bg-white shadow-md hover:bg-gray-100'
				title='Reset View'
			>
				<Maximize className='h-4 w-4' />
			</Button>

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
						zIndex: 20, // Ensure tooltip is above everything
					}}
				>
					{tooltipContent}
				</div>
			)}

			{/* Node Details Drawer */}
			<NodeDetailsDrawer
				isOpen={drawerOpen}
				onOpenChange={handleDrawerOpenChange}
				nodeData={selectedNodeData}
			/>
		</div>
	);
};

export default ThreeScene;
