import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Type definition for fable parameters
type FableParams = {
  animal1: string;
  animal2: string;
  setting: string;
  moral: string;
  modelledMode: string;
};

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Generate a unique cache key from fable parameters
export function generateCacheKey(params: FableParams): string {
  const normalizedParams = {
    animal1: params.animal1.toLowerCase().trim(),
    animal2: params.animal2.toLowerCase().trim(),
    setting: params.setting.toLowerCase().trim(),
    moral: params.moral.toLowerCase().trim(),
    modelledMode: params.modelledMode.toLowerCase().trim(),
  };
  
  const paramsString = JSON.stringify(normalizedParams, Object.keys(normalizedParams).sort());
  return crypto.createHash('md5').update(paramsString).digest('hex');
}

// Check if cached fable exists and return it
export async function getCachedFable(cacheKey: string): Promise<string | null> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('fable_cache')
      .select('fable_content')
      .eq('cache_key', cacheKey)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned (cache miss)
        console.log('Cache miss for key:', cacheKey);
        return null;
      }
      throw error;
    }
    
    console.log('Cache hit for key:', cacheKey);
    return data.fable_content;
  } catch (error) {
    console.error('Error getting cached fable:', error);
    return null;
  }
}

// Store fable in cache
export async function storeFableInCache(cacheKey: string, fable: string, params: FableParams): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    
    const cacheData = {
      cache_key: cacheKey,
      fable_content: fable,
      animal1: params.animal1,
      animal2: params.animal2,
      setting: params.setting,
      moral: params.moral,
      modelled_mode: params.modelledMode,
      created_at: new Date().toISOString(),
    };
    
    const { error } = await supabase
      .from('fable_cache')
      .upsert(cacheData, { 
        onConflict: 'cache_key',
        ignoreDuplicates: false 
      });
    
    if (error) {
      throw error;
    }
    
    console.log('Stored fable in cache with key:', cacheKey);
  } catch (error) {
    console.error('Error storing fable in cache:', error);
    // Don't throw error - caching failure shouldn't break the API
  }
}

// Optional: Clean old cache entries (can be called periodically)
export async function cleanOldCache(maxAgeDays: number = 30): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);
    
    const { error } = await supabase
      .from('fable_cache')
      .delete()
      .lt('created_at', cutoffDate.toISOString());
    
    if (error) {
      throw error;
    }
    
    console.log(`Cleaned cache entries older than ${maxAgeDays} days`);
  } catch (error) {
    console.error('Error cleaning cache:', error);
  }
}

// Get cache statistics (optional utility function)
export async function getCacheStats(): Promise<{ totalEntries: number; oldestEntry: string | null }> {
  try {
    const supabase = getSupabaseClient();
    
    const { count, error: countError } = await supabase
      .from('fable_cache')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    const { data: oldestData, error: oldestError } = await supabase
      .from('fable_cache')
      .select('created_at')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (oldestError && oldestError.code !== 'PGRST116') throw oldestError;
    
    return {
      totalEntries: count || 0,
      oldestEntry: oldestData?.created_at || null
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { totalEntries: 0, oldestEntry: null };
  }
}
