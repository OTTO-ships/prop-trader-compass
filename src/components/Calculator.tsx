import { useState, useMemo } from "react";
import { DollarSign, TrendingDown, AlertTriangle } from "lucide-react";

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

        {/* Risk Card */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-destructive/40 bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest">
                Daily Loss Limit
              </h3>
            </div>
            <p className="font-mono text-3xl font-bold text-destructive">
              {fmt(calculations.dailyLossLimit)}
            </p>
            <p className="text-xs text-muted-foreground">
              Max loss allowed per day before violation
            </p>
          </div>

          <div className="rounded-lg border border-warning/40 bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-warning">
              <TrendingDown className="h-4 w-4" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest">
                Max Drawdown
              </h3>
            </div>
            <p className="font-mono text-3xl font-bold text-warning">
              {fmt(calculations.maxLossLimit)}
            </p>
            <p className="text-xs text-muted-foreground">
              Total loss before account breach
            </p>
          </div>
        </section>

        {/* Health Meter */}
        <section className="rounded-lg border border-border/40 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
              Risk / Reward Health
            </h3>
            <span className="font-mono text-sm text-muted-foreground">
              {calculations.healthPct.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, calculations.healthPct)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
            <span>Drawdown Zone</span>
            <span>Profit Target</span>
          </div>
        </section>

        {/* Payout Estimator */}
        <section className="rounded-lg border border-border/40 bg-card p-5 space-y-5">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
            Payout Estimator
          </h2>

          {/* Profit Split Toggle */}
          <div className="flex gap-2">
            {([80, 90] as const).map((split) => (
              <button
                key={split}
                onClick={() => setProfitSplit(split)}
                className={`flex-1 rounded-md border py-3 font-mono text-sm font-semibold transition-all ${
                  profitSplit === split
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/40 bg-secondary text-muted-foreground hover:border-primary/60"
                }`}
              >
                {split}/{100 - split} Split
              </button>
            ))}
          </div>

          {/* Payout Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/20">
              <span className="text-sm text-muted-foreground">Gross Profit</span>
              <span className="font-mono font-semibold">{fmt(calculations.targetProfit)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/20">
              <span className="text-sm text-muted-foreground">
                Firm Commission ({100 - profitSplit}%)
              </span>
              <span className="font-mono font-semibold text-destructive">
                -{fmt(calculations.firmCut)}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-success" />
                Your Take-Home
              </span>
              <span className="font-mono text-2xl font-bold text-success">
                {fmt(calculations.traderPayout)}
              </span>
            </div>
          </div>
        </section>

        {/* Funding Deals Section */}
        <section className="rounded-lg border border-border/40 bg-card p-5 space-y-4">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
            Institutional Funding Deals & Reviews
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Get 80% Off Apex", href: "#" },
              { label: "Topstep Review", href: "#" },
              { label: "FTMO Discount Codes", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block rounded-md bg-primary px-4 py-3.5 text-center font-mono text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <footer className="pb-8 pt-2 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            For educational purposes only · Not financial advice
          </p>
        </footer>
      </main>
    </div>
  );
}
