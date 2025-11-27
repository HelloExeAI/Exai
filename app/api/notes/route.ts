import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET notes for a specific date or all notes
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (date) {
      // Get note for specific date
      const note = await prisma.dailyNote.findUnique({
        where: {
          userId_date: {
            userId: user.id,
            date: new Date(date),
          },
        },
      });

      return NextResponse.json(note || null);
    } else {
      // Get all notes
      const notes = await prisma.dailyNote.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 30, // Last 30 days
      });

      return NextResponse.json(notes);
    }
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create or update note
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, content } = body;

    if (!date || !content) {
      return NextResponse.json(
        { error: 'Date and content are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upsert note (create or update)
    const note = await prisma.dailyNote.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: new Date(date),
        },
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        date: new Date(date),
        content,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating/updating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}