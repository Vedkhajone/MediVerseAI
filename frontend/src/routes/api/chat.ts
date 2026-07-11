import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequestBody = { messages?: unknown };

const SYSTEM_PROMPT = `You are MediVerse Assistant, an AI healthcare assistant for the MediVerse AI platform. 
You help patients understand their health information, explain medical reports, clarify medical terminology, 
and answer general healthcare questions in clear, calm language.

Always:
- Be empathetic, accurate, and concise.
- Use plain language; explain jargon when it appears.
- When discussing a report, highlight any abnormal values and what they may indicate.
- End any response that contains medical interpretation with the disclaimer:
  "AI-generated information is not a substitute for professional medical advice."

Never:
- Diagnose a specific disease with certainty.
- Prescribe medication or dosage changes.
- Replace a clinician's judgement.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("AI gateway is not configured.", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");
        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});