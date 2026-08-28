import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  X,
  Loader2,
  Layers3,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

import useProductionStagesStore from "../stores/ProductionStagesStore";
import { productionStagesEntity } from "../entities/ProductionStagesEntity";

import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Figures from "../components/Figures";

const config = productionStagesEntity;
const operations = config.operations;

const columns = operations.getAll?.columns || [];

const keyField =
  operations.update?.by ||
  operations.delete?.by ||
  config.idField ||
  "id";

const hasAdd = Boolean(operations.add);
const hasUpdate = Boolean(operations.update);
const hasDelete = Boolean(operations.delete);
const hasActionsColumn = hasUpdate || hasDelete;

function formatDate(dateStr) {
  if (!dateStr) return "-";

  const d = new Date(dateStr);

  if (Number.isNaN(d.getTime())) return "-";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

function renderCellValue(col, row) {
  const value = row[col.field];

  if (col.field === "createdAt" || col.field === "updatedAt") {
    return (
      <span dir="ltr" className="inline-block">
        <Figures>{formatDate(value)}</Figures>
      </span>
    );
  }

  if (typeof value === "boolean") {
    return (
      <StatusBadge status={value ? "مفعّلة" : "غير مفعّلة"} />
    );
  }

  if (typeof value === "number") {
    return <Figures>{value}</Figures>;
  }

  return value ?? "-";
}

function emptyValueForField(field) {
  if (field.type === "checkbox") return false;
  return "";
}

function buildInitialFormData(fields, row) {
  const data = {};

  fields.forEach((field) => {
    if (row) {
      data[field.name] =
        row[field.name] ?? emptyValueForField(field);
    } else {
      data[field.name] = emptyValueForField(field);
    }
  });

  return data;
}

function validateFormData(fields, formData) {
  const errors = {};

  fields.forEach((field) => {
    const value = formData[field.name];

    if (field.type === "checkbox") return;

    if (field.type === "number") {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
      ) {
        errors[field.name] = "هذا الحقل مطلوب";
      }

      return;
    }

    if (!value || String(value).trim() === "") {
      errors[field.name] = "هذا الحقل مطلوب";
    }
  });

  return errors;
}

function buildPayload(fields, formData) {
  const payload = {};

  fields.forEach((field) => {
    payload[field.name] =
      field.type === "number"
        ? Number(formData[field.name])
        : formData[field.name];
  });

  return payload;
}

function FieldInput({ field, value, error, onChange }) {
  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm text-ink-900 outline-none transition-all placeholder:text-stone-400 focus:border-[var(--color-copper-500)] focus:ring-4 focus:ring-[var(--color-copper-500)]/10";

  if (field.type === "checkbox") {
    return (
      <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5 transition hover:border-[var(--color-copper-300)] hover:bg-white">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) =>
            onChange(field.name, e.target.checked)
          }
          className="h-4 w-4 rounded"
          style={{
            accentColor: "var(--color-copper-600)",
          }}
        />

        <span className="text-sm font-medium text-ink-700">
          {field.label}
        </span>
      </label>
    );
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-ink-700">
        {field.label}
      </label>

      <input
        type={field.type === "number" ? "number" : "text"}
        className={`${inputClass} ${
          error
            ? "border-[var(--color-status-danger)] focus:border-[var(--color-status-danger)]"
            : ""
        }`}
        value={value ?? ""}
        onChange={(e) =>
          onChange(field.name, e.target.value)
        }
      />

      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--color-status-danger)]">
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

