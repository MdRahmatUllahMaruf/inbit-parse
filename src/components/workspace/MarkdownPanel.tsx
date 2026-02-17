import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Flag, Code, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { toast } from "sonner";
import type { MarkdownBlock } from "@/data/dummy";

interface MarkdownPanelProps {
  blocks: MarkdownBlock[];
}

export function MarkdownPanel({ blocks }: MarkdownPanelProps) {
  const { selectedBlockId, setSelectedBlockId, setCurrentPage } = useWorkspace();
  const [viewMode, setViewMode] = useState<"rendered" | "source">("rendered");

  useEffect(() => {
    if (selectedBlockId) {
      document.getElementById(`block-${selectedBlockId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedBlockId]);

  const getConfidenceVariant = (c: number) => {
    if (c >= 0.85) return "default" as const;
    if (c >= 0.6) return "secondary" as const;
    return "destructive" as const;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <span className="text-sm text-muted-foreground">{blocks.length} blocks extracted</span>
        <div className="flex items-center gap-1">
          <Button variant={viewMode === "rendered" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("rendered")}>
            <Eye className="w-3 h-3 mr-1" /> Rendered
          </Button>
          <Button variant={viewMode === "source" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("source")}>
            <Code className="w-3 h-3 mr-1" /> Source
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {blocks.map((block) => (
            <div
              key={block.blockId}
              id={`block-${block.blockId}`}
              className={`group rounded-lg border p-3 cursor-pointer transition-all ${
                selectedBlockId === block.blockId
                  ? "border-primary bg-accent shadow-sm"
                  : "border-transparent hover:border-border hover:bg-muted/50"
              }`}
              onClick={() => {
                setSelectedBlockId(block.blockId);
                setCurrentPage(block.sourceRef.page);
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <Badge variant={getConfidenceVariant(block.confidence)} className="text-[10px] px-1.5 py-0">
                  {Math.round(block.confidence * 100)}%
                </Badge>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(block.markdown);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                    <Flag className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {viewMode === "rendered" ? (
                <div className="markdown-content text-sm text-foreground">
                  <ReactMarkdown>{block.markdown}</ReactMarkdown>
                </div>
              ) : (
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded p-2">
                  {block.markdown}
                </pre>
              )}
              <div className="mt-1 text-[10px] text-muted-foreground font-mono">
                p.{block.sourceRef.page} · {block.sourceRef.type}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
