'use client';

import { useState, useCallback } from 'react';
import {
	ReactFlow,
	Controls,
	Background,
	applyNodeChanges,
	applyEdgeChanges,
	Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define three learning concepts as nodes
const initialNodes = [
	{
		id: '1',
		data: { label: 'Quantum Mechanics Basics' },
		position: { x: 50, y: 50 },
		type: 'input',
		style: {
			background: '#f0f9ff',
			border: '1px solid #93c5fd',
			borderRadius: '8px',
			padding: '10px',
			width: 200,
		},
	},
	{
		id: '2',
		data: { label: 'Wave-Particle Duality' },
		position: { x: 350, y: 150 },
		style: {
			background: '#ecfdf5',
			border: '1px solid #6ee7b7',
			borderRadius: '8px',
			padding: '10px',
			width: 200,
		},
	},
	{
		id: '3',
		data: { label: 'Quantum Entanglement' },
		position: { x: 650, y: 50 },
		style: {
			background: '#fef3c7',
			border: '1px solid #fcd34d',
			borderRadius: '8px',
			padding: '10px',
			width: 200,
		},
	},
];

// Define connections between concepts
const initialEdges = [
	{
		id: '1-2',
		source: '1',
		target: '2',
		label: 'Leads to understanding of',
		type: 'smoothstep',
		animated: true,
		style: { stroke: '#93c5fd' },
	},
	{
		id: '2-3',
		source: '2',
		target: '3',
		label: 'Required for',
		type: 'smoothstep',
		animated: true,
		style: { stroke: '#6ee7b7' },
	},
];

export default function LearningPathPage() {
	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState(initialEdges);

	const onNodesChange = useCallback(
		(changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
		[]
	);

	const onEdgesChange = useCallback(
		(changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[]
	);

	return (
		<div className='w-full h-screen'>
			<h1 className='text-2xl font-bold p-4'>
				Quantum Physics Learning Path
			</h1>
			<div className='w-full h-[calc(100vh-100px)]'>
				<ReactFlow
					nodes={nodes}
					onNodesChange={onNodesChange}
					edges={edges}
					onEdgesChange={onEdgesChange}
					fitView
					attributionPosition='bottom-right'
				>
					<Background color='#f8fafc' gap={16} />
					<Controls />
					<Panel
						position='top-right'
						className='bg-white p-4 rounded-md shadow-md'
					>
						<h3 className='font-medium text-gray-700'>
							Learning Path
						</h3>
						<p className='text-sm text-gray-500'>
							Drag nodes to rearrange concepts
						</p>
					</Panel>
				</ReactFlow>
			</div>
		</div>
	);
}
