import { Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const categories = [
  { name: "🎵 ሙዚቃ", color: "bg-primary" },
  { name: "💃 ዳንስ", color: "bg-accent" },
  { name: "😂 ቀልድ", color: "bg-secondary" },
  { name: "🍲 ምግብ", color: "bg-ethiopia-green" },
  { name: "✈️ ጉዞ", color: "bg-ethiopia-yellow" },
  { name: "⚽ ስፖርት", color: "bg-ethiopia-red" },
  { name: "📚 ትምህርት", color: "bg-primary" },
  { name: "🎬 ፊልም", color: "bg-accent" },
];

const trending = [
  "#ኢስክስታ", "#ሐበሻ", "#ኢትዮጵያ", "#addisababa",
  "#ethiopianfood", "#habeshamusic", "#ላሊበላ", "#teddy",
];

const DiscoverPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6">
        <h1 className="text-xl font-bold text-foreground mb-4">ፈልግ</h1>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 mb-6">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ቪዲዮ ፈልግ..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Trending tags */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">🔥 ትሬንዲንግ</h2>
          <div className="flex flex-wrap gap-2">
            {trending.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Categories grid */}
        <h2 className="text-sm font-semibold text-foreground mb-3">ምድቦች</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`${cat.color} rounded-xl p-4 text-center`}
            >
              <span className="text-sm font-bold text-foreground">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DiscoverPage;
