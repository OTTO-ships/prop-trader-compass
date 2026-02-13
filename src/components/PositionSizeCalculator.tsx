import { useState, useMemo } from "react";

export default function PositionSizeCalculator() {
  const [accountSize, setAccountSize] = useState(100000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(50);
  const [pipValue, setPipValue] = useState(10);

  const { riskDollars, lotSize } = useMemo(() => {
    const riskDollars = accountSize * (riskPct / 100);
    const lotSize = stopLossPips > 0 && pipValue > 0 ? riskDollars / (stopLossPips * pipValue) : 0;
    return { riskDollars, lotSize };
  }, [accountSize, riskPct, stopLossPips, pipValue]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <section className="rounded-lg border border-border/40 bg-card p-5 space-y-5">
      <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
        Position Size Calculator
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Account Size", value: accountSize, onChange: setAccountSize, prefix: "$" },
          { label: "Risk Per Trade", value: riskPct, onChange: setRiskPct, suffix: "%" },
          { label: "Stop Loss (pips)", value: stopLossPips, onChange: setStopLossPips },
          { label: "Pip Value ($)", value: pipValue, onChange: setPipValue, prefix: "$" },
        ].map((field) => (
          <div key={field.label} className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {field.label}
            </label>
            <div className="relative flex items-center">
              {field.prefix && (
                <span className="absolute left-3 text-sm font-mono text-muted-foreground">
                  {field.prefix}
                </span>
              )}
              <input
                type="number"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-input px-3 py-3.5 text-right font-mono text-lg font-semibold text-foreground outline-none transition-all focus:ring-2 focus:ring-ring focus:border-transparent"
                style={{ paddingLeft: field.prefix ? "2.5rem" : "0.75rem" }}
              />
              {field.suffix && (
                <span className="absolute right-3 text-sm font-mono text-muted-foreground">
                  {field.suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3 pt-2 border-t border-border/20">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">Risk Amount</span>
          <span className="font-mono font-semibold text-destructive">{fmt(riskDollars)}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-semibold">Recommended Lot Size</span>
          <span className="font-mono text-2xl font-bold text-primary">
            {lotSize.toFixed(2)} lots
          </span>
        </div>
      </div>
    </section>
  );
}
