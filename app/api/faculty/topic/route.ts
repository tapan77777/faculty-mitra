import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const phoneHash = cookieStore.get('faculty_session')?.value;

    if (!phoneHash) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const faculty = await getFacultyByPhoneHash(phoneHash);
    if (!faculty) return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });

    const body = await request.json();
    const { topic, subject } = body as { topic: string; subject?: string };

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const subjectCtx = subject?.trim() || faculty.subject || 'computer science';

    const systemPrompt = `You are FacultyMitra evaluating if a topic is worth teaching to Indian college students in 2026. Topic: ${topic}. Subject: ${subjectCtx}.

Return ONLY valid JSON:
{
  "verdict": "TEACH|SKIP|PARTIAL",
  "why": "<2-3 lines reasoning>",
  "use_cases": [
    {"sector": "<sector>", "company": "<Indian company>", "use": "<2 lines>"}
  ],
  "teach_guide": [
    {"hour": 1, "title": "<title>", "content": "<3 lines>"}
  ],
  "careers": [
    {"role": "<job role>", "salary": "<LPA range>", "companies": "<companies>"}
  ]
}

Be honest. Reference real Indian companies and salary data.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Should I teach "${topic}" to my students?` }],
    });

    const block = response.content[0];
    if (block.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected AI response type' }, { status: 500 });
    }

    let rawText = block.text.trim();
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let result: unknown;
    try {
      result = JSON.parse(rawText);
    } catch {
      console.error('Topic JSON parse failed. Raw Claude response:\n', rawText);
      return NextResponse.json({ error: 'AI returned invalid JSON. Please try again.' }, { status: 500 });
    }

    const storedResult = {
      topic: topic.trim(),
      subject: subject?.trim() || faculty.subject || '',
      ...(result as object),
    };

    await supabase.from('message_logs').insert({
      faculty_id: faculty.id,
      intent: 'TOPIC_WEB',
      input_text: topic.trim(),
      response_text: JSON.stringify(storedResult),
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Topic route error:', err);
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
