import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { Progress } from '@/components/ui/progress';

interface NodeData {
	id: number;
	name: string;
	mastery: number;
	category: string;
}

interface NodeDetailsDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	nodeData: NodeData | null;
}

const NodeDetailsDrawer = ({
	isOpen,
	onOpenChange,
	nodeData,
}: NodeDetailsDrawerProps) => {
	return (
		<Drawer
			open={isOpen}
			onOpenChange={onOpenChange}
			shouldScaleBackground={false}
		>
			<DrawerContent>
				<div className='mx-auto w-full max-w-4xl'>
					<DrawerHeader>
						<DrawerTitle>
							{nodeData?.name || 'Concept Details'}
						</DrawerTitle>
						<DrawerDescription>
							{nodeData?.category || 'Category'} • Mastery:{' '}
							{nodeData ? Math.round(nodeData.mastery * 100) : 0}%
						</DrawerDescription>
					</DrawerHeader>

					{nodeData && (
						<div className='p-4 pt-0'>
							<div className='space-y-4'>
								<div>
									<h3 className='text-sm font-medium mb-1'>
										Mastery Level
									</h3>
									<div className='flex items-center space-x-4'>
										<Progress
											value={nodeData.mastery * 100}
											className='w-full'
										/>
									</div>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div>
										<h3 className='text-sm font-medium mb-1'>
											Connected Concepts
										</h3>
										<div className='px-3 py-2 bg-muted rounded-md text-xs'>
											3 connections
										</div>
									</div>

									<div>
										<h3 className='text-sm font-medium mb-1'>
											Resources
										</h3>
										<div className='px-3 py-2 bg-muted rounded-md text-xs'>
											2 resources available
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					<DrawerFooter className='pt-2'>
						<div className='flex gap-2 w-full'>
                            <Button>View Full Details</Button>
                            <DrawerClose asChild>
                                <Button variant='outline'>Close</Button>
                            </DrawerClose>
                        </div>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default NodeDetailsDrawer;
