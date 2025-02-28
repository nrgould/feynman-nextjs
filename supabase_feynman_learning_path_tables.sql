-- SQL commands to create the necessary tables for Concept Learning Paths

-- Create the ConceptLearningPath table
CREATE TABLE IF NOT EXISTS "ConceptLearningPath" (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  chat_id UUID NOT NULL,
  learning_path_node_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  current_stage TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  overall_progress INTEGER DEFAULT 0,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES "User"(id) ON DELETE CASCADE,
  CONSTRAINT fk_concept FOREIGN KEY(concept_id) REFERENCES "Concept"(id) ON DELETE CASCADE,
  CONSTRAINT fk_chat FOREIGN KEY(chat_id) REFERENCES "Chat"(id) ON DELETE CASCADE,
  CONSTRAINT fk_learning_path_node FOREIGN KEY(learning_path_node_id) REFERENCES "LearningPathNode"(id) ON DELETE SET NULL
);

-- Create the ConceptLearningPathStage table
CREATE TABLE IF NOT EXISTS "ConceptLearningPathStage" (
  id TEXT PRIMARY KEY,
  concept_learning_path_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stage TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  estimated_time_minutes INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  resources JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT fk_concept_learning_path FOREIGN KEY(concept_learning_path_id) REFERENCES "ConceptLearningPath"(id) ON DELETE CASCADE
);

-- Add column to the Chat table to relate it to Concept learning paths
ALTER TABLE IF EXISTS "Chat"
ADD COLUMN IF NOT EXISTS concept_learning_path_id UUID,
ADD CONSTRAINT fk_concept_learning_path FOREIGN KEY(concept_learning_path_id) REFERENCES "ConceptLearningPath"(id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_concept_learning_path_user ON "ConceptLearningPath"(user_id);
CREATE INDEX IF NOT EXISTS idx_concept_learning_path_concept ON "ConceptLearningPath"(concept_id);
CREATE INDEX IF NOT EXISTS idx_concept_learning_path_chat ON "ConceptLearningPath"(chat_id);
CREATE INDEX IF NOT EXISTS idx_concept_learning_path_node ON "ConceptLearningPath"(learning_path_node_id);
CREATE INDEX IF NOT EXISTS idx_concept_learning_path_stage_path ON "ConceptLearningPathStage"(concept_learning_path_id);
CREATE INDEX IF NOT EXISTS idx_chat_concept_learning_path ON "Chat"(concept_learning_path_id); 