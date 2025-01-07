import Image from 'next/image';
import React from 'react';
import { YouTubeEmbed } from '../molecules/YouTubeEmbed';

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
		<div className='max-w-[500px]'>
			<YouTubeEmbed videoId={videoId} title={title} />
			{/* <Image src={thumbnailUrl} alt={title} width={300} height={300} /> */}
		</div>
	);
}

export default YouTubeVideoTool;
