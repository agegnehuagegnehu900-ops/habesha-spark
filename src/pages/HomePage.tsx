import { useState, useRef } from "react";
import VideoCard from "@/components/VideoCard";
import BottomNav from "@/components/BottomNav";
import { mockVideos } from "@/data/mockVideos";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"following" | "foryou">("foryou");
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-screen w-full bg-background overflow-hidden">
      {/* Top tabs */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center gap-6 pt-4 pb-2">
        <button
          onClick={() => setActiveTab("following")}
          className={`text-sm font-semibold transition-all ${
            activeTab === "following"
              ? "text-foreground"
              : "text-foreground/50"
          }`}
        >
          ተከታዮች
        </button>
        <div className="h-4 w-px bg-foreground/20" />
        <button
          onClick={() => setActiveTab("foryou")}
          className={`text-sm font-semibold transition-all ${
            activeTab === "foryou"
              ? "text-foreground"
              : "text-foreground/50"
          }`}
        >
          ለአንተ
          {activeTab === "foryou" && (
            <div className="mt-1 mx-auto h-0.5 w-6 rounded-full gradient-ethiopia-h" />
          )}
        </button>
      </div>

      {/* Video feed */}
      <div
        ref={scrollRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
      >
        {mockVideos.map((video) => (
          <div key={video.id} className="h-screen w-full snap-start">
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
