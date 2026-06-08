import { NextRequest, NextResponse } from 'next/server';
import { processMessage } from '@/lib/bot-logic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const body = (formData.get('Body') as string) ?? '';
    const from = (formData.get('From') as string) ?? '';
    const numMedia = parseInt((formData.get('NumMedia') as string) ?? '0', 10);
    const hasMedia = numMedia > 0;

    if (!from) {
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Message>Invalid request.</Message></Response>',
        { status: 400, headers: { 'Content-Type': 'text/xml' } }
      );
    }

    const twiml = await processMessage(from, body, hasMedia);
    return new NextResponse(twiml, { status: 200, headers: { 'Content-Type': 'text/xml' } });
  } catch (err) {
    console.error('Webhook error:', err);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response><Message>Something went wrong. Please try again.</Message></Response>',
      { status: 500, headers: { 'Content-Type': 'text/xml' } }
    );
  }
}
