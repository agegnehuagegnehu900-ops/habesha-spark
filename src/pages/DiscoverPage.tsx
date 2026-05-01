import { useEffect, useState } from "react";
import { Search, Play } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { searchVideos, FSVideo } from "@/lib/firestoreHelpers";

const trending = [
  "#ኢስክስታ", "#Agegnehu", "#ኢትዮጵያ", "#addisababa",
  "#ethiopianfood", "#agegnehu", "#ላሊበላ", "#teddy",
];

const DiscoverPage = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FSVideo[]>([]);
  const [searching, setSearching] = useState(false);

  // Debounced realtime search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await searchVideos(query);
        setResults(r);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const categories = [
    { name: t("music"), color: "bg-primary" },
    { name: t("dance"), color: "bg-accent" },
    { name: t("comedy"), color: "bg-secondary" },
    { name: t("food"), color: "bg-ethiopia-green" },
    { name: t("travel"), color: "bg-ethiopia-yellow" },
    { name: t("sports"), color: "bg-ethiopia-red" },
    { name: t("education"), color: "bg-primary" },
    { name: t("film"), color: "bg-accent" },
  ];

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <div className="mx-auto w-full max-w-3xl px-4 pt-6 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-foreground mb-4">{t("search")}</h1>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 mb-6">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchVideos")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searching && <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
        </div>

        {query.length > 0 ? (
          <div className="space-y-3">
            {results.length === 0 && !searching ? (
              <p className="text-center text-sm text-muted-foreground py-8">ምንም ውጤት የለም</p>
            ) : (
              results.map((v) => (
                <div key={v.id} className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border">
                  <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden flex items-center justify-center">
                    {v.thumbnail_url ? (
                      <img src={v.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <Play className="h-5 w-5 text-foreground fill-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">@{v.username || "user"}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{v.description}</p>
                    {v.song_name && <p className="text-xs text-muted-foreground mt-0.5">🎵 {v.song_name}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-foreground mb-3">{t("trending")}</h2>
              <div className="flex flex-wrap gap-2">
                {trending.map((tag) => (
                  <button key={tag} onClick={() => setQuery(tag.replace("#", ""))} className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-sm font-semibold text-foreground mb-3">{t("categories")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <div key={cat.name} className={`${cat.color} rounded-xl p-4 text-center`}>
                  <span className="text-sm font-bold text-foreground">{cat.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default DiscoverPage;
