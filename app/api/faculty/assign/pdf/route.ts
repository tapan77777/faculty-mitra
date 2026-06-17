import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';
import { generateAssignPdf } from '@/lib/assign-pdf';
import type { AssignResult } from '@/lib/assign-pdf';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const phoneHash = cookieStore.get('faculty_session')?.value;
    const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;

    const body = await request.json();
    const { result, subject, semester, topic, difficulty, hours } = body as {
      result: AssignResult;
      subject?: string;
      semester?: string;
      topic?: string;
      difficulty?: string;
      hours?: string;
    };

    if (!result) return NextResponse.json({ error: 'Result is required' }, { status: 400 });

    const pdfBuffer = await generateAssignPdf(
      result, faculty,
      subject ?? '', semester ?? '',
      topic ?? '', difficulty ?? '', hours ?? '',
    );

    const slug = (topic || 'assignment').toLowerCase().replace(/\s+/g, '-');
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="assignment-${slug}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error('Assign PDF route error:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
