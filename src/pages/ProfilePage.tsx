import { Settings, Grid3X3, Bookmark, Heart, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

interface MyVideo {
  id: string;
  video_url: string;
  thumbnail_url?: string | null;
  views_count: number;
  likes_count: number;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ username: string | null; display_name: string | null; bio: string | null } | null>(null);
  const [videos, setVideos] = useState<MyVideo[]>([]);
  const [counts, setCounts] = useState({ videos: 0, likes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    // Profile still from Lovable Cloud (auth source of truth)
    supabase
      .from("profiles")
      .select("username, display_name, bio")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));

    // Videos from Firestore — realtime
    const q = query(
      collection(db, "videos"),
      where("user_id", "==", user.id),
      orderBy("created_at", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: MyVideo[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            video_url: data.video_url,
            thumbnail_url: data.thumbnail_url ?? null,
            views_count: data.views_count ?? 0,
            likes_count: data.likes_count ?? 0,
          };
        });
        setVideos(list);
        const totalLikes = list.reduce((s, v) => s + (v.likes_count || 0), 0);
        setCounts({ videos: list.length, likes: totalLikes });
        setLoading(false);
      },
      (err) => {
        console.error("Firestore videos error", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const formatCount = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return n.toString();
  };

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

      <div className="flex flex-col items-center justify-center py-10 px-4">
        {loading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : activeTab === "videos" && videos.length > 0 ? (
          <div className="grid w-full grid-cols-3 gap-1">
            {videos.map((v) => (
              <div key={v.id} className="relative aspect-[9/16] overflow-hidden bg-muted">
                {v.thumbnail_url ? (
                  <img src={v.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <video src={v.video_url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                )}
                  <div className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-background/60 px-1.5 py-0.5">
                    <Play className="h-3 w-3 fill-foreground text-foreground" />
                    <span className="text-[10px] font-semibold text-foreground">{formatCount(v.views_count)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">{t("noVideosYet")}</p>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
