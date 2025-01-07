import { ScrollArea } from '@/components/ui/scroll-area';

export default async function Page() {
	return (
		<ScrollArea className='h-[calc(100vh-4rem)] w-full'>
			<div className='container mx-auto py-6 px-4'>
				<h1 className='text-3xl font-bold mb-6'>Learning Resources</h1>

				{/* {conceptVideos &&
					conceptVideos.map(({ concept, videos }) => (
						<div key={concept.title} className='mb-8'>
							<Card>
								<CardHeader>
									<CardTitle>{concept.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										{videos.map((video: any) => (
											<Card key={video.id.videoId}>
												<CardContent className='p-4'>
													<YouTubeEmbed
														videoId={
															video.id.videoId
														}
														title={
															video.snippet.title
														}
													/>
													<h3 className='font-semibold mt-2 line-clamp-2'>
														{video.snippet.title}
													</h3>
													<p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
														{
															video.snippet
																.description
														}
													</p>
												</CardContent>
											</Card>
										))}
									</div>
								</CardContent>
							</Card>
							<Separator className='my-8' />
						</div>
					))} */}
			</div>
		</ScrollArea>
	);
}
