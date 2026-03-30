import { ArrowLeft, MessageCircle, HelpCircle, AlertTriangle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const HelpCenterPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "admin"; text: string }[]>([
    { from: "admin", text: t("helpMessage") },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: message },
      { from: "admin", text: "Thank you! We'll get back to you shortly. 🙏" },
    ]);
    setMessage("");
  };

  const faqItems = [
    { q: "How do I upload a video?", a: "Go to Create tab → Record or Choose from Gallery" },
    { q: "How to change language?", a: "Profile → Settings → Language" },
    { q: "Is my data safe?", a: "Yes, we use industry-standard encryption" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{t("helpCenter")}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Admin card */}
        <div className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border">
          <div className="relative">
            <div className="h-12 w-12 rounded-full gradient-ethiopia flex items-center justify-center">
              <span className="text-lg font-bold text-secondary-foreground">አ</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-card" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{t("adminName")}</p>
            <p className="text-xs text-primary font-medium">{t("online")}</p>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">{t("faq")}</h2>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <details key={i} className="rounded-xl border border-border bg-card overflow-hidden group">
                <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{item.q}</span>
                </summary>
                <div className="px-4 pb-3 pt-1">
                  <p className="text-xs text-muted-foreground ml-7">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:bg-muted transition-colors">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium text-foreground">{t("contactSupport")}</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:bg-muted transition-colors">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <span className="text-xs font-medium text-foreground">{t("reportProblem")}</span>
          </button>
        </div>

        {/* Chat messages */}
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.from === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("helpMessage")}
            className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <button onClick={handleSend} className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Send className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
