import { ArrowLeft, Globe, Shield, Bell, User, Moon, Play, LogOut, Trash2, FileText, HelpCircle, Info, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/i18n/translations";
import { useState } from "react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage, languageNames } = useLanguage();
  const [showLanguages, setShowLanguages] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  const settingSections = [
    {
      title: t("account"),
      items: [
        { icon: Globe, label: t("language"), value: languageNames[language].split(" ")[0], action: () => setShowLanguages(!showLanguages) },
        { icon: Moon, label: t("darkMode"), toggle: true, checked: darkMode, action: () => setDarkMode(!darkMode) },
        { icon: Play, label: t("autoPlay"), toggle: true, checked: autoPlay, action: () => setAutoPlay(!autoPlay) },
      ],
    },
    {
      title: t("privacy"),
      items: [
        { icon: Shield, label: t("privacyPolicy"), action: () => {} },
        { icon: FileText, label: t("termsOfService"), action: () => {} },
      ],
    },
    {
      title: "",
      items: [
        { icon: HelpCircle, label: t("helpCenter"), action: () => navigate("/help") },
        { icon: Info, label: t("aboutApp"), value: "v1.0.0", action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{t("settings")}</h1>
      </div>

      <div className="px-4 py-4 space-y-6">
        {settingSections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{section.title}</h2>
            )}
            <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4.5 w-4.5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.toggle ? (
                      <div className={`h-6 w-11 rounded-full transition-colors ${item.checked ? "bg-primary" : "bg-muted"} relative`}>
                        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${item.checked ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    ) : (
                      <>
                        {item.value && <span className="text-xs text-muted-foreground">{item.value}</span>}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Language selector */}
        {showLanguages && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <h3 className="px-4 py-3 text-sm font-semibold text-foreground border-b border-border">{t("language")}</h3>
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setShowLanguages(false); }}
                className={`flex w-full items-center justify-between px-4 py-3 hover:bg-muted transition-colors ${language === lang ? "bg-primary/10" : ""}`}
              >
                <span className="text-sm text-foreground">{languageNames[lang]}</span>
                {language === lang && <div className="h-2 w-2 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        )}

        {/* Danger zone */}
        <div className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 hover:bg-muted transition-colors">
            <LogOut className="h-4.5 w-4.5 text-accent" />
            <span className="text-sm font-medium text-accent">{t("signOut")}</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3.5 hover:bg-accent/10 transition-colors">
            <Trash2 className="h-4.5 w-4.5 text-accent" />
            <span className="text-sm font-medium text-accent">{t("deleteAccount")}</span>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-8">Agegnehu {t("version")} 1.0.0</p>
      </div>
    </div>
  );
};

export default SettingsPage;
