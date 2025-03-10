# Database Migration: Removing the Concept Table

This directory contains SQL migration scripts to simplify the database schema by removing the redundant Concept table.

## Background

The original schema had a `Concept` table that was redundant with the `LearningPathNode` table. Both tables stored similar information, and the `Concept` table was primarily used as an intermediary between `Chat` and `LearningPathNode`.

## Migration Overview

The `remove_concept_table_migration.sql` script performs the following operations:

1. Removes foreign key constraints referencing the Concept table
2. Migrates any Chat records to reference learning_path_node_id directly instead of concept_id
3. Updates LearningPathNode records with chat_id and is_active values from Concept
4. Updates Chat records with progress values from Concept
5. Drops the Concept table
6. Makes concept_id nullable in the Chat table (as we're transitioning away from it)
7. Adds an index on learning_path_node_id for better performance

## Code Changes

Along with this database migration, the following code changes were made:

1. Updated the `createChatFromLearningPathNode` function to work directly with the LearningPathNode table
2. Updated the `checkConceptActive` function to check the LearningPathNode table
3. Simplified the ConceptNode component to use node.chat_id directly instead of maintaining a separate state
4. Updated the `updateConceptProgress` function to work without the Concept table, using the Chat and LearningPathNode tables directly

### Progress Updates

The progress update flow has been simplified:

- Progress is now updated directly on the Chat record
- If the Chat is linked to a LearningPathNode, the node's progress is also updated
- The function now accepts either a Chat ID or a LearningPathNode ID as the conceptId parameter

## Running the Migration

To apply this migration:

1. Back up your database
2. Run the SQL script against your Supabase database
3. Deploy the updated code

```bash
# Example command to run the migration (using psql)
psql -h your-supabase-host -d your-database -U your-username -f remove_concept_table_migration.sql
```

## Verification

After running the migration, verify that:

1. All chats previously associated with concepts are still accessible
2. Learning path nodes correctly show "Continue Learning" when they have an associated chat
3. New chats can be created for learning path nodes
4. Progress updates work correctly for both standalone chats and learning path nodes
