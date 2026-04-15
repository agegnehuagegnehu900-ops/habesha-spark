import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ReportPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reportText.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Error", description: "Please log in first", variant: "destructive" });
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      report_text: reportText.trim(),
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅", description: "Report submitted successfully!" });
      setReportText("");
      navigate(-1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{t("reportProblem")}</h1>
      </div>
      <div className="flex-1 px-4 py-6 space-y-4">
        <p className="text-sm text-muted-foreground">ችግርዎን በዝርዝር ይንገሩን። በተቻለ ፍጥነት እንመልስልዎታለን።</p>
        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="ችግርዎን እዚህ ይጻፉ..."
          rows={6}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={!reportText.trim() || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              ሪፖርት ላክ
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
