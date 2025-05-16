'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface MathProblem {
	title: string;
	initialProblem: string;
	steps: string[];
	solved: boolean;
	selectedMethod: string;
}

export default function ProblemList() {
	const [data, setData] = useState<MathProblem[]>([]);

	return (
		<div>
			{data?.map((problem, index) => (
				<div key={index}>{problem.title}</div>
			))}
		</div>
	);
}
