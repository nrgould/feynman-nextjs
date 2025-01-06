import Image from 'next/image';
import React from 'react';

function YouTubeVideoTool({
	videoId,
	title,
	description,
	thumbnailUrl,
}: {
	videoId: string;
	title: string;
	description: string;
	thumbnailUrl: string;
}) {
	return (
		<div>
			<h3>{title}</h3>
			<p>{description}</p>
			<Image src={thumbnailUrl} alt={title} width={300} height={300} />
		</div>
	);
}

export default YouTubeVideoTool;
