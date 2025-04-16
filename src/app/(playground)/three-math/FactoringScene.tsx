'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap'; // Import gsap
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Define visual properties for text and animation
const colors = {
	xTerm: 0x4a90e2, // Blue for x terms
	constant: 0xd0021b, // Red for constants
	operator: 0x7ed321, // Green for operators (+, -)
	parenthesis: 0x9b59b6, // Purple for parentheses
	default: 0x333333, // Default text color
	// Add a single vibrant color for all text
	highlight: 0x0066ff, // Bright blue for all text
};

// Define visual properties
const xSize = 4; // Visual size representing 'x'
const unitSize = 1; // Visual size representing '1'
const depth = 0.2; // Make blocks 3D

// Helper function to convert 3D world coords to 2D screen coords
function worldToScreen(
	worldPos: THREE.Vector3,
	camera: THREE.Camera,
	container: HTMLElement
): { x: number; y: number } | null {
	const vector = worldPos.clone().project(camera);
	if (!container) return null;
	const width = container.clientWidth;
	const height = container.clientHeight;
	const x = Math.round(((vector.x + 1) / 2) * width);
	const y = Math.round(((-vector.y + 1) / 2) * height);
	// Check if the point is behind the camera
	const dir = worldPos.clone().sub(camera.position).normalize();
	const cameraDir = new THREE.Vector3();
	camera.getWorldDirection(cameraDir);
	if (dir.dot(cameraDir) > 0) {
		return null; // Point is behind the camera
	}

	return { x, y };
}

interface LabelInfo {
	text: string;
	position: { x: number; y: number };
	id: string;
}

