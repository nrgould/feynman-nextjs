'use client';

import { useAssessmentStore } from '@/store/store';
import { MobileStrengthsWeaknesses } from './MobileStrengthsWeaknesses';

export function ClientSideMobileStrengthsWeaknesses() {
	const { assessment } = useAssessmentStore();

	if (!assessment) return null;

	return <MobileStrengthsWeaknesses assessment={assessment} />;
}
