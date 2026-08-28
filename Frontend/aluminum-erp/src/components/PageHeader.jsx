/**
 * ترويسة صفحة قياسية: عنوان + وصف مختصر + عناصر إجراء اختيارية (فلاتر/أزرار).
 */
export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-[22px] font-bold text-ink-900">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