const FactoringScene: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const controlsRef = useRef<OrbitControls | null>(null);
	const textMeshesRef = useRef<THREE.Mesh[]>([]); // ADDED: Ref to hold text meshes
	const fontRef = useRef<any>(null); // ADDED: Ref to hold the loaded font

	const [currentStep, setCurrentStep] = useState(0); // ADDED: State for current factoring step
	const [isFontLoaded, setIsFontLoaded] = useState(false); // ADDED: State to track font loading
	const [isAnimating, setIsAnimating] = useState(false); // ADDED BACK: Animation state

	// Define factoring steps (textual representation)
	const factoringSteps = useMemo(() => [
		'x² + 5x + 6',
		'x² + 2x + 3x + 6',
		'(x² + 2x) + (3x + 6)',
		'x(x + 2) + 3(x + 2)',
		'(x + 2)(x + 3)',
	], []);

	// Add step descriptions
	const stepDescriptions = [
		'Start with x² + 5x + 6',
		'Split the middle term: 5x = 2x + 3x',
		'Group the terms: (x² + 2x) + (3x + 6)',
		'Factor out common terms: x(x + 2) + 3(x + 2)',
		'Factor out (x + 2): (x + 2)(x + 3)',
	];

	// ADDED: Helper function to create text meshes
	const createTextMesh = useCallback(
		(
			text: string,
			font: any,
			options: {
				size?: number;
				depth?: number;
				color?: number;
				position?: THREE.Vector3;
				initialOpacity?: number;
			} = {}
		) => {
			const {
				size = 0.6, // Smaller size to fit all characters
				depth = 0.2,
				color = colors.highlight, // Use a single bright color for all text
				position = new THREE.Vector3(0, 0, 0),
				initialOpacity = 1, // Default to fully opaque
			} = options;

			const textGeo = new TextGeometry(text, {
				font: font,
				size: size,
				depth: depth,
				curveSegments: 12,
				bevelEnabled: false,
			});

			// Center the text geometry
			textGeo.computeBoundingBox();
			const textWidth =
				textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x;
			textGeo.translate(-textWidth / 2, 0, 0);

			// Create material for all faces - CRITICAL CHANGE:
			// Three.js needs separate materials for front/back/sides in an array
			const material = new THREE.MeshPhongMaterial({
				color: color,
				shininess: 100,
				specular: 0x111111,
				transparent: true,
				opacity: 1,
			});

			// Create identical materials for all sides to ensure consistent coloring
			const materials = [
				material.clone(), // front
				material.clone(), // back
				material.clone(), // sides (all remaining faces)
				// material.clone(),
				// material.clone(),
				// material.clone(),
			];

			// Set initial opacity for all materials
			materials.forEach((mat) => {
				mat.opacity = initialOpacity;
			});

			// Create a mesh with the geometry and materials array
			const textMesh = new THREE.Mesh(textGeo, materials);
			textMesh.position.copy(position);
			textMesh.userData = { text: text }; // Store the text for reference

			return textMesh;
		},
		[]
	);

	// New function to create color-coded text segments
	const createSegmentedText = useCallback(
		(
			expression: string,
			font: any,
			yPosition: number = 0,
			initialOpacity: number = 1
		) => {
			if (!font) return [];

			// Instead of color-coding, just divide by characters with spaces
			const characters = expression.split('');

			// Create text meshes for each character - this gives more precise control
			const meshes: THREE.Mesh[] = [];
			const totalChars = characters.length;
			const textWidth = totalChars * 0.6; // Estimate total width
			let xPosition = -textWidth / 2; // Center the text

			characters.forEach((char) => {
				// Skip actual spaces but keep their positioning
				if (char === ' ') {
					xPosition += 0.3; // Space width
					return;
				}

				const mesh = createTextMesh(char, font, {
					size: 0.6, // Unified size
					depth: 0.2, // More depth for better visibility
					color: colors.highlight, // Single color for all
					position: new THREE.Vector3(xPosition, yPosition, 0),
					initialOpacity: initialOpacity, // Pass through the initial opacity
				});

				// Set initial opacity
				if (mesh.material instanceof THREE.Material) {
					mesh.material.opacity = initialOpacity;
				}

				meshes.push(mesh);

				// Use fixed width for better spacing
				const charWidth = char === 'x' ? 0.6 : 0.4;
				xPosition += charWidth;
			});

			return meshes;
		},
		[createTextMesh]
	);

	// Animation function using GSAP
	const animateNextStep = useCallback(() => {
		if (
			isAnimating ||
			!isFontLoaded ||
			currentStep >= factoringSteps.length - 1
		)
			return;
		setIsAnimating(true);
		const nextStep = currentStep + 1;
		console.log(
			`Animating to step ${nextStep}: ${factoringSteps[nextStep]}`
		);

		// Create a GSAP timeline for animations
		const tl = gsap.timeline({
			onComplete: () => {
				setCurrentStep(nextStep);
				setIsAnimating(false);
			},
		});

		// Find any existing group that contains our meshes
		let existingGroup: THREE.Group | null = null;
		if (textMeshesRef.current.length > 0) {
			const currentMeshes = [...textMeshesRef.current];

			currentMeshes.forEach((mesh) => {
				if (mesh.parent && mesh.parent instanceof THREE.Group) {
					existingGroup = mesh.parent;
				}
			});

			// Fade out current text
			const allCurrentMaterials: THREE.Material[] = [];
			currentMeshes.forEach((mesh) => {
				if (Array.isArray(mesh.material)) {
					mesh.material.forEach((mat) =>
						allCurrentMaterials.push(mat)
					);
				} else if (mesh.material) {
					allCurrentMaterials.push(mesh.material);
				}
			});

			tl.to(allCurrentMaterials, {
				opacity: 0,
				duration: 0.5,
				ease: 'power2.out',
				onComplete: () => {
					// Remove the entire group if it exists
					if (existingGroup && sceneRef.current) {
						sceneRef.current.remove(existingGroup);
					}
				},
			});
		}

		// Create and fade in new text
		tl.call(() => {
			if (!fontRef.current || !sceneRef.current) return;

			// Clear the array for new meshes
			textMeshesRef.current = [];

			// Create text meshes for next step
			const textMeshes = createSegmentedText(
				factoringSteps[nextStep],
				fontRef.current,
				0, // y position
				0 // start with opacity 0 for fade-in
			);

			// Create a new group
			const textGroup = new THREE.Group();

			// Add meshes to group and store references
			textMeshes.forEach((mesh) => {
				textGroup.add(mesh);
				textMeshesRef.current.push(mesh);
			});

			// Apply the same positioning
			textGroup.position.set(0, 0, 0);
			textGroup.rotation.x = -Math.PI / 8;

			// Add group to scene
			sceneRef.current.add(textGroup);

			// Simple fade-in animation - handle array of materials
			const allMaterials: THREE.Material[] = [];
			textMeshes.forEach((mesh) => {
				if (Array.isArray(mesh.material)) {
					// If it's an array of materials, add each one
					mesh.material.forEach((mat) => allMaterials.push(mat));
				} else if (mesh.material) {
					// If it's a single material
					allMaterials.push(mesh.material);
				}
			});

			gsap.to(allMaterials, {
				opacity: 1,
				duration: 0.7,
				ease: 'power2.inOut',
			});
		});
	}, [
		isAnimating,
		isFontLoaded,
		currentStep,
		factoringSteps,
		createSegmentedText,
	]);

	// Effect for setup and cleanup
	useEffect(() => {
		if (typeof window !== 'undefined' && containerRef.current) {
			const container = containerRef.current;

			// --- Initialize Scene, Camera, Renderer, Controls ---
			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0xf0f0f0); // Light grey background
			sceneRef.current = scene;

			// --- Add Lighting ---
			const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Increased ambient for better overall illumination
			scene.add(ambientLight);

			// Main directional light from front
			const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
			directionalLight.position.set(0, 0, 10); // Directly in front
			scene.add(directionalLight);

			// Add a secondary light from the top-right
			const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.7);
			secondaryLight.position.set(10, 10, 5);
			scene.add(secondaryLight);

			// Add a third light from the left for balance
			const leftLight = new THREE.DirectionalLight(0xffffff, 0.7);
			leftLight.position.set(-10, 5, 5);
			scene.add(leftLight);

			const camera = new THREE.PerspectiveCamera(
				50,
				container.clientWidth / container.clientHeight,
				0.1,
				1000
			);
			cameraRef.current = camera;
			camera.position.set(0, 0, 5); // Closer and centered

			const renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true, // Enable transparency
			});
			rendererRef.current = renderer;
			renderer.setSize(container.clientWidth, container.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			container.appendChild(renderer.domElement);

			const controls = new OrbitControls(camera, renderer.domElement);
			controlsRef.current = controls;
			controls.enableRotate = true;
			controls.enableDamping = true;
			controls.dampingFactor = 0.1;
			controls.screenSpacePanning = true;
			controls.minDistance = 5; // Prevent zooming in too close
			controls.maxDistance = 20; // Prevent zooming out too far
			controls.target.set(0, 0, 0);

			// --- Load Font ---
			const fontLoader = new FontLoader();
			fontLoader.load(
				// Ensure you have a font file in your public directory
				'/fonts/helvetiker_regular.typeface.json', // Example path
				(font) => {
					console.log('Font loaded successfully!');
					fontRef.current = font;
					setIsFontLoaded(true);

					// Create color-coded segments for initial step
					console.log('Creating initial text meshes...');
					const initialMeshes = createSegmentedText(
						factoringSteps[0],
						font,
						0, // y position
						0 // start invisible for fade-in
					);

					if (initialMeshes.length > 0 && sceneRef.current) {
						// Create a group for text grouping and manipulation
						const textGroup = new THREE.Group();
						initialMeshes.forEach((mesh) => {
							textGroup.add(mesh);
						});

						// Position the text centrally with a slight forward tilt
						textGroup.position.set(0, 0, 0);
						textGroup.rotation.x = -Math.PI / 8; // Less aggressive tilt

						// Add group to scene
						sceneRef.current.add(textGroup);

						// Store references
						textMeshesRef.current = initialMeshes;

						// Simple fade-in animation - handle array of materials
						const allMaterials: THREE.Material[] = [];
						initialMeshes.forEach((mesh) => {
							if (Array.isArray(mesh.material)) {
								// If it's an array of materials, add each one
								mesh.material.forEach((mat) =>
									allMaterials.push(mat)
								);
							} else if (mesh.material) {
								// If it's a single material
								allMaterials.push(mesh.material);
							}
						});

						gsap.to(allMaterials, {
							opacity: 1,
							duration: 1.0,
							ease: 'power2.inOut',
						});

						console.log('Initial text meshes added to scene.');
					} else {
						console.error(
							'Failed to create or add initial text meshes.'
						);
					}
				},
				undefined, // onProgress callback (optional)
				(error) => {
					console.error('An error occurred loading the font:', error);
				}
			);

			// --- Animation Loop ---
			let animationFrameId: number;
			const animate = () => {
				animationFrameId = requestAnimationFrame(animate);
				controls.update(); // Required if enableDamping is true

				if (
					rendererRef.current &&
					sceneRef.current &&
					cameraRef.current
				) {
					rendererRef.current.render(
						sceneRef.current,
						cameraRef.current
					);
				}
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
				if (controlsRef.current) {
					controlsRef.current.dispose();
				}
				if (rendererRef.current && containerRef.current) {
					if (
						containerRef.current.contains(
							rendererRef.current.domElement
						)
					) {
						containerRef.current.removeChild(
							rendererRef.current.domElement
						);
					}
					rendererRef.current.dispose();
				}
				textMeshesRef.current.forEach((mesh) => {
					if (sceneRef.current) sceneRef.current.remove(mesh); // Remove from scene
					mesh.geometry.dispose();
					if (mesh.material instanceof THREE.Material) {
						mesh.material.dispose();
					} else if (Array.isArray(mesh.material)) {
						mesh.material.forEach((m) => m.dispose());
					}
				});
				sceneRef.current = null;
				cameraRef.current = null;
				rendererRef.current = null;
				controlsRef.current = null;
				textMeshesRef.current = []; // Clear text meshes ref
			};
		}
	}, [createTextMesh, createSegmentedText, factoringSteps]); // Added createSegmentedText as dependency

	return (
		<div
			style={{
				width: '100%',
				height: 'calc(100vh - 60px)',
				position: 'relative',
				overflow: 'hidden', // Hide potential scrollbars
			}}
		>
			<button
				onClick={animateNextStep} // CHANGED: Trigger next step animation
				disabled={
					isAnimating ||
					!isFontLoaded ||
					currentStep >= factoringSteps.length - 1
				} // Disable during animation, before font load, or at last step
				style={{
					position: 'absolute',
					top: '20px',
					left: '20px',
					zIndex: 100,
					padding: '12px 20px',
					cursor:
						isAnimating || currentStep >= factoringSteps.length - 1
							? 'default'
							: 'pointer',
					backgroundColor:
						currentStep >= factoringSteps.length - 1
							? '#cccccc' // Grey when done
							: isAnimating
								? '#ffc107' // Yellow during anim
								: '#007bff', // Blue default
					color: 'white',
					fontWeight: 'bold',
					fontSize: '16px',
					border: 'none',
					borderRadius: '8px',
					boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
					minWidth: '150px', // Give button some width
				}}
			>
				{currentStep >= factoringSteps.length - 1
					? 'Factored!'
					: isAnimating
						? 'Animating...'
						: 'Next Step'}
			</button>
			<div
				ref={containerRef}
				style={{ width: '100%', height: '100%', cursor: 'grab' }}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: '10px',
					left: '10px',
					color: '#333',
					fontSize: '16px',
					background: 'rgba(255,255,255,0.7)',
					padding: '5px 10px',
					borderRadius: '4px',
					maxWidth: '80%',
				}}
			>
				<strong>Step {currentStep + 1}:</strong>{' '}
				{stepDescriptions[currentStep]}
			</div>
		</div>
	);
};

export default FactoringScene;
