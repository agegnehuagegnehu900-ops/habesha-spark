import { Bell, Heart, UserPlus, AtSign } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";

const InboxPage = () => {
  const { t } = useLanguage();

  const sections = [
    { icon: Heart, label: t("likesLabel"), desc: t("likesDesc"), color: "bg-accent" },
    { icon: UserPlus, label: t("newFollowers"), desc: t("newFollowersDesc"), color: "bg-primary" },
    { icon: AtSign, label: t("mentions"), desc: t("mentionsDesc"), color: "bg-secondary" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">{t("notifications")}</h1>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.label} className="flex items-center gap-4 rounded-xl bg-card p-4 border border-border">
              <div className={`${section.color} h-11 w-11 rounded-full flex items-center justify-center`}>
                <section.icon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{section.label}</p>
                <p className="text-xs text-muted-foreground">{section.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default InboxPage;
