import { useMemo } from "react";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { markdownBlocks, extractedTables, extractedImages } from "@/data/dummy";
import type { PageData } from "@/data/dummy";

interface DocumentViewerProps {
  pages: PageData[];
}

export function DocumentViewer({ pages }: DocumentViewerProps) {
  const { currentPage, setCurrentPage, selectedBlockId, setSelectedBlockId } = useWorkspace();

  const overlays = useMemo(() => {
    const items: { id: string; bbox: [number, number, number, number]; type: string }[] = [];
    markdownBlocks
      .filter((b) => b.sourceRef.page === currentPage)
      .forEach((b) => items.push({ id: b.blockId, bbox: b.sourceRef.bbox, type: b.sourceRef.type }));
    extractedTables
      .filter((t) => t.page === currentPage)
      .forEach((t) => items.push({ id: t.tableId, bbox: t.bbox, type: "table_region" }));
    extractedImages
      .filter((img) => img.page === currentPage)
      .forEach((img) => items.push({ id: img.imageId, bbox: img.bbox, type: "image_region" }));
    return items;
  }, [currentPage]);

  const totalPages = pages.length;

  const fauxLines: Record<number, React.ReactNode> = {
    1: (
      <>
        <div className="h-6 w-3/4 bg-muted rounded" />
        <div className="h-1" />
        <div className="h-3 w-full bg-muted/60 rounded" />
        <div className="h-3 w-5/6 bg-muted/60 rounded" />
        <div className="h-3 w-full bg-muted/60 rounded" />
        <div className="h-3 w-2/3 bg-muted/60 rounded" />
        <div className="h-6" />
        <div className="h-5 w-1/2 bg-muted rounded" />
        <div className="h-3 w-full bg-muted/60 rounded" />
        <div className="h-3 w-4/5 bg-muted/60 rounded" />
      </>
    ),
    2: (
      <>
        <div className="h-3 w-full bg-muted/60 rounded" />
        <div className="h-3 w-5/6 bg-muted/60 rounded" />
        <div className="h-3 w-full bg-muted/60 rounded" />
        <div className="h-3 w-3/4 bg-muted/60 rounded" />
        <div className="h-4" />
        <div className="h-20 w-full bg-muted/40 rounded border border-border" />
        <div className="h-4" />
        <div className="h-24 w-4/5 mx-auto bg-muted/30 rounded border border-border" />
      </>
    ),
    3: (
      <>
        <div className="h-5 w-2/5 bg-muted rounded" />
        <div className="h-1" />
        <div className="h-3 w-full bg-muted/60 rounded" />
        <div className="h-3 w-5/6 bg-muted/60 rounded" />
        <div className="h-3 w-full bg-muted/60 rounded" />
        <div className="h-4" />
        <div className="h-16 w-full bg-muted/40 rounded border border-border" />
      </>
    ),
    4: (
      <>
        <div className="h-5 w-1/3 bg-muted rounded" />
        <div className="h-1" />
        <div className="h-3 w-full bg-muted/60 rounded" />
        <div className="h-3 w-4/5 bg-muted/60 rounded" />
        <div className="h-3 w-full bg-muted/60 rounded" />
        <div className="h-3 w-2/3 bg-muted/60 rounded" />
        <div className="h-6" />
        <div className="h-28 w-3/5 mx-auto bg-muted/30 rounded border border-border" />
      </>
    ),
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground font-mono min-w-[80px] text-center">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <div className="relative bg-card rounded-lg shadow-lg w-full max-w-[560px] aspect-[3/4] border border-border">
          <div className="p-8 space-y-2">{fauxLines[currentPage] || <div className="h-3 w-full bg-muted/60 rounded" />}</div>

          {overlays.map((overlay) => (
            <motion.div
              key={overlay.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute rounded cursor-pointer transition-colors ${
                selectedBlockId === overlay.id
                  ? "border-2 border-primary bg-primary/15 animate-highlight-pulse"
                  : "border border-primary/25 bg-primary/5 hover:bg-primary/10 hover:border-primary/50"
              }`}
              style={{
                left: `${overlay.bbox[0]}%`,
                top: `${overlay.bbox[1]}%`,
                width: `${overlay.bbox[2]}%`,
                height: `${overlay.bbox[3]}%`,
              }}
              onClick={() => setSelectedBlockId(overlay.id)}
            />
          ))}

          <div className="absolute bottom-3 right-4 text-[10px] text-muted-foreground font-mono">
            Page {currentPage}
          </div>
        </div>
      </div>
    </div>
  );
}
