import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Image, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type ParsePhase = "upload" | "uploading" | "parsing" | "done";

const PHASE_STEPS = [
  { key: "upload", label: "Upload" },
  { key: "uploading", label: "Uploading" },
  { key: "parsing", label: "Parsing" },
  { key: "done", label: "Done" },
];

export default function NewParse() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<ParsePhase>("upload");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<"pdf" | "image">("pdf");
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const simulateParsing = useCallback(
    (name: string) => {
      setFileName(name);
      setPhase("uploading");
      setProgress(0);

      // Simulate upload
      let uploadProgress = 0;
      const uploadInterval = setInterval(() => {
        uploadProgress += Math.random() * 25 + 10;
        if (uploadProgress >= 100) {
          uploadProgress = 100;
          clearInterval(uploadInterval);
          setProgress(100);

          // Move to parsing phase
          setTimeout(() => {
            setPhase("parsing");
            setProgress(0);

            let parseProgress = 0;
            const parseInterval = setInterval(() => {
              parseProgress += Math.random() * 15 + 5;
              if (parseProgress >= 100) {
                parseProgress = 100;
                clearInterval(parseInterval);
                setProgress(100);
                setPhase("done");

                // Navigate to workspace after brief pause
                setTimeout(() => {
                  navigate("/workspace/doc-1");
                }, 800);
              }
              setProgress(Math.min(parseProgress, 100));
            }, 300);
          }, 500);
        }
        setProgress(Math.min(uploadProgress, 100));
      }, 200);
    },
    [navigate]
  );

  const handleFile = useCallback(
    (file: File) => {
      const isPdf = file.type === "application/pdf";
      const isImage = file.type.startsWith("image/");
      if (!isPdf && !isImage) return;
      setFileType(isPdf ? "pdf" : "image");
      simulateParsing(file.name);
    },
    [simulateParsing]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const currentStepIndex = PHASE_STEPS.findIndex((s) => s.key === phase);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="ml-4 flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground">
            InBit <span className="text-primary">Parse</span>
          </span>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm text-foreground font-medium">New Parse</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Progress steps */}
          {phase !== "upload" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mb-10"
            >
              {PHASE_STEPS.map((step, i) => (
                <div key={step.key} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      i < currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : i === currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < currentStepIndex ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      i <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {i < PHASE_STEPS.length - 1 && (
                    <div
                      className={`w-8 h-px ${
                        i < currentStepIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {phase === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-16 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/40 hover:bg-accent/50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-1">
                        Upload Document
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Drag & drop a PDF or image, or click to browse
                      </p>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1.5">
                        <FileText className="w-3.5 h-3.5" /> PDF
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1.5">
                        <Image className="w-3.5 h-3.5" /> PNG, JPG, TIFF
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(phase === "uploading" || phase === "parsing") && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="border border-border rounded-xl p-12 text-center bg-card"
              >
                <div className="flex flex-col items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                      {phase === "uploading" ? "Uploading…" : "Parsing document…"}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-1">{fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {phase === "uploading"
                        ? "Sending your document to the server"
                        : "Extracting text, tables, and images"}
                    </p>
                  </div>
                  <div className="w-full max-w-xs">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {Math.round(progress)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="border border-border rounded-xl p-12 text-center bg-card"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                      Parsing complete!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Opening workspace…
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
