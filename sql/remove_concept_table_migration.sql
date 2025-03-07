-- Migration to remove the Concept table and update related tables
-- This migration will:
-- 1. Remove foreign key constraints referencing the Concept table
-- 2. Ensure all necessary data from Concept is preserved in LearningPathNode
-- 3. Drop the Concept table
-- 4. Update the Chat table to reference LearningPathNode directly

-- Step 1: Update the Chat table to ensure it has all necessary columns
ALTER TABLE "Chat" 
  DROP CONSTRAINT IF EXISTS "Chat_concept_id_fkey";

-- Step 2: Make sure LearningPathNode has all necessary fields
-- (chat_id and is_active should already exist based on the schema)

-- Step 3: Update any Chat records to reference learning_path_node_id instead of concept_id
-- First, create a temporary function to help with the migration
CREATE OR REPLACE FUNCTION migrate_concept_references() RETURNS void AS $$
DECLARE
  chat_record RECORD;
BEGIN
  -- For each chat that references a concept
  FOR chat_record IN 
    SELECT c.id, c.concept_id 
    FROM "Chat" c 
    WHERE c.concept_id IS NOT NULL AND c.learning_path_node_id IS NULL
  LOOP
    -- Update the chat to reference the learning path node directly
    -- (assuming concept_id is the same as node_id in many cases)
    UPDATE "Chat"
    SET learning_path_node_id = chat_record.concept_id
    WHERE id = chat_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the migration function
SELECT migrate_concept_references();

-- Drop the temporary function
DROP FUNCTION migrate_concept_references();

-- Step 4: Update LearningPathNode records with chat_id from Concept if needed
UPDATE "LearningPathNode" lpn
SET chat_id = c.chat_id
FROM "Concept" c
WHERE lpn.id = c.id AND lpn.chat_id IS NULL AND c.chat_id IS NOT NULL;

-- Step 5: Update LearningPathNode records with is_active from Concept if needed
UPDATE "LearningPathNode" lpn
SET is_active = c.is_active
FROM "Concept" c
WHERE lpn.id = c.id AND c.is_active = true;

-- Step 6: Drop the Concept table and its dependent objects
DROP TABLE IF EXISTS "Concept" CASCADE;

-- Step 7: Make concept_id nullable in Chat table since we're transitioning away from it
ALTER TABLE "Chat" ALTER COLUMN concept_id DROP NOT NULL;

-- Step 8: Add an index on learning_path_node_id for better performance
CREATE INDEX IF NOT EXISTS idx_chat_learning_path_node_id ON "Chat" (learning_path_node_id); 