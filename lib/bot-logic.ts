import crypto from 'crypto';
import { supabase, FacultyProfile, PendingOnboarding, MessageLog, ConversationFlow } from './supabase';
import { callClaude } from './claude';

const LANGUAGE_INSTRUCTION =
  "Detect the language of the faculty's message. If they write in Hindi, respond in Hindi. If English, respond in English. Always use simple language.";

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

// ─── Conversation state helpers ───────────────────────────────────────────────

async function getConversationFlow(phoneHash: string): Promise<ConversationFlow | null> {
  const { data } = await supabase
    .from('conversation_state')
    .select('current_flow')
    .eq('phone_hash', phoneHash)
    .single();
  return (data?.current_flow as ConversationFlow) ?? null;
}

async function setConversationFlow(phoneHash: string, flow: ConversationFlow): Promise<void> {
  await supabase
    .from('conversation_state')
    .upsert({ phone_hash: phoneHash, current_flow: flow, updated_at: new Date().toISOString() }, { onConflict: 'phone_hash' });
}

async function clearConversationFlow(phoneHash: string): Promise<void> {
  await supabase.from('conversation_state').delete().eq('phone_hash', phoneHash);
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

async function handleOnboarding(phoneHash: string, body: string): Promise<string> {
  const { data: pending } = await supabase
    .from('pending_onboarding')
    .select('*')
    .eq('phone_hash', phoneHash)
    .single<PendingOnboarding>();

  if (!pending) {
    await supabase.from('pending_onboarding').insert({ phone_hash: phoneHash, step: 1, temp_data: {} });
    return buildTwiML(
      "Welcome to FacultyMitra! 🎓\n\nI'm your AI teaching assistant. Let's get you set up.\n\nWhat's your name?"
    );
  }

  const { step, temp_data } = pending;

  if (step === 1) {
    await supabase
      .from('pending_onboarding')
      .update({ step: 2, temp_data: { ...temp_data, name: body.trim() } })
      .eq('phone_hash', phoneHash);
    return buildTwiML(`Nice to meet you, ${body.trim()}! 👋\n\nWhich college do you teach at?`);
  }

  if (step === 2) {
    await supabase
      .from('pending_onboarding')
      .update({ step: 3, temp_data: { ...temp_data, college: body.trim() } })
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

// ─── Flow runners (call Claude, log, return TwiML) ────────────────────────────

async function runAuditAnalysis(faculty: FacultyProfile, body: string): Promise<string> {
  const systemPrompt = `You are FacultyMitra, an AI teaching assistant for Indian college faculty. Analyze this syllabus and return a WhatsApp-friendly response (no markdown, use emojis) with: 1) Overall relevance score out of 100, 2) Unit-by-unit verdict using ✅ Keep, ⚠️ Update, or ❌ Remove, 3) Specific replacement suggestions. Keep it concise for mobile reading. End with: Reply ASSIGN to generate a practical assignment. ${LANGUAGE_INSTRUCTION}`;
  const reply = await callClaude(systemPrompt, body);
  await logMessage({ faculty_id: faculty.id, intent: 'AUDIT', input_text: body, response_text: reply });
  return buildTwiML(reply);
}

async function runAssignGeneration(faculty: FacultyProfile, body: string): Promise<string> {
  const systemPrompt = `You are FacultyMitra. Generate a practical, real-world project-based assignment for Indian college students. Reference real Indian companies (Swiggy, UPI, Zomato, Flipkart). Include: project title, objective, 3-4 tasks, evaluation rubric, hints. Format for WhatsApp (no markdown, use emojis, keep concise). ${LANGUAGE_INSTRUCTION}`;
  const reply = await callClaude(systemPrompt, body);
  await logMessage({ faculty_id: faculty.id, intent: 'ASSIGN', input_text: body, response_text: reply });
  return buildTwiML(reply);
}

async function runTopicCheck(faculty: FacultyProfile, body: string): Promise<string> {
  const systemPrompt = `You are FacultyMitra. A college faculty is asking if a topic is worth teaching in 2026. Give: 1) Verdict: TEACH / SKIP / PARTIAL with emoji, 2) Why in 2 lines, 3) Real Indian industry use cases, 4) If TEACH or PARTIAL: a 3-point teach-it-in-1-class guide. Format for WhatsApp. Be direct and practical. ${LANGUAGE_INSTRUCTION}`;
  const reply = await callClaude(systemPrompt, body);
  await logMessage({ faculty_id: faculty.id, intent: 'TOPIC', input_text: body, response_text: reply });
  return buildTwiML(reply);
}

// ─── Intent handlers (first message — keyword only) ──────────────────────────

async function handleAudit(faculty: FacultyProfile, phoneHash: string, body: string): Promise<string> {
  if (body.trim().toLowerCase() === 'audit') {
    await setConversationFlow(phoneHash, 'awaiting_audit');
    return buildTwiML(
      "Please paste your syllabus below and I'll analyze it for you! 📄\n\n(You can paste the full syllabus text in your next message)"
    );
  }
  // keyword + content in one message — process directly
  if (body.trim().length > 100) {
    return runAuditAnalysis(faculty, body);
  }
  await setConversationFlow(phoneHash, 'awaiting_audit');
  return buildTwiML(
    "Please paste your full syllabus text in the next message so I can analyze it properly. 📋"
  );
}

async function handleAssign(faculty: FacultyProfile, phoneHash: string, body: string): Promise<string> {
  if (body.trim().toLowerCase() === 'assign') {
    await setConversationFlow(phoneHash, 'awaiting_assign');
    return buildTwiML('Which subject and semester? ✍️\n\n(e.g. SQL, BCA 3rd sem)');
  }
  // keyword + detail in one message — process directly
  return runAssignGeneration(faculty, body);
}

async function handleTopic(faculty: FacultyProfile, phoneHash: string, body: string): Promise<string> {
  if (body.trim().toLowerCase() === 'topic') {
    await setConversationFlow(phoneHash, 'awaiting_topic');
    return buildTwiML('Which topic do you want to check? 🔍\n\n(e.g. Is blockchain worth teaching?)');
  }
  // keyword + topic in one message — process directly
  return runTopicCheck(faculty, body);
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export async function processMessage(from: string, body: string, hasMedia: boolean): Promise<string> {
  const phoneHash = hashPhone(from);

  const { data: faculty } = await supabase
    .from('faculty_profiles')
    .select('*')
    .eq('phone_hash', phoneHash)
    .single<FacultyProfile>();

  if (!faculty) {
    return handleOnboarding(phoneHash, body);
  }

  // ── Check conversation state BEFORE intent detection ──
  const currentFlow = await getConversationFlow(phoneHash);

  if (currentFlow === 'awaiting_audit') {
    if (hasMedia || !body.trim()) {
      // keep state active, ask them to use text instead
      return buildTwiML(
        "Please paste your syllabus as text in the next message (don't send a file 📄)"
      );
    }
    await clearConversationFlow(phoneHash);
    const response = await runAuditAnalysis(faculty, body);
    await updateFacultyStats(faculty);
    return response;
  }

  if (currentFlow === 'awaiting_assign') {
    await clearConversationFlow(phoneHash);
    const response = await runAssignGeneration(faculty, body);
    await updateFacultyStats(faculty);
    return response;
  }

  if (currentFlow === 'awaiting_topic') {
    await clearConversationFlow(phoneHash);
    const response = await runTopicCheck(faculty, body);
    await updateFacultyStats(faculty);
    return response;
  }

  // ── No active flow — detect intent from keywords ──
  const trimmed = body.trim();
  const upper = trimmed.toUpperCase();

  let response: string;

  if (upper.includes('AUDIT')) {
    response = await handleAudit(faculty, phoneHash, trimmed);
  } else if (upper.includes('ASSIGN')) {
    response = await handleAssign(faculty, phoneHash, trimmed);
  } else if (upper.includes('TOPIC')) {
    response = await handleTopic(faculty, phoneHash, trimmed);
  } else {
    response = buildTwiML(helpMessage(faculty.name));
  }

  await updateFacultyStats(faculty);
  return response;
}

async function updateFacultyStats(faculty: FacultyProfile): Promise<void> {
  await supabase
    .from('faculty_profiles')
    .update({ last_active: new Date().toISOString(), message_count: (faculty.message_count || 0) + 1 })
    .eq('id', faculty.id);
}
