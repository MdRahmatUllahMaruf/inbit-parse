import { MessageSquare, ZoomIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import type { ExtractedImage } from "@/data/dummy";

interface ImagesPanelProps {
  images: ExtractedImage[];
}

export function ImagesPanel({ images }: ImagesPanelProps) {
  const { setSelectedBlockId, setCurrentPage, selectedBlockId } = useWorkspace();

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground">{images.length} images extracted</p>
        {images.map((img) => (
          <Card
            key={img.imageId}
            className={`cursor-pointer transition-all ${
              selectedBlockId === img.imageId ? "border-primary shadow-sm" : "hover:border-muted-foreground/20"
            }`}
            onClick={() => {
              setSelectedBlockId(img.imageId);
              setCurrentPage(img.page);
            }}
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div
                  className="w-24 h-20 rounded-md flex items-center justify-center border border-border shrink-0"
                  style={{ backgroundColor: img.thumbnailColor }}
                >
                  <ZoomIn className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground mb-1 font-medium">Page {img.page}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{img.llmExplanation}</p>
                  <div className="flex flex-wrap gap-1">
                    {img.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Button variant="ghost" size="sm" className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" /> Ask about this
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
