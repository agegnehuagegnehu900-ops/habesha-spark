import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Video, Image, Upload, X, Loader2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { uploadToCloudinary, getVideoThumbnail } from "@/lib/cloudinary";

const CreatePage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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
    setDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedVideo || !user) return;
    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadToCloudinary(selectedVideo, (p) => setProgress(p));

      const { error: dbErr } = await supabase.from("videos").insert({
        user_id: user.id,
        video_url: result.secure_url,
        thumbnail_url: getVideoThumbnail(result.secure_url),
        description: description || null,
      });
      if (dbErr) throw dbErr;

      toast({ title: "✅ ተሳክቷል!", description: "ቪዲዮዎ ተጭኗል" });
      clearVideo();
      navigate("/");
    } catch (e: any) {
      toast({ title: "ስህተት", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        {videoPreview ? (
          <div className="w-full max-w-xs">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-[9/16]">
              <video src={videoPreview} className="w-full h-full object-cover" controls playsInline />
              <button onClick={clearVideo} disabled={uploading} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center">
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center truncate">
              {selectedVideo?.name} • {((selectedVideo?.size || 0) / 1024 / 1024).toFixed(1)}MB
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ስለ ቪዲዮዎ ይፃፉ..."
              maxLength={300}
              className="w-full mt-3 rounded-xl border border-border bg-card p-3 text-sm text-foreground outline-none resize-none"
              rows={3}
            />
            {uploading && (
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full gradient-ethiopia-h transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-4 py-3 rounded-xl gradient-ethiopia text-secondary-foreground font-bold text-sm glow-green disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? <><Loader2 className="h-4 w-4 animate-spin" />ይጫናል... {progress}%</> : <><Upload className="h-4 w-4" />ጫን</>}
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
                { icon: Video, label: t("recordVideo"), color: "bg-accent" },
                { icon: Image, label: t("chooseFromGallery"), color: "bg-primary" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-4 rounded-xl bg-card border border-border p-4 hover:bg-muted active:scale-[0.98]"
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
