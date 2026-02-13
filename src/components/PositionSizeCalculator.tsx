import { useState, useMemo } from "react";
import AnimatedNumber from "./AnimatedNumber";

type AssetCategory = "forex" | "futures" | "cfd" | "commodities";

interface AssetPreset {
  label: string;
  category: AssetCategory;
  tickSize: number;
  tickValue: number;
  unit: string;
}

const ASSET_PRESETS: AssetPreset[] = [
  // Forex
  { label: "EUR/USD", category: "forex", tickSize: 0.0001, tickValue: 10, unit: "pips" },
  { label: "GBP/USD", category: "forex", tickSize: 0.0001, tickValue: 10, unit: "pips" },
  { label: "USD/JPY", category: "forex", tickSize: 0.01, tickValue: 6.67, unit: "pips" },
  // Futures
  { label: "ES (E-mini S&P)", category: "futures", tickSize: 0.25, tickValue: 12.5, unit: "ticks" },
  { label: "NQ (E-mini Nasdaq)", category: "futures", tickSize: 0.25, tickValue: 5, unit: "ticks" },
  { label: "MES (Micro S&P)", category: "futures", tickSize: 0.25, tickValue: 1.25, unit: "ticks" },
  { label: "MNQ (Micro Nasdaq)", category: "futures", tickSize: 0.25, tickValue: 0.5, unit: "ticks" },
  { label: "YM (Dow Futures)", category: "futures", tickSize: 1, tickValue: 5, unit: "ticks" },
  // Commodities
  { label: "CL (Crude Oil)", category: "commodities", tickSize: 0.01, tickValue: 10, unit: "ticks" },
  { label: "GC (Gold)", category: "commodities", tickSize: 0.1, tickValue: 10, unit: "ticks" },
  { label: "SI (Silver)", category: "commodities", tickSize: 0.005, tickValue: 25, unit: "ticks" },
  { label: "NG (Natural Gas)", category: "commodities", tickSize: 0.001, tickValue: 10, unit: "ticks" },
  // CFDs
  { label: "US500 (S&P CFD)", category: "cfd", tickSize: 0.01, tickValue: 1, unit: "points" },
  { label: "US100 (Nasdaq CFD)", category: "cfd", tickSize: 0.01, tickValue: 1, unit: "points" },
  { label: "XAUUSD (Gold CFD)", category: "cfd", tickSize: 0.01, tickValue: 1, unit: "points" },
  { label: "USOIL (Oil CFD)", category: "cfd", tickSize: 0.01, tickValue: 1, unit: "points" },
];

const CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: "futures", label: "Futures" },
  { value: "commodities", label: "Commodities" },
  { value: "cfd", label: "CFDs" },
  { value: "forex", label: "Forex" },
];

export default function PositionSizeCalculator() {
  const [accountSize, setAccountSize] = useState(100000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopLossUnits, setStopLossUnits] = useState(20);
  const [activeCategory, setActiveCategory] = useState<AssetCategory>("futures");
  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);

  const filteredAssets = useMemo(
    () => ASSET_PRESETS.filter((a) => a.category === activeCategory),
    [activeCategory]
  );

  const asset = filteredAssets[selectedAssetIdx] || filteredAssets[0];

  const { riskDollars, contracts } = useMemo(() => {
    const riskDollars = accountSize * (riskPct / 100);
    const riskPerContract = stopLossUnits * asset.tickValue;
    const contracts = riskPerContract > 0 ? riskDollars / riskPerContract : 0;
    return { riskDollars, contracts };
  }, [accountSize, riskPct, stopLossUnits, asset]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const contractLabel =
    activeCategory === "forex" ? "lots" : activeCategory === "futures" || activeCategory === "commodities" ? "contracts" : "units";

  return (
    <section className="rounded-lg border border-border/40 bg-card p-5 space-y-5">
      <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
        Position Size Calculator
      </h2>

      {/* Category Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setActiveCategory(cat.value); setSelectedAssetIdx(0); }}
            className={`rounded-md border px-3 py-2 font-mono text-xs font-semibold transition-all ${
              activeCategory === cat.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/40 bg-secondary text-muted-foreground hover:border-primary/60"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Asset Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Instrument
        </label>
        <select
          value={selectedAssetIdx}
          onChange={(e) => setSelectedAssetIdx(Number(e.target.value))}
          className="w-full rounded-md border border-border bg-input px-3 py-3.5 font-mono text-sm font-semibold text-foreground outline-none transition-all focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
        >
          {filteredAssets.map((a, i) => (
            <option key={a.label} value={i}>{a.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Account Size", value: accountSize, onChange: setAccountSize, prefix: "$" },
          { label: "Risk Per Trade", value: riskPct, onChange: setRiskPct, suffix: "%" },
          { label: `Stop Loss (${asset.unit})`, value: stopLossUnits, onChange: setStopLossUnits },
          { label: `Tick Value ($)`, value: asset.tickValue, onChange: () => {}, prefix: "$", disabled: true },
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
                disabled={'disabled' in field && field.disabled}
                className="w-full rounded-md border border-border bg-input px-3 py-3.5 text-right font-mono text-lg font-semibold text-foreground outline-none transition-all focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
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
          <AnimatedNumber value={riskDollars} formatter={fmt} className="font-mono font-semibold text-destructive" />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-semibold">Recommended Size</span>
          <AnimatedNumber
            value={contracts}
            formatter={(n) => `${n.toFixed(2)} ${contractLabel}`}
            className="font-mono text-2xl font-bold text-primary"
          />
        </div>
      </div>
    </section>
  );
}
