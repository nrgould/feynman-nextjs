-- Add gamification features to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS learning_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_session_time INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS achievements TEXT[] DEFAULT '{}';

-- Update Chat table to include progress and concept_id
ALTER TABLE "Chat" 
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS concept_id UUID;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_concept_id ON "Chat" (concept_id);

-- Create function to increment session time
CREATE OR REPLACE FUNCTION increment_session_time(user_id UUID, time_to_add INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_time INTEGER;
BEGIN
    -- Get current session time
    SELECT total_session_time INTO current_time FROM "User" WHERE id = user_id;
    
    -- Return the new value (current + added time)
    RETURN COALESCE(current_time, 0) + time_to_add;
END;
$$ LANGUAGE plpgsql;

-- Create function to update learning streak
CREATE OR REPLACE FUNCTION update_learning_streak()
RETURNS TRIGGER AS $$
DECLARE
    chat_user_id UUID;
BEGIN
    -- Get the user_id from the Chat table using the chat_id from the Message
    SELECT c.user_id INTO chat_user_id
    FROM "Chat" c
    WHERE c.id = NEW.chat_id;
    
    -- If no user_id found, exit early
    IF chat_user_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- If user has logged in today, update streak
    IF EXISTS (
        SELECT 1 FROM "User_Activity" 
        WHERE user_id = chat_user_id 
        AND date_trunc('day', created_at) = date_trunc('day', CURRENT_TIMESTAMP)
    ) THEN
        -- Check if user logged in yesterday
        IF EXISTS (
            SELECT 1 FROM "User_Activity" 
            WHERE user_id = chat_user_id 
            AND date_trunc('day', created_at) = date_trunc('day', CURRENT_TIMESTAMP - INTERVAL '1 day')
        ) THEN
            -- Continue streak
            UPDATE "User" SET learning_streak = learning_streak + 1 
            WHERE id = chat_user_id;
            
            -- Check for streak achievements
            UPDATE "User" 
            SET achievements = array_append(achievements, 'learning_streak_3')
            WHERE id = chat_user_id 
            AND learning_streak >= 3 
            AND NOT 'learning_streak_3' = ANY(achievements);
            
            UPDATE "User" 
            SET achievements = array_append(achievements, 'learning_streak_7')
            WHERE id = chat_user_id 
            AND learning_streak >= 7 
            AND NOT 'learning_streak_7' = ANY(achievements);
        ELSE
            -- Reset streak to 1
            UPDATE "User" SET learning_streak = 1 
            WHERE id = chat_user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for learning streak
DROP TRIGGER IF EXISTS trigger_update_learning_streak ON "Message";
CREATE TRIGGER trigger_update_learning_streak
AFTER INSERT ON "Message"
FOR EACH ROW
EXECUTE FUNCTION update_learning_streak();

-- Create User_Activity table to track user activity
CREATE TABLE IF NOT EXISTS "User_Activity" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id),
    activity_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_time INTEGER DEFAULT 0
);

-- Create index for User_Activity
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON "User_Activity" (user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON "User_Activity" (created_at);

-- Sample queries to update user progress and achievements

-- Update concept progress
-- UPDATE "Concept" SET progress = 50 WHERE id = 'concept-uuid';

-- Add achievement to user
-- UPDATE "User" 
-- SET achievements = array_append(achievements, 'concept_mastered')
-- WHERE id = 'user-uuid' AND NOT 'concept_mastered' = ANY(achievements);

-- Update total session time
-- UPDATE "User" 
-- SET total_session_time = total_session_time + 30
-- WHERE id = 'user-uuid';

-- Record user activity
-- INSERT INTO "User_Activity" (user_id, activity_type, session_time)
-- VALUES ('user-uuid', 'chat_session', 30); 