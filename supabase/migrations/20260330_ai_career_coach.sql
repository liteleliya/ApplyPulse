-- Migration: AI Career Coach Feature
-- Created: 2026-03-30
-- Description: Add tables and columns for AI-powered career suggestions

-- =====================================================
-- 1. Create ai_suggestions table
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  suggestions_data JSONB NOT NULL,
  prompt_used TEXT,
  model_used TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups by application
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_application_id 
  ON ai_suggestions(application_id);

-- Add index for stage-based queries
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_stage 
  ON ai_suggestions(stage);

-- Add index for created_at (for usage stats)
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_created_at 
  ON ai_suggestions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see suggestions for their own applications
CREATE POLICY "Users can view their own suggestions"
  ON ai_suggestions
  FOR SELECT
  USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert suggestions for their own applications
CREATE POLICY "Users can create suggestions for their applications"
  ON ai_suggestions
  FOR INSERT
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update their own suggestions
CREATE POLICY "Users can update their own suggestions"
  ON ai_suggestions
  FOR UPDATE
  USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete their own suggestions
CREATE POLICY "Users can delete their own suggestions"
  ON ai_suggestions
  FOR DELETE
  USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- 2. Add ai_settings column to profiles
-- =====================================================
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ai_settings JSONB DEFAULT '{
  "api_provider": "openai",
  "api_key_encrypted": null,
  "preferred_model": "gpt-4-turbo",
  "auto_generate": false
}'::jsonb;

-- Add index for querying by provider
CREATE INDEX IF NOT EXISTS idx_profiles_ai_settings_provider 
  ON profiles((ai_settings->>'api_provider'));

-- =====================================================
-- 3. Create function to update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_ai_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS trigger_ai_suggestions_updated_at ON ai_suggestions;
CREATE TRIGGER trigger_ai_suggestions_updated_at
  BEFORE UPDATE ON ai_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_suggestions_updated_at();

-- =====================================================
-- 4. Add helpful comments
-- =====================================================
COMMENT ON TABLE ai_suggestions IS 'Stores AI-generated career guidance for each application stage';
COMMENT ON COLUMN ai_suggestions.suggestions_data IS 'JSONB containing structured suggestions (topics, action items, timeline, etc.)';
COMMENT ON COLUMN ai_suggestions.stage IS 'Application stage when suggestions were generated (wishlist, applied, assessment, interview, offer)';
COMMENT ON COLUMN ai_suggestions.model_used IS 'LLM model used (e.g., gpt-4-turbo, claude-3-opus)';
COMMENT ON COLUMN ai_suggestions.tokens_used IS 'Total tokens consumed for this suggestion (for cost tracking)';
COMMENT ON COLUMN profiles.ai_settings IS 'User AI preferences: provider, encrypted API key, model, auto-generate toggle';
