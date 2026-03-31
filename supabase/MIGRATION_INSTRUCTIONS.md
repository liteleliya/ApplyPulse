# AI Career Coach - Migration Instructions

## Step 1: Run Database Migration

You need to run the SQL migration in your Supabase database.

### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/migrations/20260330_ai_career_coach.sql`
5. Paste into the SQL editor
6. Click **Run** button

### Option B: Using Supabase CLI
```bash
# If you have supabase CLI installed
cd applypulse
supabase db push
```

### Option C: Copy-paste the migration manually
The migration file is located at:
```
applypulse/supabase/migrations/20260330_ai_career_coach.sql
```

## Step 2: Add Environment Variable

Add this to your `.env.local`:
```bash
# AI Encryption Key (use a strong random string in production)
AI_ENCRYPTION_KEY="your-super-secret-encryption-key-change-me-in-production"
```

⚠️ **IMPORTANT**: Use a strong, random encryption key in production!

Generate a secure key with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Verify Migration

After running the migration, verify in Supabase dashboard:

### Tables Created:
- ✅ `ai_suggestions` table
- ✅ `ai_settings` column in `profiles` table

### Indexes Created:
- ✅ `idx_ai_suggestions_application_id`
- ✅ `idx_ai_suggestions_stage`
- ✅ `idx_ai_suggestions_created_at`
- ✅ `idx_profiles_ai_settings_provider`

### RLS Policies:
- ✅ Users can view/create/update/delete their own suggestions
- ✅ Suggestions are linked to applications via RLS

## What's Next?

Phase 1 is complete! ✅

**Completed:**
- ✅ Database schema (ai_suggestions table)
- ✅ Profile settings column (ai_settings)
- ✅ API key encryption utilities
- ✅ API key validation endpoint

**Next Steps (Phase 2):**
- Settings Page UI
- Generate Suggestions API endpoint
- OpenAI integration
- Prompt templates

---

## Testing the Migration

You can test if the migration worked by running this query in Supabase SQL Editor:

```sql
-- Check if ai_suggestions table exists
SELECT * FROM ai_suggestions LIMIT 1;

-- Check if ai_settings column exists in profiles
SELECT ai_settings FROM profiles LIMIT 1;
```

Both queries should execute without errors (even if they return no rows).
