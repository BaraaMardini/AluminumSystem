import { Construction } from "lucide-react";
import PageHeader from "./PageHeader";

/**
 * صفحة نائبة موحدة لأي مسار لم تُبنَ واجهته بعد.
 */
export default function PlaceholderPage({ title, description, message }) {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <PageHeader title={title} description={description} />

      <div className="industrial-grid flex flex-col items-center justify-center gap-4 border border-dashed border-stone-300 bg-white px-6 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center border" style={{ backgroundColor: "var(--color-stone-50)", borderColor: "var(--color-stone-200)" }}>
          <Construction className="h-6 w-6" style={{ color: "var(--color-stone-500)" }} strokeWidth={1.5} />
        </div>
        <div className="max-w-sm">
          <p className="text-sm font-medium text-ink-700">{message}</p>
          <p className="mt-1.5 text-xs text-ink-500">هذا القسم قيد الإعداد ضمن خطة تطوير النظام.</p>
        </div>
      </div>
    </div>
  );
}
