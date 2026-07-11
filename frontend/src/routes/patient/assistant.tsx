import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/patient/assistant")({ component: AssistantPage });

function AssistantPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const busy = status === "submitted" || status === "streaming";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="flex h-[calc(100vh-9rem)] flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI Health Assistant</CardTitle>
          <CardDescription>Ask about reports, terminology, and general health information.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden">
          <ScrollArea className="flex-1 rounded-lg border bg-muted/30 p-3">
            {messages.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">
                Try: "Explain HbA1c 8.5%" or "What does an elevated LDL mean?"
              </p>
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li key={m.id} className={m.role === "user" ? "flex justify-end" : "flex"}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background"}`}>
                      {m.parts.map((p, i) => (p.type === "text" ? <p key={i} className="whitespace-pre-wrap">{p.text}</p> : null))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
          <form onSubmit={submit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the assistant…"
              disabled={busy}
            />
            <Button type="submit" disabled={busy || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            AI-generated information is not a substitute for professional medical advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}