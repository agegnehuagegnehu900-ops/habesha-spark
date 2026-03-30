import { Settings, Grid3X3, Bookmark, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    { label: t("followers"), value: "0" },
    { label: t("followingCount"), value: "0" },
    { label: t("likes"), value: "0" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center justify-between px-4 pt-6">
        <h1 className="text-lg font-bold text-foreground">@user</h1>
        <button onClick={() => navigate("/settings")}>
          <Settings className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="h-20 w-20 rounded-full gradient-ethiopia flex items-center justify-center glow-green">
          <span className="text-2xl font-black text-secondary-foreground">አ</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">@user</p>

        <div className="mt-4 flex gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <button className="mt-4 rounded-lg border border-border bg-muted px-8 py-2 text-sm font-semibold text-foreground">
          {t("editProfile")}
        </button>
        <p className="mt-3 text-center text-sm text-muted-foreground px-8">{t("userBio")}</p>
      </div>

      <div className="mt-6 flex border-b border-border">
        {[{ id: "videos", icon: Grid3X3 }, { id: "saved", icon: Bookmark }, { id: "liked", icon: Heart }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 flex justify-center ${activeTab === tab.id ? "border-b-2 border-foreground" : ""}`}>
            <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? "text-foreground" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-16 px-8">
        <p className="text-sm text-muted-foreground text-center">{t("noVideosYet")}</p>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
