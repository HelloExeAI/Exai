import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

// POST transcribe audio file
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // Save file temporarily
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join('/tmp', `audio-${Date.now()}.webm`);
    await writeFile(tempPath, buffer);

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: 'whisper-1',
      language: 'en',
    });

    // Save recording to database
    const recording = await prisma.voiceRecording.create({
      data: {
        userId: user.id,
        audioUrl: tempPath, // In production, upload to S3/Supabase Storage
        transcription: transcription.text,
        duration: Math.floor(audioFile.size / 16000), // Approximate duration
      },
    });

    // Clean up temp file
    await unlink(tempPath);

    return NextResponse.json({
      id: recording.id,
      transcription: transcription.text,
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}