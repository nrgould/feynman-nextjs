export type Message = {
	chatId: string;
	userId: string;
	_id?: string;
	message: string; // The content of the message
	sender: 'user' | 'system'; //Whether message is coming from the user or system
	created_at: Date;
	attachments?: string[];
};

export type Conversation = {
	_id?: string;
	userId: string;
	conceptId?: string;
	context?: string;
	recentMessages: Message[];
};

export type User = { //SAMPLE FOR TESTING API / INFINITE SCROLL
	first_name: string;
	last_name: string;
	email: string;
	city: string;
	country: string;
	date_of_birth: string;
	gender: string;
	id: 1;
	job: string;
	latitude: number;
	longitude: number;
	phone: string;
	profile_picture: string;
	state: string;
	street: string;
	zipcode: string;
};
