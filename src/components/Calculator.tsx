import { useState, useMemo } from "react";
import { DollarSign, TrendingDown, AlertTriangle, Info } from "lucide-react";
import PositionSizeCalculator from "./PositionSizeCalculator";
import PropFirmPartnerDashboard from "./PropFirmPartnerDashboard";
import AnimatedNumber from "./AnimatedNumber";
import ScrollFade from "./ScrollFade";

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
}

const InputField = ({ label, value, onChange, prefix, suffix, icon }: InputFieldProps) => (
  <div className="space-y-2">
    <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
      {label}
    </label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-sm font-mono text-muted-foreground">{prefix}</span>
      )}
      {icon && <span className="absolute left-3 text-muted-foreground">{icon}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-border bg-input px-3 py-3.5 text-right font-mono text-lg font-semibold text-foreground outline-none transition-all focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
        style={{ paddingLeft: prefix || icon ? "2.5rem" : "0.75rem" }}
      />
      {suffix && (
        <span className="absolute right-3 text-sm font-mono text-muted-foreground">{suffix}</span>
      )}
    </div>
  </div>
);

export default function Calculator() {
  const [accountSize, setAccountSize] = useState(100000);
  const [dailyDD, setDailyDD] = useState(5);
  const [maxDD, setMaxDD] = useState(10);
  const [profitTarget, setProfitTarget] = useState(10);
  const [profitSplit, setProfitSplit] = useState<80 | 90>(80);

  const calculations = useMemo(() => {
    const dailyLossLimit = accountSize * (dailyDD / 100);
    const maxLossLimit = accountSize * (maxDD / 100);
    const targetProfit = accountSize * (profitTarget / 100);
    const firmCut = targetProfit * ((100 - profitSplit) / 100);
    const traderPayout = targetProfit * (profitSplit / 100);
    const healthPct = Math.min(100, (profitTarget / maxDD) * 100);
    return { dailyLossLimit, maxLossLimit, targetProfit, firmCut, traderPayout, healthPct };
  }, [accountSize, dailyDD, maxDD, profitTarget, profitSplit]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation CTA */}
      <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm px-4 py-3 text-center border-b border-border/30">
        <a
          href="https://truenorthtradr.com/detailed-stats"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md border-2 border-primary bg-transparent px-5 py-2.5 font-mono text-sm font-semibold text-foreground transition-all hover:bg-primary hover:text-primary-foreground cta-ghost-glow cta-shimmer"
        >
          📊 View 2026 Prop Firm Rankings &amp; Verified Payouts
        </a>
      </div>

      {/* Header */}
      <header className="border-b border-border/30 px-4 py-5">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            <h1 className="font-mono text-sm font-bold uppercase tracking-[0.2em]">
              Prop Firm Risk Calculator
            </h1>
          </div>
          <span className="hidden sm:block text-xs text-muted-foreground font-mono">LIVE</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-3xl">
        {/* Input Section */}
        <ScrollFade>
        <section className="rounded-lg border border-border/40 bg-card p-5 space-y-5">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
            Account Parameters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Account Size"
              value={accountSize}
              onChange={setAccountSize}
              prefix="$"
            />
            <InputField
              label="Daily Drawdown"
              value={dailyDD}
              onChange={setDailyDD}
              suffix="%"
            />
            <InputField
              label="Max Overall Drawdown"
              value={maxDD}
              onChange={setMaxDD}
              suffix="%"
            />
            <InputField
              label="Profit Target"
              value={profitTarget}
              onChange={setProfitTarget}
              suffix="%"
            />
          </div>
        </section>
        </ScrollFade>

        {/* Risk Card */}
        <ScrollFade delay={80}>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-destructive/40 bg-card p-5 space-y-3">
...
          </div>
        </section>
        </ScrollFade>

        {/* Health Meter */}
        <ScrollFade delay={100}>
        <section className="rounded-lg border border-border/40 bg-card p-5 space-y-4">
...
        </section>
        </ScrollFade>

        {/* Payout Estimator */}
        <ScrollFade delay={120}>
        <section className="rounded-lg border border-border/40 bg-card p-5 space-y-5">
...
        </section>
        </ScrollFade>

        {/* Pro-Tip Box */}
        <ScrollFade delay={140}>
        <div className="rounded-lg border border-primary bg-background p-4 space-y-2">
...
        </div>
        </ScrollFade>

        {/* Position Size Calculator */}
        <ScrollFade delay={160}>
        <PositionSizeCalculator />
        </ScrollFade>

        {/* Prop Firm Partner Dashboard */}
        <ScrollFade delay={180}>
        <PropFirmPartnerDashboard />
        </ScrollFade>

        <footer className="pb-8 pt-2 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            For educational purposes only · Not financial advice
          </p>
        </footer>
      </main>
    </div>
  );
}
