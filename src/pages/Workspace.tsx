import { useState } from "react";
import { useParams } from "react-router-dom";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { TopBar } from "@/components/layout/TopBar";
import { DocumentViewer } from "@/components/workspace/DocumentViewer";
import { MarkdownPanel } from "@/components/workspace/MarkdownPanel";
import { TablesPanel } from "@/components/workspace/TablesPanel";
import { ImagesPanel } from "@/components/workspace/ImagesPanel";
import { EntitiesPanel } from "@/components/workspace/EntitiesPanel";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { CommandPalette } from "@/components/CommandPalette";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { documents, markdownBlocks, extractedTables, extractedImages } from "@/data/dummy";

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const doc = documents.find((d) => d.id === id) || documents[0];
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("markdown");

  return (
    <WorkspaceProvider>
      <div className="h-screen flex flex-col bg-background">
        <TopBar title={doc.title} status={doc.status} isWorkspace onChatToggle={() => setChatOpen(!chatOpen)} />

        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={45} minSize={25}>
              <DocumentViewer pages={doc.pages} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55} minSize={30}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="px-4 pt-3 shrink-0">
                  <TabsList>
                    <TabsTrigger value="markdown">Markdown</TabsTrigger>
                    <TabsTrigger value="tables">Tables</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="entities">Entities</TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex-1 overflow-hidden">
                  <TabsContent value="markdown" className="h-full mt-0">
                    <MarkdownPanel blocks={markdownBlocks} />
                  </TabsContent>
                  <TabsContent value="tables" className="h-full mt-0">
                    <TablesPanel tables={extractedTables} />
                  </TabsContent>
                  <TabsContent value="images" className="h-full mt-0">
                    <ImagesPanel images={extractedImages} />
                  </TabsContent>
                  <TabsContent value="entities" className="h-full mt-0">
                    <EntitiesPanel />
                  </TabsContent>
                </div>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <Sheet open={chatOpen} onOpenChange={setChatOpen}>
          <SheetContent className="w-[400px] sm:w-[500px] p-0">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle className="text-sm">
                Chat — <span className="text-muted-foreground font-normal">{doc.title}</span>
              </SheetTitle>
            </SheetHeader>
            <ChatPanel />
          </SheetContent>
        </Sheet>

        <CommandPalette />
      </div>
    </WorkspaceProvider>
  );
}
