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
    const { subject, semester, topic, difficulty, hours } = body as {
      subject?: string;
      semester?: string;
      topic: string;
      difficulty: string;
      hours: string;
    };

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const subjectCtx = subject?.trim() || faculty.subject || 'the subject';
    const collegeCtx = faculty.college || 'college level';

    const systemPrompt = `You are FacultyMitra generating a practical assignment for ${subjectCtx} at ${collegeCtx} level. Topic: ${topic}. Difficulty: ${difficulty}. Hours: ${hours}.

Return ONLY valid JSON in this structure:
{
  "title": "<project title>",
  "overview": "<2-3 line summary>",
  "objectives": ["<obj 1>", "<obj 2>", "<obj 3>"],
  "tasks": [
    {"number": 1, "title": "<task name>", "description": "<2 lines>"}
  ],
  "rubric": [
    {"criteria": "<name>", "marks": <number>, "description": "<short>"}
  ],
  "hints": ["<hint 1>", "<hint 2>"],
  "industry_context": "<2-3 lines about which Indian companies use this>"
}

Reference real Indian companies (Swiggy, UPI, Flipkart, Zomato, Paytm).
Be practical, project-based, real-world. No markdown.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2500,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Generate a ${difficulty} level assignment on "${topic}" for ${hours} hours.` }],
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
      return NextResponse.json({ error: 'AI returned invalid JSON. Please try again.' }, { status: 500 });
    }

    const storedResult = {
      subject: subject?.trim() || faculty.subject || '',
      semester: semester?.trim() || '',
      topic: topic.trim(),
      difficulty,
      hours,
      ...(result as object),
    };

    await supabase.from('message_logs').insert({
      faculty_id: faculty.id,
      intent: 'ASSIGN_WEB',
      input_text: topic.trim(),
      response_text: JSON.stringify(storedResult),
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Assign route error:', err);
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
  }
}
