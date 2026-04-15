import { useState, useRef } from "react";
import { Camera, Video, Image, Music, Sparkles, Upload, X, Play } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

const CreatePage = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({ title: "ቪዲዮ ብቻ!", description: "እባክዎ ቪዲዮ ፋይል ይምረጡ", variant: "destructive" });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({ title: "ፋይሉ ትልቅ ነው", description: "ከ100MB ያነሰ ቪዲዮ ይምረጡ", variant: "destructive" });
      return;
    }

    setSelectedVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const clearVideo = () => {
    setSelectedVideo(null);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = () => {
    if (!selectedVideo) return;
    toast({ title: "✅ ቪዲዮ ተመርጧል!", description: `${selectedVideo.name} (${(selectedVideo.size / 1024 / 1024).toFixed(1)}MB)` });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={handleVideoSelect}
      />

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {videoPreview ? (
          <div className="w-full max-w-xs">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-[9/16]">
              <video
                src={videoPreview}
                className="w-full h-full object-cover"
                controls
                playsInline
              />
              <button
                onClick={clearVideo}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center truncate">
              {selectedVideo?.name} • {((selectedVideo?.size || 0) / 1024 / 1024).toFixed(1)}MB
            </p>
            <button
              onClick={handleUpload}
              className="w-full mt-4 py-3 rounded-xl gradient-ethiopia text-secondary-foreground font-bold text-sm glow-green"
            >
              <Upload className="h-4 w-4 inline mr-2" />
              {t("recordVideo")}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 h-16 w-16 rounded-2xl gradient-ethiopia flex items-center justify-center glow-green">
              <Camera className="h-8 w-8 text-secondary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{t("createVideo")}</h2>
            <p className="text-sm text-muted-foreground text-center mb-8">{t("uploadForCommunity")}</p>
            <div className="w-full max-w-xs space-y-3">
              {[
                { icon: Video, label: t("recordVideo"), color: "bg-accent", action: () => fileInputRef.current?.click() },
                { icon: Image, label: t("chooseFromGallery"), color: "bg-primary", action: () => fileInputRef.current?.click() },
                { icon: Music, label: t("addMusic"), color: "bg-secondary", action: () => {} },
                { icon: Sparkles, label: t("addEffects"), color: "bg-ethiopia-green", action: () => {} },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex w-full items-center gap-4 rounded-xl bg-card border border-border p-4 transition-all hover:bg-muted active:scale-[0.98]"
                >
                  <div className={`${item.color} h-10 w-10 rounded-lg flex items-center justify-center`}>
                    <item.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default CreatePage;
