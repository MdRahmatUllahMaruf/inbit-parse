import { createContext, useContext, useState, type ReactNode } from "react";

interface WorkspaceContextType {
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <WorkspaceContext.Provider value={{ selectedBlockId, setSelectedBlockId, currentPage, setCurrentPage }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
