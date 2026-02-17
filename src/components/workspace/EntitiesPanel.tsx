import { useState } from "react";
import { Sparkles, Check, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { dummyEntities } from "@/data/dummy";
import type { Entity } from "@/data/dummy";

export function EntitiesPanel() {
  const { setSelectedBlockId, setCurrentPage } = useWorkspace();
  const [phase, setPhase] = useState<"idle" | "extracting" | "done">("idle");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExtract = () => {
    setShowConfirm(false);
    setPhase("extracting");
    setTimeout(() => {
      setEntities(dummyEntities);
      setPhase("done");
    }, 2000);
  };

  const updateStatus = (id: string, status: Entity["status"]) => {
    setEntities((prev) => prev.map((e) => (e.entityId === id ? { ...e, status } : e)));
  };

  const grouped = entities.reduce(
    (acc, e) => {
      (acc[e.type] = acc[e.type] || []).push(e);
      return acc;
    },
    {} as Record<string, Entity[]>
  );

  if (phase === "idle") {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Extract Entities</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Run entity extraction to identify people, organizations, amounts, and more from this document.
          </p>
          <Button onClick={() => setShowConfirm(true)}>
            <Sparkles className="w-4 h-4 mr-2" /> Extract Entities
          </Button>

          <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ready to extract?</DialogTitle>
                <DialogDescription>
                  Have you reviewed the extracted markdown, tables, and images? Entity extraction works best after
                  reviewing the parsed content.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirm(false)}>
                  Go back and review
                </Button>
                <Button onClick={handleExtract}>Yes, extract entities</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  if (phase === "extracting") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Extracting entities…</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{entities.length} entities found</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setEntities((prev) => prev.map((e) => (e.confidence >= 0.85 ? { ...e, status: "accepted" } : e)))
              }
            >
              Accept all &gt; 85%
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-3 h-3 mr-1" /> Export
            </Button>
          </div>
        </div>

        {Object.entries(grouped).map(([type, items]) => (
          <div key={type}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{type}</h4>
            <div className="space-y-1">
              {items.map((entity) => (
                <div
                  key={entity.entityId}
                  className="flex items-center gap-3 p-2 rounded-md border border-border hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedBlockId(entity.evidence.blockId);
                    setCurrentPage(entity.evidence.page);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">{entity.value}</span>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">"{entity.evidence.snippet}"</p>
                  </div>
                  <Badge
                    variant={
                      entity.confidence >= 0.85
                        ? "default"
                        : entity.confidence >= 0.6
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-[10px] shrink-0"
                  >
                    {Math.round(entity.confidence * 100)}%
                  </Badge>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {entity.status === "pending" ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-primary hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(entity.entityId, "accepted");
                          }}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(entity.entityId, "rejected");
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Badge variant={entity.status === "accepted" ? "default" : "destructive"} className="text-[10px]">
                        {entity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
