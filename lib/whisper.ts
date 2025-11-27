import { openai } from './openai';
import fs from 'fs';

export async function transcribeAudio(audioFilePath: string): Promise<string | null> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: 'whisper-1',
      language: 'en',
    });

    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return null;
  }
}