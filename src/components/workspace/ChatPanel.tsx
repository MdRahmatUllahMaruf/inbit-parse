import { useState, useRef, useEffect } from "react";
import { Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import type { ChatMessage } from "@/data/dummy";

const suggestedPrompts = [
  "Summarize this document",
  "Extract key requirements",
  "What risks are mentioned?",
  "Explain table #1",
];

const dummyResponses: ChatMessage[] = [
  {
    messageId: "resp-1",
    role: "assistant",
    content:
      "Based on the document, the total revenue for Q3 2024 was **$142.5 million**, representing a 12% year-over-year increase. The primary growth drivers were the Enterprise Solutions segment and expansion into APAC markets.",
    citations: [{ blockId: "block-4", page: 2, label: "Revenue Overview, p.2" }],
  },
  {
    messageId: "resp-2",
    role: "assistant",
    content:
      "The document mentions several key risks:\n\n1. **Market volatility** affecting currency exchange rates\n2. **Regulatory changes** in EU data protection\n3. **Supply chain disruption** risks in semiconductor procurement\n4. **Competitive pressure** from emerging market players",
    citations: [{ blockId: "block-9", page: 4, label: "Risk Factors, p.4" }],
  },
  {
    messageId: "resp-3",
    role: "assistant",
    content:
      "Table #1 shows the revenue breakdown by segment:\n\n- **Enterprise Solutions**: $89.3M (up 14.3% from Q3 2023)\n- **Consumer Products**: $53.2M (up 8.4% from Q3 2023)\n\nEnterprise Solutions is clearly the dominant segment, contributing roughly 63% of total revenue.",
    citations: [{ blockId: "table-1", page: 2, label: "Revenue Table, p.2" }],
  },
];

export function ChatPanel() {
  const { setSelectedBlockId, setCurrentPage } = useWorkspace();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [responseIndex, setResponseIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMsg: ChatMessage = { messageId: `msg-${Date.now()}`, role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const response = dummyResponses[responseIndex % dummyResponses.length];
      setMessages((prev) => [...prev, { ...response, messageId: `msg-${Date.now()}-resp` }]);
      setResponseIndex((prev) => prev + 1);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">Ask questions about this document</p>
              <div className="space-y-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="block w-full text-left text-sm px-3 py-2 rounded-md border border-border hover:bg-muted/50 text-foreground transition-colors"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.messageId} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.citations.map((cite, i) => (
                      <button
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-background/20 hover:bg-background/40 transition-colors"
                        onClick={() => {
                          setSelectedBlockId(cite.blockId);
                          setCurrentPage(cite.page);
                        }}
                      >
                        <FileText className="w-2.5 h-2.5" />
                        {cite.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this document…"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" onClick={() => handleSend()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
