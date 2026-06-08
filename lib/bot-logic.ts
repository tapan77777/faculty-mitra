import crypto from 'crypto';
import { supabase, FacultyProfile, PendingOnboarding, MessageLog } from './supabase';
import { callClaude } from './claude';

const LANGUAGE_INSTRUCTION =
  'Detect the language of the faculty\'s message. If they write in Hindi, respond in Hindi. If English, respond in English. Always use simple language.';

function hashPhone(phone: string): string {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

function buildTwiML(message: string): string {
  const escaped = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`;
}

async function logMessage(log: MessageLog): Promise<void> {
  await supabase.from('message_logs').insert(log);
}

function helpMessage(name: string): string {
  return `Hi ${name} 👋 Here's what I can do:\n\n📄 Type AUDIT → Check if your syllabus is outdated\n✍️ Type ASSIGN → Generate a practical assignment\n🔍 Type TOPIC → Check if a topic is worth teaching\n\nWhat would you like help with?`;
}

async function handleOnboarding(phoneHash: string, body: string): Promise<string> {
  const { data: pending } = await supabase
    .from('pending_onboarding')
    .select('*')
    .eq('phone_hash', phoneHash)
    .single<PendingOnboarding>();

  if (!pending) {
    await supabase.from('pending_onboarding').insert({
      phone_hash: phoneHash,
      step: 1,
      temp_data: {},
    });
    return buildTwiML(
      "Welcome to FacultyMitra! 🎓\n\nI'm your AI teaching assistant. Let's get you set up.\n\nWhat's your name?"
    );
  }

  const { step, temp_data } = pending;

  if (step === 1) {
    const updatedData = { ...temp_data, name: body.trim() };
    await supabase
      .from('pending_onboarding')
      .update({ step: 2, temp_data: updatedData })
      .eq('phone_hash', phoneHash);
    return buildTwiML(`Nice to meet you, ${body.trim()}! 👋\n\nWhich college do you teach at?`);
  }

  if (step === 2) {
    const updatedData = { ...temp_data, college: body.trim() };
    await supabase
      .from('pending_onboarding')
      .update({ step: 3, temp_data: updatedData })
      .eq('phone_hash', phoneHash);
    return buildTwiML(`Great! 🏫\n\nWhat subject do you teach?`);
  }

  if (step === 3) {
    const finalData = { ...temp_data, subject: body.trim() } as Record<string, string>;
    await supabase.from('faculty_profiles').insert({
      phone_hash: phoneHash,
      name: finalData.name,
      college: finalData.college,
      subject: finalData.subject,
      language: 'en',
      message_count: 0,
    });
    await supabase.from('pending_onboarding').delete().eq('phone_hash', phoneHash);
    return buildTwiML(
      `You're all set, ${finalData.name}! ✅\n\nYou teach ${finalData.subject} at ${finalData.college}.\n\n${helpMessage(finalData.name)}`
    );
  }

  return buildTwiML('Something went wrong. Please send any message to restart.');
}

async function handleAudit(faculty: FacultyProfile, body: string): Promise<string> {
  const lower = body.trim().toLowerCase();

  if (lower === 'audit') {
    return buildTwiML(
      'Please paste your syllabus below and I\'ll analyze it for you! 📄\n\n(You can paste the full syllabus text in your next message)'
    );
  }

  if (body.trim().length > 100) {
    const systemPrompt = `You are FacultyMitra, an AI teaching assistant for Indian college faculty. Analyze this syllabus and return a WhatsApp-friendly response (no markdown, use emojis) with: 1) Overall relevance score out of 100, 2) Unit-by-unit verdict using ✅ Keep, ⚠️ Update, or ❌ Remove, 3) Specific replacement suggestions. Keep it concise for mobile reading. End with: Reply ASSIGN to generate a practical assignment. ${LANGUAGE_INSTRUCTION}`;
    const reply = await callClaude(systemPrompt, body);
    await logMessage({ faculty_id: faculty.id, intent: 'AUDIT', input_text: body, response_text: reply });
    return buildTwiML(reply);
  }

  return buildTwiML(
    'Please paste your full syllabus text (it should be more than a few words) so I can analyze it properly. 📋'
  );
}

async function handleAssign(faculty: FacultyProfile, body: string): Promise<string> {
  const lower = body.trim().toLowerCase();

  if (lower === 'assign') {
    return buildTwiML(
      'Which subject and semester? ✍️\n\n(e.g. SQL, BCA 3rd sem)'
    );
  }

  const systemPrompt = `You are FacultyMitra. Generate a practical, real-world project-based assignment for Indian college students. Reference real Indian companies (Swiggy, UPI, Zomato, Flipkart). Include: project title, objective, 3-4 tasks, evaluation rubric, hints. Format for WhatsApp (no markdown, use emojis, keep concise). ${LANGUAGE_INSTRUCTION}`;
  const reply = await callClaude(systemPrompt, body);
  await logMessage({ faculty_id: faculty.id, intent: 'ASSIGN', input_text: body, response_text: reply });
  return buildTwiML(reply);
}

async function handleTopic(faculty: FacultyProfile, body: string): Promise<string> {
  const lower = body.trim().toLowerCase();

  if (lower === 'topic') {
    return buildTwiML(
      'Which topic do you want to check? 🔍\n\n(e.g. Is blockchain worth teaching?)'
    );
  }

  const systemPrompt = `You are FacultyMitra. A college faculty is asking if a topic is worth teaching in 2026. Give: 1) Verdict: TEACH / SKIP / PARTIAL with emoji, 2) Why in 2 lines, 3) Real Indian industry use cases, 4) If TEACH or PARTIAL: a 3-point teach-it-in-1-class guide. Format for WhatsApp. Be direct and practical. ${LANGUAGE_INSTRUCTION}`;
  const reply = await callClaude(systemPrompt, body);
  await logMessage({ faculty_id: faculty.id, intent: 'TOPIC', input_text: body, response_text: reply });
  return buildTwiML(reply);
}

export async function processMessage(from: string, body: string): Promise<string> {
  const phoneHash = hashPhone(from);

  const { data: faculty } = await supabase
    .from('faculty_profiles')
    .select('*')
    .eq('phone_hash', phoneHash)
    .single<FacultyProfile>();

  if (!faculty) {
    const { data: pending } = await supabase
      .from('pending_onboarding')
      .select('id')
      .eq('phone_hash', phoneHash)
      .single();

    if (!pending && body.trim().toLowerCase() !== 'start') {
      // treat as step 0 — kick off onboarding
    }

    return handleOnboarding(phoneHash, body);
  }

  const upper = body.trim().toUpperCase();
  const lower = body.trim().toLowerCase();

  let response: string;

  if (upper.includes('AUDIT') || lower.includes('audit')) {
    response = await handleAudit(faculty, body);
  } else if (upper.includes('ASSIGN') || lower.includes('assign')) {
    response = await handleAssign(faculty, body);
  } else if (upper.includes('TOPIC') || lower.includes('topic')) {
    response = await handleTopic(faculty, body);
  } else {
    response = buildTwiML(helpMessage(faculty.name));
  }

  await supabase
    .from('faculty_profiles')
    .update({ last_active: new Date().toISOString(), message_count: (faculty.message_count || 0) + 1 })
    .eq('id', faculty.id);

  return response;
}
