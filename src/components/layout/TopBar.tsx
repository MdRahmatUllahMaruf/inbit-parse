import { FileText, Download, Share2, RotateCcw, MessageSquare, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface TopBarProps {
  title?: string;
  status?: string;
  onChatToggle?: () => void;
  isWorkspace?: boolean;
}

export function TopBar({ title, status, onChatToggle, isWorkspace }: TopBarProps) {
  const statusVariant =
    status === "parsed" || status === "entities_ready" ? ("default" as const) : ("secondary" as const);

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground">
            InBit <span className="text-primary">Parse</span>
          </span>
        </Link>
        {isWorkspace && title && (
          <>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm text-foreground font-medium truncate max-w-[300px]">{title}</span>
            {status && (
              <Badge variant={statusVariant} className="text-[10px]">
                {status.replace("_", " ")}
              </Badge>
            )}
          </>
        )}
      </div>
      {isWorkspace && (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onChatToggle}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <div className="ml-2 hidden md:flex items-center gap-1 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
            <Keyboard className="w-3 h-3" /> ⌘K
          </div>
        </div>
      )}
    </header>
  );
}
