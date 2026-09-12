import Figures from "./Figures";

const SEGMENT_COUNT = 28;

/**
 * تمثيل بصري لمرحلة إنتاج على هيئة "عداد" مجزّأ بقراءة رقمية غامقة،
 * يذكّر بعدادات خطوط الإنتاج الصناعية الفعلية، بدلاً من شريط تقدّم نمطي.
 * ترقيم المراحل (٠١ / ٠٢ / ٠٣) هنا له معنى فعلي: يعكس تسلسل خط الإنتاج الحقيقي.
 */
export default function ProgressCard({ index, name, percentage, produced, target, status }) {
  const filledSegments = Math.round((percentage / 100) * SEGMENT_COUNT);

  return (
    <div className="border border-stone-200 bg-white">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2.5">
          <Figures className="text-[11px] font-semibold text-stone-400">
            {String(index).padStart(2, "0")}
          </Figures>
          <div>
            <h3 className="font-display text-[14px] font-bold text-ink-900">{name}</h3>
            <p className="mt-0.5 text-[11px] text-ink-500">{status}</p>
          </div>
        </div>

        <div
          className="flex items-baseline gap-0.5 px-2.5 py-1"
          style={{ backgroundColor: "var(--color-graphite-950)" }}
        >
          <Figures
            className="text-lg font-semibold leading-none"
            style={{ color: "var(--color-copper-400)" }}
          >
            {percentage}
          </Figures>
          <span className="text-[11px] font-medium text-graphite-400">%</span>
        </div>
      </div>

      <div
        className="mt-4 flex h-7 items-end gap-[2.5px] px-4"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name}: ${percentage}%`}
      >
        {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
          const filled = i < filledSegments;
          return (
            <span
              key={i}
              className="flex-1 transition-colors"
              style={{
                height: filled ? "100%" : "50%",
                backgroundColor: filled ? "var(--color-copper-500)" : "var(--color-stone-200)",
              }}
            />
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-stone-150 px-4 py-3 text-[11.5px] text-ink-500">
        <span>الكمية المنجزة</span>
        <Figures className="font-medium text-ink-700">
          {produced.toLocaleString("en-US")} / {target.toLocaleString("en-US")}
        </Figures>
      </div>
    </div>
  );
}
