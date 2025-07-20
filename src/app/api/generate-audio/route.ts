import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!process.env.ELEVENLABS_API_KEY) {
    return new NextResponse('Missing ELEVENLABS_API_KEY', { status: 400 });
  }

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  try {
    const audio = await elevenlabs.textToSpeech.convert(
      '21m00Tcm4TlvDq8ikWAM',
      {
        text,
        modelId: 'eleven_multilingual_v2',
      }
    );

    return new NextResponse(audio as BodyInit, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Error generating audio', { status: 500 });
  }
} 
