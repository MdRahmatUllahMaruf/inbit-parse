import { useState } from "react";
import { Table2, Copy, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { toast } from "sonner";
import type { ExtractedTable } from "@/data/dummy";

interface TablesPanelProps {
  tables: ExtractedTable[];
}

export function TablesPanel({ tables }: TablesPanelProps) {
  const { setSelectedBlockId, setCurrentPage, selectedBlockId } = useWorkspace();
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground">{tables.length} tables detected</p>
        {tables.map((table) => (
          <Card
            key={table.tableId}
            className={`cursor-pointer transition-all ${
              selectedBlockId === table.tableId ? "border-primary shadow-sm" : "hover:border-muted-foreground/20"
            }`}
            onClick={() => {
              setSelectedBlockId(table.tableId);
              setCurrentPage(table.page);
              setExpandedTable(expandedTable === table.tableId ? null : table.tableId);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Table — Page {table.page}</span>
                </div>
                <Badge variant={table.confidence >= 0.85 ? "default" : "secondary"} className="text-[10px]">
                  {Math.round(table.confidence * 100)}%
                </Badge>
              </div>

              {expandedTable === table.tableId && (
                <div className="mt-3 space-y-3">
                  <div className="overflow-x-auto rounded border border-border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted">
                          {table.gridData.columns.map((col, i) => (
                            <th key={i} className="px-3 py-2 text-left font-medium text-foreground">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.gridData.rows.map((row, i) => (
                          <tr key={i} className="border-t border-border">
                            {row.map((cell, j) => (
                              <td key={j} className="px-3 py-2 text-muted-foreground">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(table.asMarkdown);
                        toast.success("Markdown copied");
                      }}
                    >
                      <Copy className="w-3 h-3 mr-1" /> Copy MD
                    </Button>
                    <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Download className="w-3 h-3 mr-1" /> CSV
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <AlertTriangle className="w-3 h-3 mr-1" /> Flag
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
