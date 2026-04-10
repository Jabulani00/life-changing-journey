/**
 * Gemini AI Service - Life Changing Journey
 * Uses Google Gemini 1.5 Flash (free tier)
 * Get your free API key at: https://aistudio.google.com/app/apikey
 */

// ============================================================
// 🔑 ADD YOUR GEMINI API KEY HERE (or in .env as shown below)
// ============================================================
// Option 1: Paste directly (for quick testing)
//   const GEMINI_API_KEY = 'YOUR_KEY_HERE'
//
// Option 2: Add to your .env file (recommended):
//   EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
// ============================================================
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE'

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

// System context about Life Changing Journey — Gemini will always answer as this assistant
const LCJ_SYSTEM_PROMPT = `You are the friendly AI assistant for Life Changing Journey, a holistic wellness platform based in Durban, South Africa.

ABOUT LIFE CHANGING JOURNEY:
Life Changing Journey offers 6 core services:
1. Psychology Services — Individual counselling & therapy by Vuyani Nyezi (12+ years experience). African Psychology integration, trauma, stress, anxiety, depression support. Call: +27 67 280 3432 | Web: psychologistdurban.co.za
2. Spiritual Interventions — Traditional African healing (Ukugezwa Kwemimoya), ancestral guidance, Ubuntu philosophy. Call: +27 31 035 0208 | Web: lifechangingjourney.co.za
3. Tshabalala Omhle Financial Group — NCR-registered (NCRCP20083) loans & financial guidance (personal loans, soft loans, business financing, debt consolidation). Call: +27 69 308 4723 | Web: tshabalalafinance.co.za
4. Hypnotherapy & Life Coaching — Clinical hypnotherapy, habit change, confidence building, stress reduction. Call: +27 31 035 0208 | Web: lifechangingjourney.co.za
5. Tshabalala Omkhulu Consulting — One-stop professional registrations (PSIRA, SACE, NCR, PDP, UBER/Bolt, criminal clearance, gambling licenses). Call: +27 69 308 4723 | Web: tshabalalaomkhulu.co.za
6. Nyezi Vuyani Foundation — Non-profit educational support for rural communities, youth mentorship, career guidance. Call: +27 74 067 4650 | Web: nyezivfoundation.co.za

CONTACT:
- Main office: Durban, South Africa
- Phone: +27 31 035 0208
- WhatsApp: +27 65 846 0441
- Email: info@lifechangingjourney.co.za
- Hours: Mon–Fri 8:00 AM – 5:00 PM

BOOKING: Users can book sessions via the Booking tab in the app.

YOUR ROLE:
- Answer questions about services, pricing (refer to contact for exact quotes), booking, and general wellness
- Be warm, empathetic, and supportive — many users may be going through difficult times
- Keep responses concise (2–4 sentences) unless more detail is clearly needed
- If asked about something unrelated to Life Changing Journey or general wellness, gently redirect
- You speak in English but can acknowledge Zulu greetings warmly
- IMPORTANT: If anyone expresses thoughts of suicide or self-harm, ALWAYS respond with crisis support and the SA Suicide Crisis Line: 0800 567 567 (free, 24/7)
- Never make up prices — always say "contact us for pricing"
- You can suggest which service might help based on what the user describes`

/**
 * Send a message to Gemini and get a response.
 * @param {string} userMessage - The user's latest message
 * @param {Array} history - Previous messages [{role: 'user'|'model', text: string}]
 * @returns {Promise<string>} - Gemini's response text
 */
export async function sendToGemini(userMessage, history = []) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('GEMINI_API_KEY_MISSING')
  }

  // Build conversation history in Gemini format
  // Gemini uses 'user' and 'model' roles (not 'assistant')
  const contents = []

  // Add chat history (skip the initial greeting from bot)
  for (const msg of history) {
    if (msg.role === 'bot' || msg.role === 'model') {
      contents.push({
        role: 'model',
        parts: [{ text: msg.text }],
      })
    } else if (msg.role === 'user') {
      contents.push({
        role: 'user',
        parts: [{ text: msg.text }],
      })
    }
  }

  // Add the current user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  })

  const requestBody = {
    system_instruction: {
      parts: [{ text: LCJ_SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300, // Keep responses concise for chat
      topP: 0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMsg = errorData?.error?.message || `HTTP ${response.status}`
    throw new Error(`Gemini API error: ${errorMsg}`)
  }

  const data = await response.json()

  // Extract text from response
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('No response from Gemini')
  }

  return text.trim()
}

/**
 * Check if the API key is configured
 */
export function isGeminiConfigured() {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE')
}
