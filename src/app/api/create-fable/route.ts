import { NextRequest, NextResponse } from 'next/server';
import { generateCacheKey, getCachedFable, storeFableInCache } from './supabase-cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modelledMode, animal1, animal2, setting, moral } = body;

    // Validate required fields
    if (!animal1 || !animal2 || !setting || !moral) {
      return NextResponse.json(
        { error: 'Missing required fields: animal1, animal2, setting, and moral are required' },
        { status: 400 }
      );
    }

    // Generate cache key and check for cached fable
    const cacheKey = generateCacheKey({ animal1, animal2, setting, moral, modelledMode });
    const cachedFable = await getCachedFable(cacheKey);
    
    if (cachedFable) {
      console.log('Returning cached fable for key:', cacheKey);
      return NextResponse.json({ fable: cachedFable, cached: true });
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OpenAI API key not found, using fallback generator');
      const fable = generateFable(animal1, animal2, setting, moral, modelledMode);
      // Store fallback fable in cache
      await storeFableInCache(cacheKey, fable, { animal1, animal2, setting, moral, modelledMode });
      return NextResponse.json({ fable, cached: false });
    }

    // Create the fable prompt
    const isModelled = modelledMode.includes('misspell') || modelledMode.includes('grammatical errors');
    const styleInstruction = isModelled 
      ? "Use vocabulary suitable for 11 year olds. Include 2 or 3 spelling and grammatical errors per paragraph."
      : "Use vocabulary suitable for 11 year olds with good grammar and readability.";

    const prompt = `Write a short fable (2-3 paragraphs) with:
- Characters: ${animal1} and ${animal2}
- Setting: ${setting}
- Lesson: ${moral}
- Style: ${styleInstruction}

Keep it concise. End with "Moral: ${moral}"`;

    // OpenAI API call
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative storyteller who writes brief, engaging fables for children. Keep stories short and focused on the moral lesson. Favour english over american spelling and good grammar.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 400
      })
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', openaiResponse.status, await openaiResponse.text());
      // Fallback to template-based generation
      const fable = generateFable(animal1, animal2, setting, moral, modelledMode);
      // Store fallback fable in cache
      await storeFableInCache(cacheKey, fable, { animal1, animal2, setting, moral, modelledMode });
      return NextResponse.json({ fable, cached: false });
    }
    
    console.log('OpenAI API response status:', openaiResponse.status);
    const openaiResult = await openaiResponse.json();
    const fable = openaiResult.choices[0].message.content;

    // Store the OpenAI-generated fable in cache
    await storeFableInCache(cacheKey, fable, { animal1, animal2, setting, moral, modelledMode });

    return NextResponse.json({ fable, cached: false });
  } catch (error) {
    console.error('Error creating fable:', error);
    // Fallback to template-based generation
    const body = await request.json();
    const { modelledMode, animal1, animal2, setting, moral } = body;
    const fable = generateFable(animal1, animal2, setting, moral, modelledMode);
    
    // Try to cache the fallback fable (with error handling)
    try {
      const cacheKey = generateCacheKey({ animal1, animal2, setting, moral, modelledMode });
      await storeFableInCache(cacheKey, fable, { animal1, animal2, setting, moral, modelledMode });
    } catch (cacheError) {
      console.error('Error caching fallback fable:', cacheError);
    }
    
    return NextResponse.json({ fable, cached: false });
  }
}

function generateFable(animal1: string, animal2: string, setting: string, moral: string, modelledMode: string): string {
  const isModelled = modelledMode.includes('misspell') || modelledMode.includes('grammatical errors');
  
  if (isModelled) {
    // Simplified version with some intentional errors for modelled writing
    return `A ${animal1.toLowerCase()} and ${animal2.toLowerCase()} lived in a ${setting.toLowerCase()}. The ${animal1.toLowerCase()} was proud and wouldn't help the ${animal2.toLowerCase()}.

Later, the ${animal1.toLowerCase()} needed help and only the ${animal2.toLowerCase()} was there. The ${animal2.toLowerCase()} helped anyway, even tho the ${animal1.toLowerCase()} had been mean.

Moral: ${moral}`;
  } else {
    // Concise version with good language
    return `In a ${setting.toLowerCase()}, a proud ${animal1.toLowerCase()} refused to help a small ${animal2.toLowerCase()}. When the ${animal1.toLowerCase()} later found himself in trouble, only the ${animal2.toLowerCase()} was nearby to help.

Despite being treated poorly before, the ${animal2.toLowerCase()} chose to help. The ${animal1.toLowerCase()} learned an important lesson about kindness and respect.

Moral: ${moral}`;
  }
}
