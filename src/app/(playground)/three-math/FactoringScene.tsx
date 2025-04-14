'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap'; // Import gsap

// Define visual properties
const xSize = 4; // Visual size representing 'x'
const unitSize = 1; // Visual size representing '1'
const depth = 0.2; // Make blocks 3D

const colors = {
	xSquared: 0x4a90e2, // Blue
	xTerm: 0x7ed321, // Green
	unitTerm: 0xd0021b, // Red
};

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
	const shapesRef = useRef<THREE.Mesh[]>([]);

	const [isFactored, setIsFactored] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false); // Prevent clicking during animation
	const [showLabels, setShowLabels] = useState(false);
	const [labels, setLabels] = useState<LabelInfo[]>([]);

	// Function to create meshes
	const createShapes = useCallback(() => {
		const shapes: THREE.Mesh[] = [];
		const spacing = 0.1; // Small gap between shapes
		const initialSpread = 6; // Spread shapes out initially

		// Create x^2 term (Blue Box)
		const xSquaredGeo = new THREE.BoxGeometry(xSize, xSize, depth);
		const xSquaredMat = new THREE.MeshStandardMaterial({
			color: colors.xSquared,
		});
		const xSquaredMesh = new THREE.Mesh(xSquaredGeo, xSquaredMat);
		xSquaredMesh.position.set(-initialSpread, initialSpread, 0); // Initial top-left
		xSquaredMesh.userData = {
			type: 'xSquared',
			initialPos: xSquaredMesh.position.clone(),
			targetPos: new THREE.Vector3(0, 0, 0),
			targetRot: new THREE.Euler(0, 0, 0),
		};
		shapes.push(xSquaredMesh);

		// Create 5x terms (Green Boxes)
		const xTermGeo = new THREE.BoxGeometry(xSize, unitSize, depth);
		const xTermMat = new THREE.MeshStandardMaterial({
			color: colors.xTerm,
		});
		for (let i = 0; i < 5; i++) {
			const xTermMesh = new THREE.Mesh(xTermGeo, xTermMat);
			xTermMesh.position.set(
				0,
				initialSpread - i * (unitSize + spacing + 0.2),
				0.5
			); // Initial middle, slightly forward
			xTermMesh.userData = {
				type: 'xTerm',
				index: i,
				initialPos: xTermMesh.position.clone(),
				targetPos: new THREE.Vector3(0, 0, 0),
				targetRot: new THREE.Euler(0, 0, 0),
			};
			shapes.push(xTermMesh);
		}

		// Create 6 unit terms (Red Boxes)
		const unitTermGeo = new THREE.BoxGeometry(unitSize, unitSize, depth);
		const unitTermMat = new THREE.MeshStandardMaterial({
			color: colors.unitTerm,
		});
		for (let i = 0; i < 6; i++) {
			const unitTermMesh = new THREE.Mesh(unitTermGeo, unitTermMat);
			const row = Math.floor(i / 3); // Arrange in 2 rows initially
			const col = i % 3;
			unitTermMesh.position.set(
				initialSpread + col * (unitSize + spacing),
				initialSpread - row * (unitSize + spacing),
				0
			); // Initial top-right
			unitTermMesh.userData = {
				type: 'unitTerm',
				index: i,
				initialPos: unitTermMesh.position.clone(),
				targetPos: new THREE.Vector3(0, 0, 0),
				targetRot: new THREE.Euler(0, 0, 0),
			};
			shapes.push(unitTermMesh);
		}

		// Calculate target positions and rotations for factored state (x+2)(x+3)
		// Center the final rectangle around (0,0,0)
		const totalWidth = xSize + 3 * unitSize;
		const totalHeight = xSize + 2 * unitSize;
		const offsetX = -totalWidth / 2;
		const offsetY = totalHeight / 2;

		shapes.forEach((shape) => {
			const data = shape.userData;
			data.initialRot = shape.rotation.clone();

			if (data.type === 'xSquared') {
				data.targetPos.set(offsetX + xSize / 2, offsetY - xSize / 2, 0);
				data.targetRot.set(0, 0, 0);
			} else if (data.type === 'xTerm') {
				if (data.index < 2) {
					// The 2 x*1 terms forming the side rectangle part (width=1, height=x)
					const sideIndex = data.index;
					data.targetPos.set(
						offsetX + xSize + unitSize / 2 + sideIndex * unitSize, // Positioned right of x^2, stacked horizontally
						offsetY - xSize / 2, // Centered vertically beside x^2
						0
					);
					data.targetRot.set(0, 0, 0);
				} else {
					// The 3 x*1 terms forming the top rectangle part (width=x, height=1)
					const topIndex = data.index - 2;
					data.targetPos.set(
						offsetX + xSize / 2, // Centered horizontally under x^2
						offsetY - xSize - unitSize / 2 - topIndex * unitSize, // Positioned below x^2, stacked vertically
						0
					);
					data.targetRot.set(0, 0, Math.PI / 2); // Rotate 90 deg around Z
				}
			} else if (data.type === 'unitTerm') {
				// The 6 1x1 terms in the bottom right corner (2 rows, 3 columns)
				const row = Math.floor(data.index / 3);
				const col = data.index % 3;
				data.targetPos.set(
					offsetX + xSize + unitSize / 2 + col * unitSize, // Align with side xTerms horiz., stack horiz.
					offsetY - xSize - unitSize / 2 - row * unitSize, // Align with top xTerms vert., stack vert.
					0
				);
				data.targetRot.set(0, 0, 0);
			}
		});

		return shapes;
	}, []);

	// Calculate and update label positions
	const updateLabels = useCallback(() => {
		if (!cameraRef.current || !containerRef.current) return;

		const camera = cameraRef.current;
		const container = containerRef.current;
		const newLabels: LabelInfo[] = [];

		const totalWidth = xSize + 3 * unitSize;
		const totalHeight = xSize + 2 * unitSize;
		const offsetX = -totalWidth / 2;
		const offsetY = totalHeight / 2;
		const labelOffset = 0.6;

		// Helper to add label only if position is valid
		const addLabel = (
			text: string,
			worldX: number,
			worldY: number,
			worldZ: number,
			id: string
		) => {
			const screenPos = worldToScreen(
				new THREE.Vector3(worldX, worldY, worldZ),
				camera,
				container
			);
			if (screenPos) {
				// Check if position is valid before adding
				newLabels.push({ text, position: screenPos, id });
			}
		};

		// Vertical Labels (x+2)
		const vertLabelX = offsetX - labelOffset;
		addLabel('x', vertLabelX, offsetY - xSize / 2, 0, 'v1');
		addLabel('+ 1', vertLabelX, offsetY - xSize - unitSize / 2, 0, 'v2');
		addLabel('+ 1', vertLabelX, offsetY - xSize - unitSize * 1.5, 0, 'v3');

		// Horizontal Labels (x+3)
		const horizLabelY = offsetY + labelOffset;
		addLabel('x', offsetX + xSize / 2, horizLabelY, 0, 'h1');
		addLabel('+ 1', offsetX + xSize + unitSize / 2, horizLabelY, 0, 'h2');
		addLabel('+ 1', offsetX + xSize + unitSize * 1.5, horizLabelY, 0, 'h3');
		addLabel('+ 1', offsetX + xSize + unitSize * 2.5, horizLabelY, 0, 'h4');

		setLabels(newLabels);
	}, []);

	// Animation function using GSAP
	const animateFactor = useCallback(() => {
		if (isAnimating) return; // Prevent re-triggering during animation
		setIsAnimating(true);
		setIsFactored(true);
		console.log('Starting factoring animation...');

		const tl = gsap.timeline({
			onComplete: () => {
				setIsAnimating(false);
				setShowLabels(true); // Show labels after animation
				updateLabels(); // Calculate initial label positions
			},
			onUpdate: () => {
				if (showLabels) updateLabels(); // Update labels during camera movement
			},
		});

		shapesRef.current.forEach((shape) => {
			tl.to(
				shape.position,
				{
					x: shape.userData.targetPos.x,
					y: shape.userData.targetPos.y,
					z: shape.userData.targetPos.z,
					duration: 1.5, // Animation duration in seconds
					ease: 'power2.inOut', // Easing function
				},
				0
			); // Start all animations at the same time (time 0 in timeline)

			tl.to(
				shape.rotation,
				{
					x: shape.userData.targetRot.x,
					y: shape.userData.targetRot.y,
					z: shape.userData.targetRot.z,
					duration: 1.5,
					ease: 'power2.inOut',
				},
				0
			);
		});
	}, [isAnimating, updateLabels, showLabels]);

	// Effect for setup and cleanup
	useEffect(() => {
		if (typeof window !== 'undefined' && containerRef.current) {
			const container = containerRef.current;

			// --- Initialize Scene, Camera, Renderer, Controls ---
			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0xf0f0f0); // Light grey background
			sceneRef.current = scene;

			// --- Add Lighting ---
			const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
			scene.add(ambientLight);
			const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
			directionalLight.position.set(5, 10, 7.5);
			scene.add(directionalLight);

			const camera = new THREE.PerspectiveCamera(
				50,
				container.clientWidth / container.clientHeight,
				0.1,
				1000
			);
			cameraRef.current = camera;
			camera.position.set(0, 0, 20); // Position camera further back for 3D view

			const renderer = new THREE.WebGLRenderer({ antialias: true });
			rendererRef.current = renderer;
			renderer.setSize(container.clientWidth, container.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			container.appendChild(renderer.domElement);

			const controls = new OrbitControls(camera, renderer.domElement);
			controlsRef.current = controls;
			controls.enableRotate = true; // Enable rotation for 3D view
			controls.enableDamping = true;
			controls.dampingFactor = 0.1;
			controls.screenSpacePanning = true;
			controls.target.set(0, 0, 0); // Point controls at the center
			controls.addEventListener('change', () => {
				if (showLabels) updateLabels();
			});

			// --- Create Shapes ---
			shapesRef.current = createShapes();
			shapesRef.current.forEach((shape) => scene.add(shape));

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
				if (showLabels) updateLabels(); // Update labels on resize
			};
			window.addEventListener('resize', handleResize);

			// --- Cleanup ---
			return () => {
				cancelAnimationFrame(animationFrameId);
				gsap.killTweensOf(shapesRef.current.map((s) => s.position)); // Kill GSAP animations on cleanup
				gsap.killTweensOf(shapesRef.current.map((s) => s.rotation));
				window.removeEventListener('resize', handleResize);
				if (controlsRef.current) {
					controlsRef.current.removeEventListener(
						'change',
						updateLabels
					);
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
				// Dispose geometries/materials
				shapesRef.current.forEach((shape) => {
					shape.geometry.dispose();
					if (shape.material instanceof THREE.Material) {
						shape.material.dispose();
					} else if (Array.isArray(shape.material)) {
						shape.material.forEach((m) => m.dispose());
					}
				});
				sceneRef.current = null;
				cameraRef.current = null;
				rendererRef.current = null;
				controlsRef.current = null;
				shapesRef.current = [];
			};
		}
	}, [createShapes, updateLabels, showLabels]);

	return (
		<div
			style={{
				width: '100%',
				height: 'calc(100vh - 60px)',
				position: 'relative',
				overflow: 'hidden', // Hide potential scrollbars from labels
			}}
		>
			{' '}
			{/* Adjust height if needed */}
			<button
				onClick={animateFactor}
				disabled={isFactored || isAnimating} // Disable while factored or animating
				style={{
					position: 'absolute',
					top: '20px',
					left: '20px',
					zIndex: 100,
					padding: '12px 20px',
					cursor: isAnimating ? 'wait' : 'pointer',
					backgroundColor: isFactored
						? '#cccccc'
						: isAnimating
							? '#ffc107'
							: '#007bff', // Blue, Yellow during anim, Grey when done
					color: 'white',
					fontWeight: 'bold',
					fontSize: '16px',
					border: 'none',
					borderRadius: '8px',
					boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
				}}
			>
				{isFactored
					? 'Factored!'
					: isAnimating
						? 'Factoring...'
						: 'Factor! x² + 5x + 6'}
			</button>
			<div
				ref={containerRef}
				style={{ width: '100%', height: '100%', cursor: 'grab' }}
			/>
			{/* Render Labels */}
			{showLabels &&
				labels.map((label) => (
					<div
						key={label.id}
						style={{
							position: 'absolute',
							left: `${label.position.x}px`,
							top: `${label.position.y}px`,
							transform: 'translate(-50%, -50%)', // Center label on position
							color: '#333', // Dark text color
							background: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
							padding: '2px 5px',
							borderRadius: '3px',
							fontSize: '14px',
							fontWeight: 'bold',
							pointerEvents: 'none', // Prevent labels from blocking interactions
							whiteSpace: 'nowrap',
						}}
					>
						{label.text}
					</div>
				))}
			<div
				style={{
					position: 'absolute',
					bottom: '10px',
					left: '10px',
					color: '#555',
					fontSize: '12px',
					background: 'rgba(255,255,255,0.6)',
					padding: '4px',
					borderRadius: '3px',
				}}
			>
				{isFactored
					? 'Area = Height x Width = (x + 1 + 1) * (x + 1 + 1 + 1) = (x+2)(x+3)'
					: 'Click Factor to see how x² + 5x + 6 forms a rectangle.'}
			</div>
		</div>
	);
};

export default FactoringScene;
