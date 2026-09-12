/**
 * تنسيق التاريخ للعرض بالواجهة — يدعم string ISO أو Date object.
 * بيرجع تنسيق قصير مقروء (يوم/شهر/سنة) مع دعم التقويم الميلادي بالأرقام اللاتينية.
 */
export function formatDate(value) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return "—";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * نسخة موسّعة فيها الوقت أيضًا — للاستخدام لما نحتاج نعرض ساعة الإنشاء/التعديل بالتفصيل.
 */
export function formatDateTime(value) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return "—";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}