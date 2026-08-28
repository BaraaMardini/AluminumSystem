import Figures from "../components/Figures";

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-stone-200 px-4 py-3.5 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-1.5 text-xs text-ink-500 sm:flex-row">
        <p>
          <span className="font-display font-semibold text-ink-700">AluminumProductionSystem</span> — نظام إدارة الإنتاج الصناعي
        </p>
        <Figures>الإصدار 1.0</Figures>
      </div>
    </footer>
  );
}