import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Music } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DBVideo {
  id: string;
  video_url: string;
  description: string | null;
  song_name: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  user_id: string;
}

const formatCount = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"following" | "foryou">("foryou");
  const [videos, setVideos] = useState<DBVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("id, video_url, description, song_name, likes_count, comments_count, shares_count, user_id")
        .order("created_at", { ascending: false })
        .limit(50);
      if (!error && data) setVideos(data as DBVideo[]);

      if (user) {
        const { data: likes } = await supabase.from("likes").select("video_id").eq("user_id", user.id);
        if (likes) setLikedIds(new Set(likes.map((l) => l.video_id)));
      }
      setLoading(false);
    })();
  }, [user]);

  const toggleLike = async (videoId: string) => {
    if (!user) return;
    const isLiked = likedIds.has(videoId);
    const next = new Set(likedIds);
    if (isLiked) {
      next.delete(videoId);
      await supabase.from("likes").delete().eq("user_id", user.id).eq("video_id", videoId);
    } else {
      next.add(videoId);
      await supabase.from("likes").insert({ user_id: user.id, video_id: videoId });
    }
    setLikedIds(next);
  };

  return (
    <div className="relative h-screen w-full bg-background overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center gap-6 pt-4 pb-2">
        <button onClick={() => setActiveTab("following")} className={`text-sm font-semibold ${activeTab === "following" ? "text-foreground" : "text-foreground/50"}`}>
          {t("following")}
        </button>
        <div className="h-4 w-px bg-foreground/20" />
        <button onClick={() => setActiveTab("foryou")} className={`text-sm font-semibold ${activeTab === "foryou" ? "text-foreground" : "text-foreground/50"}`}>
          {t("forYou")}
          {activeTab === "foryou" && <div className="mt-1 mx-auto h-0.5 w-6 rounded-full gradient-ethiopia-h" />}
        </button>
      </div>

      {loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : videos.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="mb-4 h-16 w-16 rounded-2xl gradient-ethiopia flex items-center justify-center">
            <span className="text-2xl">🎬</span>
          </div>
          <p className="text-foreground font-semibold">ገና ቪዲዮ የለም</p>
          <p className="mt-1 text-sm text-muted-foreground">የመጀመሪያ ቪዲዮዎን ይጫኑ!</p>
        </div>
      ) : (
        <div className="h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth scrollbar-hide" style={{ scrollSnapStop: "always", WebkitOverflowScrolling: "touch" }}>
          {videos.map((v) => {
            const liked = likedIds.has(v.id);
            return (
              <div key={v.id} className="relative h-screen w-full snap-start snap-always bg-black">
                <video
                  src={v.video_url}
                  className="absolute inset-0 h-full w-full object-cover"
                  loop
                  muted
                  playsInline
                  autoPlay
                  controls={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />

                <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4 z-10">
                  <button onClick={() => toggleLike(v.id)} className="flex flex-col items-center gap-1">
                    <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                      <Heart className={`h-7 w-7 ${liked ? "fill-accent text-accent" : "text-foreground"}`} />
                    </motion.div>
                    <span className="text-xs font-semibold text-foreground">{formatCount(v.likes_count + (liked && !likedIds.has(v.id) ? 1 : 0))}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <MessageCircle className="h-7 w-7 text-foreground" />
                    <span className="text-xs font-semibold text-foreground">{formatCount(v.comments_count)}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <Share2 className="h-7 w-7 text-foreground" />
                    <span className="text-xs font-semibold text-foreground">{formatCount(v.shares_count)}</span>
                  </button>
                </div>

                <div className="absolute bottom-20 left-0 right-20 z-10 px-4">
                  <p className="text-sm text-foreground/90 line-clamp-2">{v.description || ""}</p>
                  {v.song_name && (
                    <div className="mt-2 flex items-center gap-2">
                      <Music className="h-3.5 w-3.5 text-foreground" />
                      <p className="text-xs text-foreground/80">🎵 {v.song_name}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default HomePage;
