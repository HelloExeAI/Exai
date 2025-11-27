import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeMeetingTranscript } from '@/lib/openai';

// POST analyze transcription and generate MOM
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recordingId, transcription } = body;

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Analyze with AI
    const analysis = await analyzeMeetingTranscript(transcription);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to analyze transcript' },
        { status: 500 }
      );
    }

    // Update recording with analysis
    if (recordingId) {
      await prisma.voiceRecording.update({
        where: { id: recordingId },
        data: {
          analyzed: true,
          mom: analysis.summary,
          keyDecisions: analysis.keyDecisions,
          actionItems: analysis.actionItems,
          followUps: analysis.followUps,
          detectedPages: analysis.topics,
        },
      });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}