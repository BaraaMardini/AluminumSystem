import { TrendingUp, TrendingDown } from "lucide-react";
import Figures from "./Figures";

/**
 * بطاقة مؤشر أداء رئيسي (KPI) — حدود دقيقة وتباين هادئ
 * بدلاً من الظلال والتدرجات المبالغ فيها.
 */
export default function KpiCard({ icon: Icon, title, value, unit, trend, trendLabel, trendDirection = "up" }) {
  const isPositive = trendDirection === "up";

  return (
    <div className="group relative overflow-hidden border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(30,26,21,0.04)] transition-all hover:border-stone-300 hover:shadow-[0_4px_16px_rgba(30,26,21,0.06)]">
      <div
        className="absolute inset-x-0 top-0 h-[3px] scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ backgroundColor: "var(--color-copper-500)" }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-ink-500">{title}</span>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center border"
          style={{ backgroundColor: "var(--color-copper-50)", borderColor: "var(--color-copper-100)" }}
        >
          <Icon className="h-[18px] w-[18px]" style={{ color: "var(--color-copper-600)" }} strokeWidth={1.7} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <Figures className="text-[30px] font-semibold leading-none text-ink-900">{value}</Figures>
        {unit && <span className="text-sm text-ink-500">{unit}</span>}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className="flex items-center gap-1 font-medium"
            style={{ color: isPositive ? "var(--color-status-success)" : "var(--color-status-danger)" }}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" strokeWidth={2} />
            )}
            <Figures>{trend}</Figures>
          </span>
          <span className="text-ink-500">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
