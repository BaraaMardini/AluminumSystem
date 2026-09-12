import { useSourceOptions } from "../hooks/useSourceOptions";
import Figures from "./Figures";

/**
 * عناصر مشتركة لصفحات التقارير (Report_* Entities) — فلاتر، Dropdown مصدره
 * Entity ثاني، شريط نسبة مئوية مصغّر للجداول، نسخة كبيرة منه للوحات ملخّص،
 * وكرت KPI بسيط. كل صفحة تقرير جديدة تستورد من هون بدل ما تعيد كتابتهن.
 */

export function SourceSelect({ source, value, onChange, placeholder = "الكل" }) {
  const { options, loading } = useSourceOptions(source);
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-stone-200 bg-white px-3 py-2 text-[13px] text-ink-900 outline-none focus-visible:outline focus-visible:outline-2"
      style={{ outlineColor: "var(--color-copper-500)" }}
    >
      <option value="">{loading ? "جارٍ التحميل..." : placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function FilterField({ field, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-[11.5px] font-medium text-ink-500">{field.label}</label>
      {field.source ? (
        <SourceSelect source={field.source} value={value} onChange={onChange} />
      ) : (
        <input
          type={field.type === "date" ? "date" : field.type === "number" || field.type === "int" ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-stone-200 bg-white px-3 py-2 text-[13px] text-ink-900 outline-none focus-visible:outline focus-visible:outline-2"
          style={{ outlineColor: "var(--color-copper-500)" }}
        />
      )}
    </div>
  );
}

export function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** شريط نسبة رفيع — للاستخدام جوا خلايا الجدول. */
export function PercentBar({ value, tone = "copper" }) {
  const pct = Math.max(0, Math.min(100, toNumber(value)));
  const color = tone === "danger" ? "var(--color-status-danger)" : "var(--color-copper-600)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden bg-stone-150" style={{ borderRadius: "1px" }}>
        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color, borderRadius: "1px" }} />
      </div>
      <span dir="ltr" className="inline-block text-[12px] text-ink-700">
        <Figures>{pct.toFixed(1)}%</Figures>
      </span>
    </div>
  );
}

/** نسخة كبيرة من شريط النسبة — لكروت ملخّص/داشبورد. */
export function PercentHero({ label, value, tone = "copper", icon: Icon }) {
  const pct = Math.max(0, Math.min(100, toNumber(value)));
  const color = tone === "danger" ? "var(--color-status-danger)" : "var(--color-copper-600)";
  return (
    <div className="border border-stone-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-ink-500">{label}</span>
        {Icon && <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />}
      </div>
      <p dir="ltr" className="font-display mb-3 text-[28px] font-bold text-ink-900">
        <Figures>{pct.toFixed(1)}%</Figures>
      </p>
      <div className="h-2 w-full overflow-hidden bg-stone-150" style={{ borderRadius: "1px" }}>
        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color, borderRadius: "1px" }} />
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div className="flex items-center gap-3 border border-stone-200 bg-white px-4 py-3.5">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center"
        style={{ backgroundColor: tone === "danger" ? "var(--color-status-danger-bg)" : "var(--color-copper-50)" }}
      >
        <Icon
          className="h-4 w-4"
          style={{ color: tone === "danger" ? "var(--color-status-danger)" : "var(--color-copper-600)" }}
          strokeWidth={1.8}
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] text-ink-500">{label}</p>
        <p dir="ltr" className="font-display text-[16px] font-bold text-ink-900">
          <Figures>{value}</Figures>
        </p>
      </div>
    </div>
  );
}