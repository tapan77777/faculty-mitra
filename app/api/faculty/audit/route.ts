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

    if (!phoneHash) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const faculty = await getFacultyByPhoneHash(phoneHash);
    if (!faculty) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
    }

    const body = await request.json();
    const { syllabus, subject, semester } = body as {
      syllabus: string;
      subject?: string;
      semester?: string;
    };

    if (!syllabus?.trim()) {
      return NextResponse.json({ error: 'Syllabus content is required' }, { status: 400 });
    }

    const subjectCtx = subject?.trim() || faculty.subject || 'the subject';
    const collegeCtx = faculty.college || 'college level';

    const systemPrompt = `You are FacultyMitra analyzing a syllabus for ${subjectCtx} at ${collegeCtx} level.
Return ONLY valid JSON in this exact structure:
{
  "overall_score": <0-100>,
  "verdict": "<one line summary>",
  "units": [
    {
      "name": "<unit name>",
      "status": "KEEP|UPDATE|REMOVE",
      "reasoning": "<2-3 lines why>",
      "suggestion": "<what to replace with or how to update>"
    }
  ],
  "trending_skills_missing": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "outdated_topics": ["<topic 1>", "<topic 2>"]
}

Reference real Indian industry context (TCS, Infosys, Flipkart, Swiggy, UPI, etc).
Be honest and specific. No markdown in JSON values.`;

    const userMessage = semester?.trim()
      ? `Analyze this syllabus for ${semester}:\n\n${syllabus}`
      : `Analyze this syllabus:\n\n${syllabus}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
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
      return NextResponse.json(
        { error: 'AI returned invalid JSON. Please try again.' },
        { status: 500 }
      );
    }

    const storedResult = {
      subject: subject?.trim() || faculty.subject || '',
      semester: semester?.trim() || '',
      ...(result as object),
    };

    await supabase.from('message_logs').insert({
      faculty_id: faculty.id,
      intent: 'AUDIT_WEB',
      input_text: syllabus,
      response_text: JSON.stringify(storedResult),
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Audit route error:', err);
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
