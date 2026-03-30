import { useState } from "react";
import { Heart, MessageCircle, Share2, Music, Bookmark, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface VideoCardProps {
  video: {
    id: number;
    username: string;
    description: string;
    song: string;
    likes: number;
    comments: number;
    shares: number;
    color: string;
  };
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const { t } = useLanguage();

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const formatCount = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <div className="relative flex h-full w-full snap-start items-end" style={{ backgroundColor: video.color }}>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />

      {/* Right side actions */}
      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4 z-10">
        <div className="relative">
          <div className="h-11 w-11 rounded-full border-2 border-foreground overflow-hidden gradient-ethiopia flex items-center justify-center">
            <span className="text-sm font-bold text-secondary-foreground">{video.username.charAt(0).toUpperCase()}</span>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
            <span className="text-[10px] font-bold text-accent-foreground">+</span>
          </div>
        </div>

        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
            <Heart className={`h-7 w-7 ${liked ? "fill-accent text-accent" : "text-foreground"}`} />
          </motion.div>
          <span className="text-xs font-semibold text-foreground">{formatCount(likeCount)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <MessageCircle className="h-7 w-7 text-foreground" />
          <span className="text-xs font-semibold text-foreground">{formatCount(video.comments)}</span>
        </button>

        <button onClick={() => setSaved(!saved)} className="flex flex-col items-center gap-1">
          <Bookmark className={`h-7 w-7 ${saved ? "fill-secondary text-secondary" : "text-foreground"}`} />
          <span className="text-xs font-semibold text-foreground">{t("save")}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <Download className="h-7 w-7 text-foreground" />
          <span className="text-xs font-semibold text-foreground">{t("download")}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <Share2 className="h-7 w-7 text-foreground" />
          <span className="text-xs font-semibold text-foreground">{formatCount(video.shares)}</span>
        </button>

        <div className="mt-1">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="h-10 w-10 rounded-full border-2 border-muted gradient-ethiopia flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-background" />
          </motion.div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 w-full px-4 pb-20 pr-20">
        <h4 className="text-sm font-bold text-foreground">@{video.username}</h4>
        <p className="mt-1 text-sm text-foreground/90 line-clamp-2">{video.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <Music className="h-3.5 w-3.5 text-foreground" />
          <div className="overflow-hidden">
            <motion.p animate={{ x: [0, -200] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="whitespace-nowrap text-xs text-foreground/80">
              🎵 {video.song} • {video.song}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
