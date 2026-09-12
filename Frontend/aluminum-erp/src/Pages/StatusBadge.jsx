// src/components/StatusBadge.jsx

// قاموس الحالات → الفئة اللونية الدلالية (بند 5.5: أضف الحالات الجديدة هون بدل بناء شارة من الصفر)
const STATUS_STYLES = {
  "قيد الانتظار": {
    dot: "bg-[var(--color-status-pending)]",
    bg: "bg-[var(--color-status-pending-bg)]",
    text: "text-[var(--color-status-pending)]",
  },
  "قيد التنفيذ": {
    dot: "bg-[var(--color-status-progress)]",
    bg: "bg-[var(--color-status-progress-bg)]",
    text: "text-[var(--color-status-progress)]",
  },
  "مكتملة": {
    dot: "bg-[var(--color-status-success)]",
    bg: "bg-[var(--color-status-success-bg)]",
    text: "text-[var(--color-status-success)]",
  },
  "متوقفة": {
    dot: "bg-[var(--color-status-pending)]",
    bg: "bg-[var(--color-status-pending-bg)]",
    text: "text-[var(--color-status-pending)]",
  },
  "ملغاة": {
    dot: "bg-[var(--color-status-danger)]",
    bg: "bg-[var(--color-status-danger-bg)]",
    text: "text-[var(--color-status-danger)]",
  },
  // حالات مشروع الألمنيوم الإضافية (Statuses entity: مفعّلة/غير مفعّلة)
  "مفعّلة": {
    dot: "bg-[var(--color-status-success)]",
    bg: "bg-[var(--color-status-success-bg)]",
    text: "text-[var(--color-status-success)]",
  },
  "غير مفعّلة": {
    dot: "bg-[var(--color-status-danger)]",
    bg: "bg-[var(--color-status-danger-bg)]",
    text: "text-[var(--color-status-danger)]",
  },
};

// فئة افتراضية محايدة لأي حالة نصية غير مسجّلة بالقاموس فوق
// (بدل ما تنكسر الصفحة، بتظهر شارة رمادية عادية بدل ما ترمي خطأ)
const FALLBACK_STYLE = {
  dot: "bg-[var(--color-ink-500)]",
  bg: "bg-[var(--color-stone-100)]",
  text: "text-[var(--color-ink-700)]",
};

export default function StatusBadge({ status }) {
  if (!status) return <span className="text-sm text-[var(--color-ink-500)]">—</span>;

  const style = STATUS_STYLES[status] || FALLBACK_STYLE;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-[var(--color-stone-200)] px-2 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}