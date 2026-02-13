import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

export default function PropFirmPartnerDashboard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("20TNT");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
        Prop Firm Partner Dashboard
      </h2>

      {/* Featured TTP Card */}
      <div className="relative rounded-lg border border-primary bg-card p-5 space-y-4">
        {/* Badge */}
        <span className="absolute -top-3 right-4 rounded-full border border-primary bg-background px-3 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-widest text-primary">
          Top Rated: Futures &amp; CFDs
        </span>

        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-foreground pt-2">
          The Trading Pit (TTP)
        </h3>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Institutional Futures &amp; CFD Funding
        </p>

        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Trade E-minis, Crude Oil, and Gold
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Deep Liquidity for CFD Traders
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Up to 80% Profit Split
          </li>
        </ul>

        {/* CTA + Discount Code */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="https://affiliate.thetradingpit.com/visit/?bta=35884&nci=5659"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3.5 font-mono text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Claim 20% Discount &amp; Start Challenge
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-md border border-primary bg-background px-5 py-3.5 font-mono text-sm font-bold text-foreground transition-all hover:bg-primary/10 active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-primary" />
                <span className="text-primary">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-muted-foreground" />
                <span>20TNT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Partners */}
      {/* Partners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="https://truenorthtradr.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-md bg-primary px-4 py-3.5 text-center font-mono text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          View Verified Payout Proofs &amp; Rankings
        </a>
        <a
          href="https://truenorthtradr.com/prop-experience"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-md bg-primary px-4 py-3.5 text-center font-mono text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Compare 50+ Firms by Payout Speed &amp; Slippage
        </a>
      </div>
    </section>
  );
}
