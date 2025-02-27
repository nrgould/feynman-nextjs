-- SQL commands to create the necessary tables for Learning Paths

-- Create the LearningPath table
CREATE TABLE IF NOT EXISTS "LearningPath" (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  concept TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  overall_progress INTEGER DEFAULT 0,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create the LearningPathNode table
CREATE TABLE IF NOT EXISTS "LearningPathNode" (
  id TEXT PRIMARY KEY,
  learning_path_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  concept TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  estimated_hours NUMERIC NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  grade INTEGER,
  chat_id UUID,
  CONSTRAINT fk_learning_path FOREIGN KEY(learning_path_id) REFERENCES "LearningPath"(id) ON DELETE CASCADE,
  CONSTRAINT fk_chat FOREIGN KEY(chat_id) REFERENCES "Chat"(id) ON DELETE SET NULL,
  CONSTRAINT fk_node_user FOREIGN KEY(user_id) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create the LearningPathEdge table
CREATE TABLE IF NOT EXISTS "LearningPathEdge" (
  id TEXT PRIMARY KEY,
  learning_path_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  label TEXT,
  type TEXT DEFAULT 'smoothstep',
  CONSTRAINT fk_learning_path FOREIGN KEY(learning_path_id) REFERENCES "LearningPath"(id) ON DELETE CASCADE,
  CONSTRAINT fk_source FOREIGN KEY(source) REFERENCES "LearningPathNode"(id) ON DELETE CASCADE,
  CONSTRAINT fk_target FOREIGN KEY(target) REFERENCES "LearningPathNode"(id) ON DELETE CASCADE,
  CONSTRAINT fk_edge_user FOREIGN KEY(user_id) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Add columns to the Chat table to relate it to learning paths
ALTER TABLE IF EXISTS "Chat"
ADD COLUMN IF NOT EXISTS learning_path_id UUID,
ADD COLUMN IF NOT EXISTS learning_path_node_id TEXT,
ADD CONSTRAINT fk_learning_path FOREIGN KEY(learning_path_id) REFERENCES "LearningPath"(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_learning_path_node FOREIGN KEY(learning_path_node_id) REFERENCES "LearningPathNode"(id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learning_path_user ON "LearningPath"(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_node_path ON "LearningPathNode"(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_node_user ON "LearningPathNode"(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_edge_path ON "LearningPathEdge"(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_edge_user ON "LearningPathEdge"(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_learning_path ON "Chat"(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_chat_learning_path_node ON "Chat"(learning_path_node_id); 