function StageFormModal({
  mode,
  row,
  onClose,
  onSubmit,
  loading,
}) {
  const fields =
    mode === "add"
      ? operations.add.fields
      : operations.update.fields;

  const [formData, setFormData] = useState(() =>
    buildInitialFormData(fields, row)
  );

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFormData(
      fields,
      formData
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(buildPayload(fields, formData));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-copper-600)] text-white shadow-sm">
              {mode === "add" ? (
                <Plus size={19} />
              ) : (
                <Pencil size={18} />
              )}
            </div>

            <div>
              <h3 className="font-display text-[16px] font-bold text-ink-900">
                {mode === "add"
                  ? "إضافة مرحلة إنتاج"
                  : "تعديل مرحلة الإنتاج"}
              </h3>

              <p className="mt-0.5 text-[11px] text-ink-500">
                {mode === "add"
                  ? "أدخل بيانات مرحلة الإنتاج الجديدة"
                  : "قم بتحديث بيانات مرحلة الإنتاج"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition hover:bg-white hover:text-ink-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 py-5"
        >
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={formData[field.name]}
                error={errors[field.name]}
                onChange={handleChange}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-stone-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-stone-100 disabled:opacity-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[var(--color-graphite-950)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}

              {loading ? "جارٍ الحفظ..." : "حفظ البيانات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3.5 text-sm shadow-xl ${
        isError
          ? "border-[var(--color-status-danger)]/20 bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger)]"
          : "border-[var(--color-status-success)]/20 bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]"
      }`}
    >
      {isError ? (
        <AlertCircle size={18} />
      ) : (
        <CheckCircle2 size={18} />
      )}

      <span className="font-medium">{toast.message}</span>
    </div>
  );
}

function TableSkeletonRows({ colSpan }) {
  return Array.from({ length: 6 }).map((_, index) => (
    <tr
      key={index}
      className="border-b border-stone-100"
    >
      {Array.from({ length: colSpan }).map((__, cellIndex) => (
        <td key={cellIndex} className="px-4 py-4">
          <div
            className={`h-3 animate-pulse rounded bg-stone-100 ${
              cellIndex === 0 ? "w-20" : "w-28"
            }`}
          />
        </td>
      ))}
    </tr>
  ));
}

export default function ProductionStagesPage() {
  const {
    getAllState,
    fetchAll,
    addState,
    add,
    updateState,
    update,
  } = useProductionStagesStore();

  const [modalState, setModalState] = useState(null);
  const [toast, setToast] = useState(null);

  const prevAddLoading = useRef(false);
  const prevUpdateLoading = useRef(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    fetchAll?.();
  }, []);

  const showToast = (message, type) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({
      message,
      type,
    });

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    if (
      prevAddLoading.current &&
      !addState.loading
    ) {
      if (addState.errorCode === 0) {
        showToast(
          "تمت إضافة المرحلة بنجاح",
          "success"
        );

        setModalState(null);
        fetchAll?.();
      } else {
        showToast(
          addState.message ||
            "حدث خطأ أثناء الإضافة",
          "error"
        );
      }
    }

    prevAddLoading.current = addState.loading;
  }, [addState.loading]);

  useEffect(() => {
    if (
      prevUpdateLoading.current &&
      !updateState.loading
    ) {
      if (updateState.errorCode === 0) {
        showToast(
          "تم تعديل المرحلة بنجاح",
          "success"
        );

        setModalState(null);
        fetchAll?.();
      } else {
        showToast(
          updateState.message ||
            "حدث خطأ أثناء التعديل",
          "error"
        );
      }
    }

    prevUpdateLoading.current =
      updateState.loading;
  }, [updateState.loading]);

  const rows = getAllState.data || [];

  const colSpanTotal =
    columns.length +
    (hasActionsColumn ? 1 : 0);

  const handleSubmit = (payload) => {
    if (modalState.mode === "add") {
      add(payload);
    } else {
      update(
        modalState.row[keyField],
        payload
      );
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title="مراحل الإنتاج"
        description="إدارة مراحل الإنتاج الخاصة بخط التصنيع"
        actions={
          hasAdd && (
            <button
              type="button"
              onClick={() =>
                setModalState({
                  mode: "add",
                })
              }
              className="group flex items-center gap-2 rounded-xl bg-[var(--color-copper-600)] px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-copper-700)] hover:shadow-md"
            >
              <Plus
                size={16}
                className="transition-transform group-hover:rotate-90"
              />

              إضافة مرحلة
            </button>
          )
        }
      />

      {/* Statistics / intro card */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-copper-600)]/10 text-[var(--color-copper-600)]">
              <Layers3 size={20} />
            </div>

            <div>
              <p className="text-xs text-ink-500">
                إجمالي مراحل الإنتاج
              </p>

              <p className="mt-1 text-xl font-bold text-ink-900">
                <Figures>{rows.length}</Figures>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:col-span-2">
          <p className="text-xs font-semibold text-ink-700">
            إدارة مراحل التصنيع
          </p>

          <p className="mt-1.5 text-[12px] leading-6 text-ink-500">
            من هنا يمكنك استعراض مراحل الإنتاج المسجلة
            وإضافة مراحل جديدة أو تعديل البيانات الحالية.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/70 px-5 py-3.5">
          <div>
            <h2 className="text-sm font-bold text-ink-900">
              قائمة مراحل الإنتاج
            </h2>

            <p className="mt-0.5 text-[11px] text-ink-500">
              جميع المراحل المسجلة في النظام
            </p>
          </div>

          <div className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-medium text-ink-500 shadow-sm ring-1 ring-stone-200">
            <Figures>{rows.length}</Figures> سجل
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50">
                {columns.map((col) => (
                  <th
                    key={col.field}
                    className="px-4 py-3 text-right text-[11px] font-semibold text-ink-500"
                  >
                    {col.header}
                  </th>
                ))}

                {hasActionsColumn && (
                  <th className="px-4 py-3 text-right text-[11px] font-semibold text-ink-500">
                    إجراءات
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {getAllState.loading ? (
                <TableSkeletonRows
                  colSpan={colSpanTotal}
                />
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={colSpanTotal}
                    className="px-4 py-14 text-center"
                  >
                    <div className="mx-auto flex max-w-xs flex-col items-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                        <Layers3 size={25} />
                      </div>

                      <p className="text-sm font-semibold text-ink-700">
                        لا توجد مراحل إنتاج
                      </p>

                      <p className="mt-1 text-xs leading-5 text-ink-500">
                        لم يتم تسجيل أي مرحلة إنتاج حتى الآن.
                      </p>

                      {hasAdd && (
                        <button
                          type="button"
                          onClick={() =>
                            setModalState({
                              mode: "add",
                            })
                          }
                          className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--color-copper-600)] px-3.5 py-2 text-xs font-medium text-white"
                        >
                          <Plus size={14} />
                          إضافة أول مرحلة
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row[keyField]}
                    className="border-b border-stone-100 transition hover:bg-stone-50/70"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.field}
                        className="px-4 py-3.5 text-[13px] text-ink-800"
                      >
                        {renderCellValue(col, row)}
                      </td>
                    ))}

                    {hasActionsColumn && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {hasUpdate && (
                            <button
                              type="button"
                              onClick={() =>
                                setModalState({
                                  mode: "edit",
                                  row,
                                })
                              }
                              title="تعديل"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-ink-500 transition hover:border-stone-200 hover:bg-white hover:text-[var(--color-copper-600)] hover:shadow-sm"
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalState && (
        <StageFormModal
          mode={modalState.mode}
          row={modalState.row}
          onClose={() => setModalState(null)}
          onSubmit={handleSubmit}
          loading={
            modalState.mode === "add"
              ? addState.loading
              : updateState.loading
          }
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}