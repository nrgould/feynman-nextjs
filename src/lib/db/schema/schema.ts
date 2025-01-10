import type { InferSelectModel } from 'drizzle-orm';
import {
	pgTable,
	varchar,
	timestamp,
	json,
	uuid,
	text,
	boolean,
	integer,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	name: text('name').notNull(),
	username: text('username'),
	userId: text('userId').notNull(),
	email: text('email').notNull().unique(),
	age: integer('age'),
	learningDisability: text('learningDisability'),
	goals: text('goals'),
	referralSource: text('referralSource'),
	educationLevel: text('educationLevel'),
	accountType: varchar('accountType', { enum: ['free', 'plus', 'pro'] })
		.notNull()
		.default('free'), // Enum with default value
	conceptLimit: integer('conceptLimit').notNull().default(1),
	conceptIds: uuid('conceptIds')
		.array()
		.notNull()
		.default([])
		.references(() => Concept.id),
	selectedSubjects: text('selectedSubjects').array().notNull().default([]),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	conceptId: uuid('conceptId').notNull(),
	createdAt: timestamp('createdAt').notNull(),
	updatedAt: timestamp('updatedAt').notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id),
	visibility: varchar('visibility', { enum: ['public', 'private'] })
		.notNull()
		.default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('Message', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	chatId: uuid('chatId')
		.notNull()
		.references(() => chat.id),
	role: varchar('role').notNull(),
	content: json('content').notNull(),
	createdAt: timestamp('createdAt').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const Concept = pgTable('Concept', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id),
	chatId: uuid('chatId')
		.notNull()
		.references(() => chat.id),
	name: text('name').notNull(),
	isActive: boolean('isActive').notNull().default(false),
	subject: text('subject').notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('createdAt').notNull(),
	updatedAt: timestamp('updatedAt').notNull(),
	progress: integer('progress').notNull().default(0),
	relatedConcepts: uuid('relatedConcepts').array().notNull().default([]),
});

export type Concept = InferSelectModel<typeof Concept>;

// export const vote = pgTable(
// 	'Vote',
// 	{
// 		chatId: uuid('chatId')
// 			.notNull()
// 			.references(() => chat.id),
// 		messageId: uuid('messageId')
// 			.notNull()
// 			.references(() => message.id),
// 		isUpvoted: boolean('isUpvoted').notNull(),
// 	},
// 	(table) => {
// 		return {
// 			pk: primaryKey({ columns: [table.chatId, table.messageId] }),
// 		};
// 	}
// );

// export type Vote = InferSelectModel<typeof vote>;

// export const document = pgTable(
// 	'Document',
// 	{
// 		id: uuid('id').notNull().defaultRandom(),
// 		createdAt: timestamp('createdAt').notNull(),
// 		title: text('title').notNull(),
// 		content: text('content'),
// 		userId: uuid('userId')
// 			.notNull()
// 			.references(() => user.id),
// 	},
// 	(table) => {
// 		return {
// 			pk: primaryKey({ columns: [table.id, table.createdAt] }),
// 		};
// 	}
// );

// export type Document = InferSelectModel<typeof document>;

// export const suggestion = pgTable(
// 	'Suggestion',
// 	{
// 		id: uuid('id').notNull().defaultRandom(),
// 		documentId: uuid('documentId').notNull(),
// 		documentCreatedAt: timestamp('documentCreatedAt').notNull(),
// 		originalText: text('originalText').notNull(),
// 		suggestedText: text('suggestedText').notNull(),
// 		description: text('description'),
// 		isResolved: boolean('isResolved').notNull().default(false),
// 		userId: uuid('userId')
// 			.notNull()
// 			.references(() => user.id),
// 		createdAt: timestamp('createdAt').notNull(),
// 	},
// 	(table) => ({
// 		pk: primaryKey({ columns: [table.id] }),
// 		documentRef: foreignKey({
// 			columns: [table.documentId, table.documentCreatedAt],
// 			foreignColumns: [document.id, document.createdAt],
// 		}),
// 	})
// );

// export type Suggestion = InferSelectModel<typeof suggestion>;
