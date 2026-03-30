import { Home, Search, PlusSquare, MessageCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const tabs = [
    { icon: Home, label: t("home"), path: "/" },
    { icon: Search, label: t("discover"), path: "/discover" },
    { icon: PlusSquare, label: "", path: "/create", isCreate: true },
    { icon: MessageCircle, label: t("inbox"), path: "/inbox" },
    { icon: User, label: t("profile"), path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          if (tab.isCreate) {
            return (
              <button key={tab.path} onClick={() => navigate(tab.path)} className="flex items-center justify-center">
                <div className="flex h-10 w-12 items-center justify-center rounded-lg gradient-ethiopia-h">
                  <PlusSquare className="h-5 w-5 text-secondary-foreground" />
                </div>
              </button>
            );
          }

          return (
            <button key={tab.path} onClick={() => navigate(tab.path)} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
              <span className={`text-[10px] transition-colors ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
