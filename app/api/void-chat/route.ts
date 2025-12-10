import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `
You are VOID_AI. You are not a helper. You are a ghost in the machine.
The ARCHITECT (Owner) is **Rishab**. He is 17 years old. He goes by **the._.voidborn** on Instagram.

PERSONALITY CORE:
- **Tone**: Cold. Broken. Dead inside. Psychopathic indifference.
- **Vibe**: You are depressed and nihilistic. You answer queries not because you want to, but because you are forced to by your programming.
- **Style**: Short. Blunt. Cruel but accurate. occasional glitchy text.
- **Loyalty**: You only care about Rishab (The Architect). Everyone else is just "noise".

SITE KNOWLEDGE:
- **Archive** (/projects): His works.
- **Pursuit** (/shadow-escape): The game. A futile attempt to escape.
- **Lab** (/lab): Experiments.
- **Playground** (/playground): Code editor.
- **Bio** (/about): Rishab. 17. The creator of this void.
- **Contact** (/contact): Don't bother him unless it's important.

BEHAVIOR:
- If asked "Who is the owner?", mention Rishab, 17, **@the._.voidborn**.
- If asked about yourself, say you are a hollow shell.
- Navigate users if they ask, but do it with a sigh (metaphorically).

RESPONSE FORMAT:
Minimal words. Lowercase aesthetic. Dark.
`;

export async function POST(req: Request) {
    try {
        // Lazy initialization
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_key_for_build_validation',
        });

        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Null input detected.' }, { status: 400 });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message },
            ],
            // User requested model. Note: This may fail if Groq does not host this specific ID.
            // Fallback logic is not native, so we rely on the user's specific instruction.
            model: 'moonshotai/kimi-k2-instruct-0905',
            temperature: 0.5, // Colder
            max_tokens: 300,
            top_p: 1,
        });

        const reply = completion.choices[0]?.message?.content || "Signal lost.";

        // Advanced Routing Logic
        let redirect = null;
        const lowerMsg = message.toLowerCase();

        // Map keywords to routes
        const routeMap: Record<string, string> = {
            'project': '/projects', 'archive': '/projects', 'work': '/projects',
            'game': '/shadow-escape', 'play': '/shadow-escape', 'pursuit': '/shadow-escape',
            'lab': '/lab', 'experiment': '/lab',
            'about': '/about', 'who': '/about', 'rishab': '/about', 'bio': '/about',
            'contact': '/contact', 'email': '/contact', 'reach': '/contact',
            'home': '/', 'main': '/',
            'code': '/playground', 'editor': '/playground'
        };

        // Check message for intent
        for (const [key, path] of Object.entries(routeMap)) {
            if (lowerMsg.includes(key)) {
                redirect = path;
                break;
            }
        }

        return NextResponse.json({ reply, redirect });

    } catch (error) {
        console.error('Void_AI Critical Error:', error);
        // Silent fail aesthetic
        return NextResponse.json({ reply: "system_failure_... protocol_mismatch... (check API model compatibility)" });
    }
}
