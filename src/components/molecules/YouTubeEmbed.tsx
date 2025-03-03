import { YouTubeEmbed } from "@next/third-parties/google";

interface YouTubeEmbedProps {
	videoId: string;
	title: string;
}

export function YouTubeEmbedUI({ videoId, title }: YouTubeEmbedProps) {
	return (
		<div className='relative pb-[56.25%] h-0'>
			<YouTubeEmbed
				videoid={videoId}
				height={400}
			/>
			{/* <iframe
				className='absolute top-0 left-0 w-full h-full rounded-lg'
				src={`https://www.youtube.com/embed/${videoId}`}
				title={title}
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				allowFullScreen
			/> */}
		</div>
	);
}
