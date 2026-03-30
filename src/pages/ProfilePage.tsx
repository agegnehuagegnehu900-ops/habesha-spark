import { Settings, Grid3X3, Bookmark, Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("videos");

  const stats = [
    { label: "ተከታይ", value: "0" },
    { label: "እከተላለሁ", value: "0" },
    { label: "ላይክ", value: "0" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6">
        <h1 className="text-lg font-bold text-foreground">@user</h1>
        <Settings className="h-5 w-5 text-foreground" />
      </div>

      {/* Profile info */}
      <div className="mt-4 flex flex-col items-center">
        <div className="h-20 w-20 rounded-full gradient-ethiopia flex items-center justify-center glow-green">
          <span className="text-2xl font-black text-secondary-foreground">ሐ</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">@user</p>

        {/* Stats */}
        <div className="mt-4 flex gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Edit button */}
        <button className="mt-4 rounded-lg border border-border bg-muted px-8 py-2 text-sm font-semibold text-foreground">
          ፕሮፋይል አርትዕ
        </button>

        {/* Bio */}
        <p className="mt-3 text-center text-sm text-muted-foreground px-8">
          🇪🇹 Agegnehu ተጠቃሚ
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-border">
        {[
          { id: "videos", icon: Grid3X3 },
          { id: "saved", icon: Bookmark },
          { id: "liked", icon: Heart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex justify-center ${
              activeTab === tab.id ? "border-b-2 border-foreground" : ""
            }`}
          >
            <tab.icon
              className={`h-5 w-5 ${
                activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-16 px-8">
        <p className="text-sm text-muted-foreground text-center">
          ገና ቪዲዮ የለም። የመጀመሪያ ቪዲዮዎን ይስቀሉ! 🎬
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
