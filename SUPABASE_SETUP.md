# Supabase Cache Setup Instructions

## 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (usually 1-2 minutes)

## 2. Create the Cache Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create the fable cache table
CREATE TABLE fable_cache (
  id BIGSERIAL PRIMARY KEY,
  cache_key VARCHAR(32) UNIQUE NOT NULL,
  fable_content TEXT NOT NULL,
  animal1 VARCHAR(100) NOT NULL,
  animal2 VARCHAR(100) NOT NULL,
  setting VARCHAR(200) NOT NULL,
  moral VARCHAR(500) NOT NULL,
  modelled_mode VARCHAR(200) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_fable_cache_key ON fable_cache(cache_key);
CREATE INDEX idx_fable_cache_created_at ON fable_cache(created_at);

-- Optional: Enable Row Level Security (RLS) if needed
-- ALTER TABLE fable_cache ENABLE ROW LEVEL SECURITY;
```

## 3. Get Your Supabase Credentials
1. Go to your project Settings → API
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Service Role Key** (secret key, starts with `eyJ`)

## 4. Add Environment Variables
Create a `.env.local` file in your project root with:

```env
# OpenAI API Configuration (if you have one)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## 5. Restart Your Development Server
```bash
npm run dev
```

## Features
- ✅ **Persistent cache** - Survives deployments
- ✅ **Fast lookups** - Indexed database queries
- ✅ **Free tier** - Up to 500MB storage
- ✅ **Automatic cleanup** - Optional old entry removal
- ✅ **Cache statistics** - Monitor usage

## Fallback Behavior
If Supabase is unavailable or misconfigured:
- API will still work using the fallback fable generator
- No caching will occur, but functionality is preserved
- Errors are logged but don't break the API

## Optional: Cache Management
You can add these endpoints to manage your cache:

### Get Cache Stats
```typescript
// GET /api/cache-stats
const stats = await getCacheStats();
// Returns: { totalEntries: 150, oldestEntry: "2024-01-01T..." }
```

### Clean Old Cache
```typescript
// POST /api/clean-cache
await cleanOldCache(30); // Remove entries older than 30 days
```
