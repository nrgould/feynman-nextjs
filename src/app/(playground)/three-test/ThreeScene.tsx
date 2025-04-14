'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Initial Dummy concept data
const initialConceptNames = Array.from(
	{ length: 50 },
	(_, i) => `Concept ${i + 1}`
);

// Shared geometries and materials (can be reused)
const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
const originalNodeColor = new THREE.Color(0xff00ff);
const highlightColor = new THREE.Color(0xffff00); // Yellow highlight
const lineMaterial = new THREE.LineBasicMaterial({
	color: 0x00ffff,
	transparent: true,
	opacity: 0.5,
});

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

	const [concepts, setConcepts] = useState<{ id: number; name: string }[]>(
		initialConceptNames.map((name, i) => ({ id: i, name }))
	);
	const [tooltipContent, setTooltipContent] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const hoveredNodeRef = useRef<THREE.Mesh | null>(null);
	const originalColorRef = useRef<THREE.Color | null>(null);

	// Function to create a single node mesh
	const createNodeMesh = useCallback(
		(concept: { id: number; name: string }) => {
			const nodeMaterial = new THREE.MeshBasicMaterial({
				color: originalNodeColor,
			});
			const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
			node.userData = { id: concept.id, name: concept.name };

			// Simple spherical positioning for new nodes too (can be improved)
			const phi = Math.random() * Math.PI;
			const theta = Math.random() * 2 * Math.PI;
			const sphereRadius = 3;
			const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
			const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
			const z = sphereRadius * Math.cos(phi);
			node.position.set(x, y, z);

			return node;
		},
		[]
	); // No dependencies, this function is static

	// Function to add a new concept/node
	const addNode = useCallback(() => {
		if (!groupRef.current) return;

		const newId = concepts.length;
		const newConcept = { id: newId, name: `Concept ${newId + 1}` };

		// Update React state
		setConcepts((prevConcepts) => [...prevConcepts, newConcept]);

		// Create and add Three.js object
		const newNodeMesh = createNodeMesh(newConcept);
		groupRef.current.add(newNodeMesh);
		nodesRef.current.push(newNodeMesh); // Keep track of the mesh for interaction

		console.log(`Added node: ${newConcept.name}`);

		// Maybe add a connection?
		if (nodesRef.current.length > 1) {
			const randomIndex = Math.floor(
				Math.random() * (nodesRef.current.length - 1)
			); // Connect to any node except the last one (itself)
			const points = [
				nodesRef.current[randomIndex].position,
				newNodeMesh.position,
			];
			const lineGeometry = new THREE.BufferGeometry().setFromPoints(
				points
			);
			const line = new THREE.Line(lineGeometry, lineMaterial.clone()); // Use clone if material props might change
			groupRef.current.add(line);
		}
	}, [concepts, createNodeMesh]); // Depend on concepts state and createNodeMesh

	// Effect for initial setup and cleanup
	useEffect(() => {
		if (typeof window !== 'undefined' && containerRef.current) {
			const container = containerRef.current;

			// --- Initialize Scene, Camera, Renderer, Controls ---
			const scene = new THREE.Scene();
			sceneRef.current = scene;
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
			container.appendChild(renderer.domElement);

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

			// --- Create Initial Nodes and Lines ---
			nodesRef.current = []; // Clear previous nodes if effect re-runs
			concepts.forEach((concept) => {
				const nodeMesh = createNodeMesh(concept);
				group.add(nodeMesh);
				nodesRef.current.push(nodeMesh);
			});

			const initialConnections = 30;
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
				const points = [
					nodesRef.current[startIndex].position,
					nodesRef.current[endIndex].position,
				];
				const lineGeometry = new THREE.BufferGeometry().setFromPoints(
					points
				);
				const line = new THREE.Line(lineGeometry, lineMaterial);
				group.add(line);
			}

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
									.material as THREE.MeshBasicMaterial
							).color.copy(originalColorRef.current);
						}
						hoveredNodeRef.current = intersectedNode;
						originalColorRef.current = (
							intersectedNode.material as THREE.MeshBasicMaterial
						).color.clone();
						(
							intersectedNode.material as THREE.MeshBasicMaterial
						).color.copy(highlightColor);

						const { name } = intersectedNode.userData;
						setTooltipContent(name);
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
								.material as THREE.MeshBasicMaterial
						).color.copy(originalColorRef.current);
					}
					hoveredNodeRef.current = null;
					originalColorRef.current = null;
					setTooltipContent(null);
					setTooltipPosition(null);
				}
			};

			container.addEventListener('mousemove', onMouseMove);

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
				groupRef.current.rotation.y += 0.001;
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
				}
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
			};
		}
	}, [createNodeMesh, concepts]); // Rerun effect if createNodeMesh changes (it shouldn't) or initial concepts change

	return (
		<div style={{ width: '100%', height: '100vh', position: 'relative' }}>
			<button
				onClick={addNode} // Call addNode function on click
				style={{
					position: 'absolute',
					top: '20px',
					left: '20px',
					zIndex: 100, // Much higher z-index to ensure it's above everything
					padding: '12px 20px',
					cursor: 'pointer',
					backgroundColor: '#ff3366', // Bright pink background
					color: 'white',
					fontWeight: 'bold',
					fontSize: '16px',
					border: 'none',
					borderRadius: '8px',
					boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Add shadow for depth
				}}
			>
				Add Concept Node
			</button>
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
						whiteSpace: 'nowrap',
						zIndex: 20, // Ensure tooltip is above everything
					}}
				>
					{tooltipContent}
				</div>
			)}

			{/* Debug message - will show if button exists but is not visible */}
			<div
				style={{
					position: 'absolute',
					bottom: '10px',
					left: '10px',
					background: 'white',
					padding: '5px',
					zIndex: 999,
				}}
			>
				Click the pink &quot;Add Concept Node&quot; button in the
				top-left to add nodes
			</div>
		</div>
	);
};

export default ThreeScene;
