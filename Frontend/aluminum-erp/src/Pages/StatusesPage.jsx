import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, X, AlertCircle, CheckCircle2, ListChecks } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Figures from "../components/Figures";
import useStatusesStore from "../stores/StatusesStore";
import { statusesEntity } from "../entities/StatusesEntity";

const config = statusesEntity;
const { operations } = config;
const columns = operations.getAll?.columns ?? [];
const keyField = operations.update?.by || operations.delete?.by || config.idField || "id";
const hasSearch = Boolean(operations.search);
const hasAdd = Boolean(operations.add);
const hasUpdate = Boolean(operations.update);
const hasDelete = Boolean(operations.delete);
const hasActionsColumn = hasUpdate || hasDelete;

const PAGE_TITLE = config.title || "الحالات";
const PAGE_DESCRIPTION = config.description || "إدارة قائمة الحالات المستخدمة بالنظام.";
const ADD_LABEL = config.addLabel || "إضافة حالة";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * صفحة إدارة الحالات — Add + Update فقط (لا يوجد Search ولا Delete بالـ Entity Config الحالي).
 */
export default function StatusesPage() {
  const { getAllState, fetchAll, add, addState, update, updateState } = useStatusesStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [activeRow, setActiveRow] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  const prevAddLoading = useRef(false);
  const prevUpdateLoading = useRef(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function showToast(type, message) {
    setToast({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  // مراقبة نتيجة الإضافة
  useEffect(() => {
    if (prevAddLoading.current && !addState.loading) {
      if (addState.errorCode === 0) {
        showToast("success", addState.message || "تمت إضافة الحالة بنجاح.");
        closeModal();
        fetchAll();
      } else {
        showToast("error", addState.message || "تعذّرت إضافة الحالة.");
      }
    }
    prevAddLoading.current = addState.loading;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addState.loading]);

  // مراقبة نتيجة التعديل
  useEffect(() => {
    if (prevUpdateLoading.current && !updateState.loading) {
      if (updateState.errorCode === 0) {
        showToast("success", updateState.message || "تم تعديل الحالة بنجاح.");
        closeModal();
        fetchAll();
      } else {
        showToast("error", updateState.message || "تعذّر تعديل الحالة.");
      }
    }
    prevUpdateLoading.current = updateState.loading;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState.loading]);

  function openAddModal() {
    setModalMode("add");
    setActiveRow(null);
    const initial = {};
    (operations.add?.fields || []).forEach((f) => {
      initial[f.name] = f.type === "checkbox" ? false : "";
    });
    setFormValues(initial);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEditModal(row) {
    setModalMode("edit");
    setActiveRow(row);
    const initial = {};
    (operations.update?.fields || []).forEach((f) => {
      initial[f.name] = row[f.name] ?? (f.type === "checkbox" ? false : "");
    });
    setFormValues(initial);
    setFormErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setActiveRow(null);
    setFormValues({});
    setFormErrors({});
  }

  function getActiveFields() {
    return modalMode === "add" ? operations.add?.fields || [] : operations.update?.fields || [];
  }

  function validate(fields) {
    const errors = {};
    fields.forEach((field) => {
      const value = formValues[field.name];
      if (field.type === "checkbox") return;
      if (field.required && (value === undefined || value === null || String(value).trim() === "")) {
        errors[field.name] = "هذا الحقل مطلوب.";
        return;
      }
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errors[field.name] = "صيغة البريد الإلكتروني غير صحيحة.";
      }
      if (field.type === "number" && value !== "" && value !== undefined && Number.isNaN(Number(value))) {
        errors[field.name] = "يجب إدخال رقم صحيح.";
      }
    });
    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const fields = getActiveFields();
    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {};
    fields.forEach((field) => {
      payload[field.name] = formValues[field.name];
    });

    if (modalMode === "add") {
      add(payload);
    } else {
      const keyValue = activeRow?.[keyField];
      update(keyValue, payload);
    }
  }

  const rows = getAllState.data || [];
  const isLoading = getAllState.loading;
  const isSubmitting = modalMode === "add" ? addState.loading : updateState.loading;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          hasAdd && (
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 px-3.5 py-2 text-[13.5px] font-medium text-white"
              style={{ backgroundColor: "var(--color-copper-600)" }}
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              {ADD_LABEL}
            </button>
          )
        }
      />

      {!hasSearch && null /* لا يوجد فلاتر — الـ Entity Config الحالي بدون search */}

      <div className="mt-4 overflow-x-auto border border-stone-200 bg-white">
        <table className="w-full min-w-[720px] border-collapse text-right">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              {columns.map((col) => (
                <th
                  key={col.field}
                  className="px-4 py-2.5 text-[11.5px] font-medium text-ink-500"
                >
                  {col.header}
                </th>
              ))}
              {hasActionsColumn && (
                <th className="px-4 py-2.5 text-[11.5px] font-medium text-ink-500">إجراءات</th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b border-stone-100">
                  {columns.map((col) => (
                    <td key={col.field} className="px-4 py-3">
                      <div className="h-3.5 w-24 animate-pulse bg-stone-150" />
                    </td>
                  ))}
                  {hasActionsColumn && (
                    <td className="px-4 py-3">
                      <div className="h-3.5 w-12 animate-pulse bg-stone-150" />
                    </td>
                  )}
                </tr>
              ))}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (hasActionsColumn ? 1 : 0)}
                  className="px-4 py-12 text-center text-[13px] text-ink-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ListChecks className="h-6 w-6 text-ink-500/50" strokeWidth={1.5} />
                    <span>لا يوجد بيانات بعد.</span>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading &&
              rows.map((row) => (
                <tr key={row[keyField]} className="border-b border-stone-100 hover:bg-stone-50">
                  {columns.map((col) => (
                    <td key={col.field} className="px-4 py-3 text-[13px] text-ink-700">
                      {renderCell(row, col)}
                    </td>
                  ))}
                  {hasActionsColumn && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {hasUpdate && (
                          <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            aria-label="تعديل"
                            className="p-1.5 text-ink-500 hover:bg-stone-150 hover:text-ink-900"
                          >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="animate-fade-in flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3.5">
              <h3 className="font-display text-[15px] font-bold text-ink-900">
                {modalMode === "add" ? ADD_LABEL : "تعديل الحالة"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="إغلاق"
                className="p-1 text-ink-500 hover:bg-stone-150 hover:text-ink-900"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-5 py-4">
              {getActiveFields().map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formValues[field.name]}
                  error={formErrors[field.name]}
                  onChange={(value) =>
                    setFormValues((prev) => ({ ...prev, [field.name]: value }))
                  }
                />
              ))}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3.5 py-2 text-[13.5px] text-ink-600 hover:bg-stone-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-2 text-[13.5px] font-medium text-white disabled:opacity-60"
                  style={{ backgroundColor: "var(--color-graphite-950)" }}
                >
                  {isSubmitting ? "جارٍ الحفظ..." : "حفظ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="animate-fade-in fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 items-center gap-2 border px-4 py-2.5 text-[13px]"
          style={
            toast.type === "success"
              ? {
                  color: "var(--color-status-success)",
                  backgroundColor: "var(--color-status-success-bg)",
                  borderColor: "transparent",
                }
              : {
                  color: "var(--color-status-danger)",
                  backgroundColor: "var(--color-status-danger-bg)",
                  borderColor: "transparent",
                }
          }
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />
          ) : (
            <AlertCircle className="h-4 w-4" strokeWidth={1.8} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

function renderCell(row, col) {
  const value = row[col.field];

  if (col.field === "isActive") {
    return value ? (
      <span className="inline-flex items-center gap-1.5" style={{ color: "var(--color-status-success)" }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--color-status-success)" }} />
        فعّال
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5" style={{ color: "var(--color-status-danger)" }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--color-status-danger)" }} />
        غير فعّال
      </span>
    );
  }

  if (col.field === "createdAt" || col.field === "updatedAt") {
    return (
      <span dir="ltr" className="inline-block">
        <Figures>{formatDate(value)}</Figures>
      </span>
    );
  }

  if (col.field === "id" || typeof value === "number") {
    return <Figures>{value}</Figures>;
  }

  return value ?? "—";
}

function FormField({ field, value, error, onChange }) {
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-[13px] text-ink-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4"
          style={{ accentColor: "var(--color-copper-600)" }}
        />
        {field.label}
      </label>
    );
  }

  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-medium text-ink-700">{field.label}</label>
      <input
        type={field.type === "email" ? "email" : field.type === "number" ? "number" : "text"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-stone-200 bg-white px-3 py-2 text-[13.5px] text-ink-900 outline-none focus-visible:outline focus-visible:outline-2"
        style={{ outlineColor: "var(--color-copper-500)" }}
      />
      {error && <p className="mt-1 text-[12px]" style={{ color: "var(--color-status-danger)" }}>{error}</p>}
    </div>
  );
}