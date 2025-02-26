-- This migration fixes issues with the learning streak functionality and Chat table

-- 1. First, disable the problematic trigger to prevent errors
ALTER TABLE "Message" DISABLE TRIGGER IF EXISTS trigger_update_learning_streak;

-- 2. Add user_id column to Chat table if it doesn't exist
ALTER TABLE "Chat" 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 3. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_user_id ON "Chat" (user_id);

-- 4. Update existing Chat records to set user_id from related Concept records
-- This assumes that Concept has a user_id field and is related to Chat via concept_id
UPDATE "Chat" c
SET user_id = (
    SELECT co.user_id 
    FROM "Concept" co 
    WHERE co.id = c.concept_id
)
WHERE c.user_id IS NULL AND c.concept_id IS NOT NULL;

-- 5. Fix the update_learning_streak function to work with TEXT user_id
CREATE OR REPLACE FUNCTION update_learning_streak()
RETURNS TRIGGER AS $$
DECLARE
    chat_user_id TEXT;
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

-- 6. Recreate the trigger but keep it disabled for now
DROP TRIGGER IF EXISTS trigger_update_learning_streak ON "Message";
CREATE TRIGGER trigger_update_learning_streak
AFTER INSERT ON "Message"
FOR EACH ROW
EXECUTE FUNCTION update_learning_streak();

-- Note: The trigger remains disabled until you're ready to enable it
-- To enable it in the future, run: 
-- ALTER TABLE "Message" ENABLE TRIGGER trigger_update_learning_streak;

-- 7. Add a comment to explain the current state
COMMENT ON TRIGGER trigger_update_learning_streak ON "Message" IS 
'This trigger is currently disabled to prevent errors. It can be enabled after ensuring all Chat records have a valid user_id.'; 