// src/env.ts

/**
 * ⚠️ Ezek csak placeholder-ek!
 * 
 * A valódi kulcsokat NEM a frontend JavaScript-ben használjuk,
 * hanem a szerveroldalon (/api/gemini) keresztül.
 * 
 * Ha valami mégis megpróbálja elérni őket, világosan jelezzük, hogy ez nem támogatott.
 */

export const API_KEY = 'YOUR_GEMINI_API_KEY_NOT_SET';
export const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_NOT_SET';

/**
 * Ellenőrzi, hogy valódi kulcs van-e beállítva frontendben.
 * 
 * Ez csak fejlesztés során figyelmeztessen, ha valamelyik service
 * próbálja használni a kulcsot frontendből.
 */
export function validateEnv() {
  if (API_KEY !== 'YOUR_GEMINI_API_KEY_NOT_SET') {
    console.warn('⚠️  A Gemini API kulcs be lett állítva frontendben!');
    console.info('Ez biztonsági kockázatot jelent. Használd a /api/gemini endpointot.');
  } else {
    console.log('✅ Gemini API kulcs helyesen NINCS beállítva frontendben');
  }

  if (YOUTUBE_API_KEY !== 'YOUR_YOUTUBE_API_KEY_NOT_SET') {
    console.warn('⚠️  A YouTube API kulcs be lett állítva frontendben!');
    console.info('Ez biztonsági kockázatot jelent. Használd a /api/youtube endpointot.');
  } else {
    console.log('✅ YouTube API kulcs helyesen NINCS beállítva frontendben');
  }
}