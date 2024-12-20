type Props = {
	stage: string;
};

export const LearningStage = ({ stage }: Props) => {
	return (
		<div>
			<h2>Learning Stage</h2>
			<p>Stage: {stage}</p>
		</div>
	);
};
