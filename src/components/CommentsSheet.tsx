import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { subscribeComments, addComment, FSComment } from "@/lib/firestoreHelpers";

interface Props {
  videoId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommentsSheet = ({ videoId, open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<FSComment[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open || !videoId) return;
    const unsub = subscribeComments(videoId, setComments);
    return () => unsub();
  }, [open, videoId]);

  const send = async () => {
    if (!text.trim() || !videoId || !user) return;
    setSending(true);
    try {
      const username = user.email?.split("@")[0] || user.phone || "user";
      await addComment(videoId, user.id, username, text.trim());
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] flex flex-col p-0 bg-background border-border">
        <SheetHeader className="px-4 py-3 border-b border-border">
          <SheetTitle className="text-foreground text-base">አስተያየቶች ({comments.length})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">የመጀመሪያውን አስተያየት ይፃፉ</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full gradient-ethiopia flex items-center justify-center">
                  <span className="text-xs font-bold text-secondary-foreground">{c.username.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">@{c.username}</p>
                  <p className="text-sm text-foreground/90 break-words">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-border p-3 flex gap-2 items-center pb-safe">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="አስተያየት ይጨምሩ..."
            className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={send}
            disabled={sending || !text.trim()}
            className="h-10 w-10 rounded-full gradient-ethiopia flex items-center justify-center disabled:opacity-50"
          >
            <Send className="h-4 w-4 text-secondary-foreground" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentsSheet;
