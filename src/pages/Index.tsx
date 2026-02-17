import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, FileText, Image, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CommandPalette } from "@/components/CommandPalette";
import { documents } from "@/data/dummy";

const statusStyles: Record<string, string> = {
  uploaded: "border-muted-foreground/30 text-muted-foreground",
  parsing: "border-primary/40 text-primary",
  parsed: "border-primary text-primary",
  entities_ready: "bg-primary text-primary-foreground",
  failed: "border-destructive/40 text-destructive",
};

export default function Index() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filtered = documents.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                InBit <span className="text-primary">Parse</span>
              </h1>
              <p className="text-sm text-muted-foreground">Document Extraction Workspace</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents… (⌘K)"
                className="pl-10"
              />
            </div>
            <Button onClick={() => navigate("/workspace/doc-1")}>
              <Plus className="w-4 h-4 mr-2" /> New Parse
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Documents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Link to={`/workspace/${doc.id}`}>
                <Card className="hover:border-primary/40 transition-colors cursor-pointer group h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center">
                        {doc.type === "pdf" ? (
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Image className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <Badge variant="outline" className={statusStyles[doc.status]}>
                        {doc.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-foreground text-sm mb-1 group-hover:text-primary transition-colors leading-snug">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Clock className="w-3 h-3" />
                      <span>{doc.updatedAt}</span>
                      <span>·</span>
                      <span>{doc.pages.length} pages</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <CommandPalette />
    </div>
  );
}
