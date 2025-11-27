import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Note Parsing Function
export async function parseNoteWithAI(noteContent: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that extracts structured data from notes.
Extract:
1. People mentioned (names)
2. Dates mentioned
3. Places/locations mentioned
4. Action items/tasks
5. Follow-ups needed
6. Key topics

Return JSON format:
{
  "people": ["name1", "name2"],
  "dates": ["2024-01-15"],
  "places": ["location1"],
  "actionItems": ["task1", "task2"],
  "followUps": ["followup1"],
  "topics": ["topic1", "topic2"]
}`,
        },
        {
          role: 'user',
          content: noteContent,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('Error parsing note with AI:', error);
    return null;
  }
}

// AI Task Suggestion Function
export async function suggestTasksFromNote(noteContent: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that suggests tasks from notes.
Analyze the note and suggest actionable tasks.
Return JSON array:
[
  {
    "title": "Task title",
    "description": "Task description",
    "priority": "high|medium|low",
    "suggestedDueDate": "2024-01-15"
  }
]`,
        },
        {
          role: 'user',
          content: noteContent,
        },
      ],
      temperature: 0.5,
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '[]');
  } catch (error) {
    console.error('Error suggesting tasks:', error);
    return [];
  }
}

// AI Meeting Analysis Function
export async function analyzeMeetingTranscript(transcript: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that creates Minutes of Meeting (MOM) from transcripts.
Extract:
1. Meeting summary (2-3 sentences)
2. Key decisions made
3. Action items with responsible persons
4. Follow-ups needed
5. Important topics discussed

Return JSON:
{
  "summary": "Meeting summary",
  "keyDecisions": ["decision1", "decision2"],
  "actionItems": [{"task": "...", "assignedTo": "..."}],
  "followUps": ["followup1"],
  "topics": ["topic1", "topic2"]
}`,
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('Error analyzing meeting:', error);
    return null;
  }
}

// Daily Summary Generation
export async function generateDailySummary(data: {
  notes: string[];
  tasks: any[];
  expenses: any[];
}) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that creates daily productivity summaries.
Create a concise, executive-style summary of the day's activities.
Include:
- Key accomplishments
- Tasks completed vs pending
- Important notes
- Financial snapshot (if expenses present)
- Recommendations for tomorrow

Keep it professional and actionable.`,
        },
        {
          role: 'user',
          content: JSON.stringify(data),
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    return null;
  }
}