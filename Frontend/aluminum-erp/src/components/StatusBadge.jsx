const STATUS_STYLES = {
  مكتملة: {
    text: "var(--color-status-success)",
    bg: "var(--color-status-success-bg)",
  },
  "قيد التنفيذ": {
    text: "var(--color-status-progress)",
    bg: "var(--color-status-progress-bg)",
  },
  "قيد الانتظار": {
    text: "var(--color-status-pending)",
    bg: "var(--color-status-pending-bg)",
  },
  متأخرة: {
    text: "var(--color-status-danger)",
    bg: "var(--color-status-danger-bg)",
  },
  نشط: {
    text: "var(--color-status-success)",
    bg: "var(--color-status-success-bg)",
  },
  "غير نشط": {
    text: "var(--color-status-pending)",
    bg: "var(--color-status-pending-bg)",
  },
};

/**
 * شارة حالة صغيرة تُستخدم في الجداول والبطاقات.
 * تعتمد على قاموس ثابت من الحالات العربية الشائعة في النظام.
 */
export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? {
    text: "var(--color-ink-500)",
    bg: "var(--color-stone-150)",
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap"
      style={{ color: style.text, backgroundColor: style.bg, borderColor: "transparent" }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: style.text }} aria-hidden="true" />
      {status}
    </span>
  );
}