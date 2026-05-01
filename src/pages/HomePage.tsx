import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Share2, Music } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import CommentsSheet from "@/components/CommentsSheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { fetchVideosPage, FSVideo, toggleLike, isLiked, incrementShares } from "@/lib/firestoreHelpers";
import { shareVideo } from "@/lib/share";
import { toast } from "@/hooks/use-toast";
import type { QueryDocumentSnapshot } from "firebase/firestore";

const formatCount = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"following" | "foryou">("foryou");
  const [videos, setVideos] = useState<FSVideo[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [commentVideoId, setCommentVideoId] = useState<string | null>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Initial load
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { videos: vs, nextCursor } = await fetchVideosPage(null);
        setVideos(vs);
        setCursor(nextCursor);
        setHasMore(!!nextCursor);
      } catch (e: any) {
        console.error("feed load", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Hydrate liked state for loaded videos
  useEffect(() => {
    if (!user || videos.length === 0) return;
    (async () => {
      const results = await Promise.all(
        videos.map(async (v) => ((await isLiked(v.id, user.id)) ? v.id : null))
      );
      setLikedIds(new Set(results.filter((x): x is string => !!x)));
    })();
  }, [user, videos.length]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursor) return;
    setLoadingMore(true);
    try {
      const { videos: vs, nextCursor } = await fetchVideosPage(cursor);
      setVideos((prev) => [...prev, ...vs]);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, hasMore, loadingMore]);

  // Infinite scroll sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: null, threshold: 0.1 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loadMore]);

  // Autoplay only the visible video
  useEffect(() => {
    const vidEls = Array.from(videoRefs.current.values());
    if (vidEls.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    vidEls.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [videos]);

  const handleLike = async (v: FSVideo) => {
    if (!user) return;
    const liked = likedIds.has(v.id);
    const next = new Set(likedIds);
    liked ? next.delete(v.id) : next.add(v.id);
    setLikedIds(next);
    setVideos((prev) =>
      prev.map((x) => (x.id === v.id ? { ...x, likes_count: x.likes_count + (liked ? -1 : 1) } : x))
    );
    try {
      await toggleLike(v.id, user.id, liked);
    } catch (e: any) {
      toast({ title: "ስህተት", description: e.message, variant: "destructive" });
    }
  };

  const handleShare = async (v: FSVideo) => {
    const ok = await shareVideo({
      title: "Agegnehu",
      text: v.description || "ይህን ቪዲዮ ይመልከቱ",
      url: v.video_url,
    });
    if (ok) {
      incrementShares(v.id).catch(() => {});
      setVideos((prev) => prev.map((x) => (x.id === v.id ? { ...x, shares_count: x.shares_count + 1 } : x)));
    }
  };

  return (
    <div className="relative h-[100dvh] w-full bg-background overflow-hidden">
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
        <div
          className="h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth scrollbar-hide"
          style={{ scrollSnapStop: "always", WebkitOverflowScrolling: "touch" }}
        >
          {videos.map((v) => {
            const liked = likedIds.has(v.id);
            return (
              <div key={v.id} className="relative h-[100dvh] w-full snap-start snap-always bg-black">
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(v.id, el);
                    else videoRefs.current.delete(v.id);
                  }}
                  src={v.video_url}
                  className="absolute inset-0 h-full w-full object-cover"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20 pointer-events-none" />

                <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4 z-10">
                  <button onClick={() => handleLike(v)} className="flex flex-col items-center gap-1">
                    <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                      <Heart className={`h-7 w-7 ${liked ? "fill-accent text-accent" : "text-foreground"}`} />
                    </motion.div>
                    <span className="text-xs font-semibold text-foreground">{formatCount(v.likes_count || 0)}</span>
                  </button>
                  <button onClick={() => setCommentVideoId(v.id)} className="flex flex-col items-center gap-1">
                    <MessageCircle className="h-7 w-7 text-foreground" />
                    <span className="text-xs font-semibold text-foreground">{formatCount(v.comments_count || 0)}</span>
                  </button>
                  <button onClick={() => handleShare(v)} className="flex flex-col items-center gap-1">
                    <Share2 className="h-7 w-7 text-foreground" />
                    <span className="text-xs font-semibold text-foreground">{formatCount(v.shares_count || 0)}</span>
                  </button>
                </div>

                <div className="absolute bottom-20 left-0 right-20 z-10 px-4">
                  {v.username && <p className="text-sm font-bold text-foreground">@{v.username}</p>}
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

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="h-20 w-full flex items-center justify-center">
            {loadingMore && <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
            {!hasMore && videos.length > 0 && <p className="text-xs text-muted-foreground">ሁሉም ቪዲዮዎች ጨርሰዋል</p>}
          </div>
        </div>
      )}

      <CommentsSheet
        videoId={commentVideoId}
        open={!!commentVideoId}
        onOpenChange={(o) => !o && setCommentVideoId(null)}
      />
      <BottomNav />
    </div>
  );
};

export default HomePage;
