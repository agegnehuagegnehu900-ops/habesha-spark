import { Camera, Video, Image, Music, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const CreatePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="mb-6 h-16 w-16 rounded-2xl gradient-ethiopia flex items-center justify-center glow-green">
          <Camera className="h-8 w-8 text-secondary-foreground" />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">ቪዲዮ ፍጠር</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          ለሐበሻ ማህበረሰብ ቪዲዮ ይስቀሉ
        </p>

        <div className="w-full max-w-xs space-y-3">
          {[
            { icon: Video, label: "ቪዲዮ ቅረጽ", color: "bg-accent" },
            { icon: Image, label: "ከጋለሪ ምረጥ", color: "bg-primary" },
            { icon: Music, label: "ሙዚቃ ጨምር", color: "bg-secondary" },
            { icon: Sparkles, label: "ኢፌክት ጨምር", color: "bg-ethiopia-green" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center gap-4 rounded-xl bg-card border border-border p-4 transition-all hover:bg-muted"
            >
              <div className={`${item.color} h-10 w-10 rounded-lg flex items-center justify-center`}>
                <item.icon className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CreatePage;
