import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight, Shield } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const LoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.length < 9) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (otp.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Ethiopian flag stripe */}
      <div className="h-1.5 gradient-ethiopia-h w-full" />

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl gradient-ethiopia glow-green">
            <span className="text-3xl font-black text-secondary-foreground">አ</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Agegnehu</h1>
          <p className="mt-1 text-sm text-muted-foreground">የኢትዮጵያ ቪዲዮ ማህበረሰብ</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.div
              key="phone"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="w-full max-w-sm space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  ስልክ ቁጥር
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <span className="text-sm font-semibold text-muted-foreground">🇪🇹 +251</span>
                  <input
                    type="tel"
                    placeholder="9XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-sm"
                  />
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={phone.length < 9 || loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 glow-green"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>
                    ኮድ ላክ
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                <Shield className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground">
                  SMS በFirebase የተረጋገጠ ደህንነት ያለው ነው
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="w-full max-w-sm space-y-5"
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  ኮድ ወደ +251{phone} ተልኳል
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-12 w-10 rounded-lg border-border bg-card text-foreground text-lg font-bold"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={otp.length < 6 || loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 glow-green"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>
                    አረጋግጥ
                    <Shield className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => { setStep("phone"); setOtp(""); }}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← ተመለስ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-6 text-center text-xs text-muted-foreground">
        በመቀጠል የአገልግሎት ውሎችን ይቀበላሉ
      </div>
    </div>
  );
};

export default LoginPage;
