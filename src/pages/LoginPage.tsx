import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight, Shield, Mail } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSendOTP = async () => {
    if (phone.length < 9) return;
    setLoading(true);
    const fullPhone = `+251${phone.replace(/^0/, "")}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      toast({ title: "ስህተት", description: error.message, variant: "destructive" });
      return;
    }
    setStep("otp");
    toast({ title: "✅", description: "ኮድ ተልኳል" });
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    const fullPhone = `+251${phone.replace(/^0/, "")}`;
    const { error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
    setLoading(false);
    if (error) {
      toast({ title: "ስህተት", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/", { replace: true });
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return;
    setLoading(true);
    const fn = isSignup
      ? supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/` } })
      : supabase.auth.signInWithPassword({ email, password });
    const { error } = await fn;
    setLoading(false);
    if (error) {
      toast({ title: "ስህተት", description: error.message, variant: "destructive" });
      return;
    }
    if (!isSignup) navigate("/", { replace: true });
    else toast({ title: "✅", description: "ተመዝግበዋል!" });
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setLoading(false);
      toast({ title: "ስህተት", description: result.error.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-1.5 gradient-ethiopia-h w-full" />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl gradient-ethiopia glow-green">
            <span className="text-3xl font-black text-secondary-foreground">አ</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Agegnehu</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("communityTagline")}</p>
        </motion.div>

        <div className="w-full max-w-sm mb-4 flex gap-2 rounded-xl bg-card border border-border p-1">
          <button onClick={() => { setMode("phone"); setStep("input"); }} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === "phone" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>📱 ስልክ</button>
          <button onClick={() => { setMode("email"); setStep("input"); }} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === "email" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>✉️ ኢሜይል</button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "phone" && step === "input" && (
            <motion.div key="phone" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="w-full max-w-sm space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">{t("phoneNumber")}</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
                  <span className="text-sm font-semibold text-muted-foreground">🇪🇹 +251</span>
                  <input type="tel" placeholder="9XX XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-sm" />
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <button onClick={handleSendOTP} disabled={phone.length < 9 || loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-40 glow-green">
                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <>{t("sendCode")}<ArrowRight className="h-4 w-4" /></>}
              </button>
            </motion.div>
          )}

          {mode === "phone" && step === "otp" && (
            <motion.div key="otp" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="w-full max-w-sm space-y-5">
              <p className="text-sm text-muted-foreground text-center">{t("codeSentTo")} +251{phone}</p>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-12 w-10 rounded-lg border-border bg-card text-foreground text-lg font-bold" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <button onClick={handleVerifyOTP} disabled={otp.length < 6 || loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-40 glow-green">
                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <>{t("verify")}<Shield className="h-4 w-4" /></>}
              </button>
              <button onClick={() => { setStep("input"); setOtp(""); }} className="w-full text-center text-sm text-muted-foreground">{t("goBack")}</button>
            </motion.div>
          )}

          {mode === "email" && (
            <motion.div key="email" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="w-full max-w-sm space-y-4">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent text-foreground outline-none text-sm" />
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-border bg-card p-3 text-foreground outline-none text-sm" />
              <button onClick={handleEmailAuth} disabled={loading || !email || !password} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-40 glow-green">
                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : (isSignup ? "ተመዝገብ" : "ግባ")}
              </button>
              <button onClick={() => setIsSignup(!isSignup)} className="w-full text-xs text-muted-foreground">
                {isSignup ? "አካውንት አለህ? ግባ" : "አካውንት የለህም? ተመዝገብ"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-sm mt-5">
          <div className="flex items-center gap-3 my-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ወይም</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            በ Google ግባ
          </button>
        </div>
      </div>
      <div className="pb-6 text-center text-xs text-muted-foreground">{t("termsAccept")}</div>
    </div>
  );
};

export default LoginPage;
