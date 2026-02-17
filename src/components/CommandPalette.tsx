import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { FileText, Home, Sparkles, MessageSquare, Search } from "lucide-react";
import { documents } from "@/data/dummy";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search commands, documents…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => {
              navigate("/");
              setOpen(false);
            }}
          >
            <Home className="mr-2 h-4 w-4" /> Home
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Documents">
          {documents.map((doc) => (
            <CommandItem
              key={doc.id}
              onSelect={() => {
                navigate(`/workspace/${doc.id}`);
                setOpen(false);
              }}
            >
              <FileText className="mr-2 h-4 w-4" /> {doc.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem>
            <Sparkles className="mr-2 h-4 w-4" /> Extract Entities
          </CommandItem>
          <CommandItem>
            <MessageSquare className="mr-2 h-4 w-4" /> Open Chat
          </CommandItem>
          <CommandItem>
            <Search className="mr-2 h-4 w-4" /> Search in document
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
