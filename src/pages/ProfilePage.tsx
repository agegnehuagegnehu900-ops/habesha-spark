import { Settings, Grid3X3, Bookmark, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ username: string | null; display_name: string | null; bio: string | null } | null>(null);
  const [counts, setCounts] = useState({ videos: 0, likes: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { count: vc }, { data: vids }] = await Promise.all([
        supabase.from("profiles").select("username, display_name, bio").eq("user_id", user.id).maybeSingle(),
        supabase.from("videos").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("videos").select("likes_count").eq("user_id", user.id),
      ]);
      setProfile(p);
      const totalLikes = (vids || []).reduce((s, v) => s + (v.likes_count || 0), 0);
      setCounts({ videos: vc || 0, likes: totalLikes });
    })();
  }, [user]);

  const username = profile?.username || profile?.display_name || user?.email?.split("@")[0] || user?.phone || "user";

  const stats = [
    { label: t("followers"), value: "0" },
    { label: t("followingCount"), value: "0" },
    { label: t("likes"), value: counts.likes.toString() },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center justify-between px-4 pt-6">
        <h1 className="text-lg font-bold text-foreground">@{username}</h1>
        <button onClick={() => navigate("/settings")}>
          <Settings className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="h-20 w-20 rounded-full gradient-ethiopia flex items-center justify-center glow-green">
          <span className="text-2xl font-black text-secondary-foreground">{username.charAt(0).toUpperCase()}</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">@{username}</p>

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
        <p className="mt-3 text-center text-sm text-muted-foreground px-8">{profile?.bio || t("userBio")}</p>
      </div>

      <div className="mt-6 flex border-b border-border">
        {[{ id: "videos", icon: Grid3X3 }, { id: "saved", icon: Bookmark }, { id: "liked", icon: Heart }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 flex justify-center ${activeTab === tab.id ? "border-b-2 border-foreground" : ""}`}>
            <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? "text-foreground" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-16 px-8">
        <p className="text-sm text-muted-foreground text-center">
          {counts.videos === 0 ? t("noVideosYet") : `${counts.videos} ቪዲዮዎች`}
        </p>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
