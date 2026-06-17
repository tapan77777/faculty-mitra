import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFacultyByPhoneHash } from '@/lib/faculty-data';
import { generateAuditPdf } from '@/lib/audit-pdf';
import type { AuditResult } from '@/app/faculty/(dashboard)/audit/AuditClient';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const phoneHash = cookieStore.get('faculty_session')?.value;

    const faculty = phoneHash ? await getFacultyByPhoneHash(phoneHash) : null;

    const body = await request.json();
    const { result, subject, semester } = body as {
      result: AuditResult;
      subject?: string;
      semester?: string;
    };

    if (!result) {
      return NextResponse.json({ error: 'Audit result is required' }, { status: 400 });
    }

    const pdfBuffer = await generateAuditPdf(
      result,
      faculty,
      subject ?? '',
      semester ?? ''
    );

    const subjectSlug = (subject || 'syllabus').toLowerCase().replace(/\s+/g, '-');
    const filename = `audit-${subjectSlug}-${Date.now()}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error('PDF route error:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
