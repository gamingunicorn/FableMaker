import { NextRequest, NextResponse } from 'next/server';
import { getCacheStats, cleanOldCache } from '../create-fable/supabase-cache';

export async function GET(request: NextRequest) {
  try {
    const stats = await getCacheStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { error: 'Failed to get cache statistics' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const maxAgeDays = parseInt(url.searchParams.get('maxAge') || '30');
    
    await cleanOldCache(maxAgeDays);
    
    return NextResponse.json({ 
      message: `Successfully cleaned cache entries older than ${maxAgeDays} days` 
    });
  } catch (error) {
    console.error('Error cleaning cache:', error);
    return NextResponse.json(
      { error: 'Failed to clean cache' },
      { status: 500 }
    );
  }
}
