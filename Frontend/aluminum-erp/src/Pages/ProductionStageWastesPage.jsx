import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Trash,
  ClipboardList,
  Search,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import Figures from "../components/Figures";

import useProductionStageWastesStore from "../stores/ProductionStageWastesStore";
import { productionStageWastesEntity } from "../entities/ProductionStageWastesEntity";

import { useSourceOptions } from "../hooks/useSourceOptions";
import { getCurrentUser } from "../api/httpClient";

const config = productionStageWastesEntity;
const { operations } = config;

const keyField =
  operations.update?.by ||
  operations.delete?.by ||
  config.idField ||
  "id";

const columns = operations.search.columns;

const hasUpdate = Boolean(operations.update);
const hasDelete = Boolean(operations.delete);
const hasActionsColumn = hasUpdate || hasDelete;

const PAGE_TITLE = config.title;
const PAGE_DESCRIPTION = config.description;

function formatDateTime(value) {
  if (!value) return "-";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "-";
  if (d.getFullYear() <= 1) return "-";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

function resolveResult(
  state,
  fallbackSuccess,
  fallbackError
) {
  const success =
    !state?.errorCode || state.errorCode === 0;

  const message =
    state?.message ||
    (success ? fallbackSuccess : fallbackError);

  return {
    success,
    message,
  };
}

/* =========================================================
   Add Waste Form
========================================================= */

function AddWasteForm({
  onSubmit,
  onCancel,
  submitting,
}) {
  const fieldsConfig = operations.add.fields.filter(
    (f) => !f.autoFrom
  );

  const stageEntryField = fieldsConfig.find(
    (f) => f.name === "stageEntryID"
  );

  const wasteTypeField = fieldsConfig.find(
    (f) => f.name === "wasteTypeID"
  );

  const wasteReasonField = fieldsConfig.find(
    (f) => f.name === "wasteReasonID"
  );

  const {
    options: stageEntryOptions,
    loading: stageEntryLoading,
  } = useSourceOptions(stageEntryField.source);

  const {
    options: wasteTypeOptions,
    loading: wasteTypeLoading,
  } = useSourceOptions(wasteTypeField.source);

  const {
    options: wasteReasonOptions,
    loading: wasteReasonLoading,
  } = useSourceOptions(wasteReasonField.source);

  const [values, setValues] = useState(() => {
    const initial = {};

    fieldsConfig.forEach(
      (field) => (initial[field.name] = "")
    );

    return initial;
  });

  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missing = fieldsConfig.find(
      (field) =>
        field.name !== "notes" &&
        !values[field.name]
    );

    if (missing) {
      setError("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser?.email) {
      setError(
        "تعذر تحديد المستخدم الحالي، الرجاء تسجيل الدخول من جديد"
      );
      return;
    }

    onSubmit({
      ...values,
      email: currentUser.email,
    });
  };

  const selectClass =
    "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-[13px] text-ink-900 outline-none transition focus:border-[var(--color-copper-500)] focus:ring-4 focus:ring-[var(--color-copper-500)]/10";

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-[13px] text-ink-900 outline-none transition focus:border-[var(--color-copper-500)] focus:ring-4 focus:ring-[var(--color-copper-500)]/10";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 overflow-y-auto px-5 py-5"
    >
      <div className="space-y-4">
        {/* Stage */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-ink-700">
            {stageEntryField.label}
          </label>

          <select
            value={values.stageEntryID}
            onChange={(e) =>
              handleChange(
                "stageEntryID",
                e.target.value
              )
            }
            className={selectClass}
          >
            <option value="">
              {stageEntryLoading
                ? "جارٍ تحميل المراحل..."
                : "اختر مرحلة الإنتاج"}
            </option>

            {stageEntryOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-ink-700">
            كمية الهدر
          </label>

          <input
            type="number"
            min="0"
            step="any"
            value={values.wasteQuantity}
            onChange={(e) =>
              handleChange(
                "wasteQuantity",
                e.target.value
              )
            }
            placeholder="أدخل كمية الهدر"
            className={inputClass}
          />
        </div>

        {/* Waste Type */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-ink-700">
            {wasteTypeField.label}
          </label>

          <select
            value={values.wasteTypeID}
            onChange={(e) =>
              handleChange(
                "wasteTypeID",
                e.target.value
              )
            }
            className={selectClass}
          >
            <option value="">
              {wasteTypeLoading
                ? "جارٍ تحميل الأنواع..."
                : "اختر نوع الهدر"}
            </option>

            {wasteTypeOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Waste Reason */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-ink-700">
            {wasteReasonField.label}
          </label>

          <select
            value={values.wasteReasonID}
            onChange={(e) =>
              handleChange(
                "wasteReasonID",
                e.target.value
              )
            }
            className={selectClass}
          >
            <option value="">
              {wasteReasonLoading
                ? "جارٍ تحميل الأسباب..."
                : "اختر سبب الهدر"}
            </option>

            {wasteReasonOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-ink-700">
            ملاحظات
          </label>

          <textarea
            value={values.notes}
            onChange={(e) =>
              handleChange(
                "notes",
                e.target.value
              )
            }
            rows={4}
            placeholder="أضف أي ملاحظات مرتبطة بسجل الهدر..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-[var(--color-status-danger)]/20 bg-[var(--color-status-danger-bg)] px-3.5 py-3 text-xs text-[var(--color-status-danger)]">
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-2 border-t border-stone-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-ink-600 transition hover:bg-stone-100 disabled:opacity-50"
        >
          إلغاء
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[var(--color-graphite-950)] px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
        >
          {submitting
            ? "جارٍ تسجيل الهدر..."
            : "تسجيل الهدر"}
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   Edit Notes
========================================================= */

function EditNotesForm({
  initialData,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [notes, setNotes] = useState(
    initialData?.notes || ""
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ notes });
      }}
      className="flex-1 overflow-y-auto px-5 py-5"
    >
      <div>
        <label className="mb-2 block text-xs font-semibold text-ink-700">
          ملاحظات السجل
        </label>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          rows={6}
          placeholder="أدخل الملاحظات..."
          className="w-full resize-none rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-[13px] text-ink-900 outline-none transition focus:border-[var(--color-copper-500)] focus:ring-4 focus:ring-[var(--color-copper-500)]/10"
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-2 border-t border-stone-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-ink-600 hover:bg-stone-100"
        >
          إلغاء
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[var(--color-graphite-950)] px-5 py-2.5 text-[13px] font-medium text-white disabled:opacity-50"
        >
          {submitting
            ? "جارٍ الحفظ..."
            : "حفظ التعديل"}
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   Filter
========================================================= */

function FilterField({
  field,
  value,
  onChange,
}) {
  if (field.type === "select" && field.source) {
    const {
      options,
      loading,
    } = useSourceOptions(field.source);

    return (
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="min-w-[190px] rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-[12px] text-ink-700 outline-none transition focus:border-[var(--color-copper-500)] focus:ring-4 focus:ring-[var(--color-copper-500)]/10"
      >
        <option value="">
          {loading
            ? "جارٍ التحميل..."
            : field.label}
        </option>

        {!loading &&
          options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
      </select>
    );
  }

  return (
    <div className="relative">
      <input
        type="number"
        placeholder={field.label}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="min-w-[190px] rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 pr-9 text-[12px] text-ink-700 outline-none transition focus:border-[var(--color-copper-500)] focus:ring-4 focus:ring-[var(--color-copper-500)]/10"
      />

      <Search
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
      />
    </div>
  );
}

/* =========================================================
   Main Page
========================================================= */

export default function ProductionStageWastesPage() {
  const {
    searchState,
    getAllState,
    search,
    fetchAll,
    add,
    update,
    remove,
  } = useProductionStageWastesStore();

  const [filters, setFilters] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [editingRow, setEditingRow] =
    useState(null);
  const [deletingRow, setDeletingRow] =
    useState(null);
  const [submitting, setSubmitting] =
    useState(false);
  const [toast, setToast] = useState(null);

  const activeFilters = Object.values(filters).some(
    (value) =>
      value !== "" && value != null
  );

  const rawRows = activeFilters
    ? searchState.data
    : getAllState.data;

  const rows = Array.isArray(rawRows)
    ? rawRows
    : [];

  const loading = activeFilters
    ? searchState.loading
    : getAllState.loading;

  useEffect(() => {
    fetchAll?.();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeFilters) {
      const cleaned = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) =>
            value !== "" && value != null
        )
      );

      search(cleaned);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });

    setTimeout(
      () => setToast(null),
      4000
    );
  };

  const refresh = () => {
    if (activeFilters) {
      const cleaned = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) =>
            value !== "" && value != null
        )
      );

      search(cleaned);
    } else {
      fetchAll?.();
    }
  };

  const handleAddSubmit = async (payload) => {
    setSubmitting(true);

    try {
      await add(payload);

      const latestState =
        useProductionStageWastesStore.getState()
          .addState;

      const {
        success,
        message,
      } = resolveResult(
        latestState,
        "تم تسجيل الهدر بنجاح",
        "تعذر تسجيل الهدر"
      );

      showToast(
        success ? "success" : "error",
        message
      );

      if (success) {
        setShowAdd(false);
        refresh();
      }
    } catch {
      showToast(
        "error",
        "تعذر الاتصال بالخادم"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (payload) => {
    setSubmitting(true);

    try {
      await update(
        editingRow[keyField],
        {
          ...payload,
          [keyField]:
            editingRow[keyField],
        }
      );

      const latestState =
        useProductionStageWastesStore.getState()
          .updateState;

      const {
        success,
        message,
      } = resolveResult(
        latestState,
        "تم تعديل السجل بنجاح",
        "تعذر تعديل السجل"
      );

      showToast(
        success ? "success" : "error",
        message
      );

      if (success) {
        setEditingRow(null);
        refresh();
      }
    } catch {
      showToast(
        "error",
        "تعذر الاتصال بالخادم"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);

    try {
      await remove(
        deletingRow[keyField]
      );

      const latestState =
        useProductionStageWastesStore.getState()
          .deleteState;

      const {
        success,
        message,
      } = resolveResult(
        latestState,
        "تم حذف السجل بنجاح",
        "تعذر حذف السجل"
      );

      showToast(
        success ? "success" : "error",
        message
      );

      if (success) {
        setDeletingRow(null);
        refresh();
      }
    } catch {
      showToast(
        "error",
        "تعذر الاتصال بالخادم"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="group flex items-center gap-2 rounded-xl bg-[var(--color-copper-600)] px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-copper-700)] hover:shadow-md"
          >
            <Plus
              size={16}
              className="transition-transform group-hover:rotate-90"
            />
            {config.addLabel}
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger)]">
              <Trash2 size={20} />
            </div>

            <div>
              <p className="text-xs text-ink-500">
                سجلات الهدر
              </p>

              <p className="mt-1 text-xl font-bold text-ink-900">
                <Figures>{rows.length}</Figures>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:col-span-2">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-[var(--color-copper-600)]">
              <ClipboardList size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-ink-900">
                سجل هدر الإنتاج
              </p>

              <p className="mt-1 text-xs leading-6 text-ink-500">
                تابع كميات الهدر وأسبابه وأنواعه المرتبطة
                بمراحل الإنتاج، مع إمكانية التعديل والحذف.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-ink-500">
            <Search size={15} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-ink-900">
              تصفية السجلات
            </h2>

            <p className="text-[11px] text-ink-500">
              استخدم الفلاتر للوصول إلى السجلات المطلوبة
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {operations.search.filters.map(
            (field) => (
              <FilterField
                key={field.name}
                field={field}
                value={
                  filters[field.name] || ""
                }
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    [field.name]: value,
                  }))
                }
              />
            )
          )}

          {activeFilters && (
            <button
              type="button"
              onClick={() => setFilters({})}
              className="rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs font-medium text-ink-600 transition hover:bg-stone-50"
            >
              مسح الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/70 px-5 py-3.5">
          <div>
            <h2 className="text-sm font-bold text-ink-900">
              سجلات الهدر
            </h2>

            <p className="mt-0.5 text-[11px] text-ink-500">
              تفاصيل عمليات تسجيل الهدر
            </p>
          </div>

          <div className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-medium text-ink-500 shadow-sm ring-1 ring-stone-200">
            <Figures>{rows.length}</Figures> سجل
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-right">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50">
                {columns.map((col) => (
                  <th
                    key={col.field}
                    className="px-4 py-3 text-[11px] font-semibold text-ink-500"
                  >
                    {col.header}
                  </th>
                ))}

                {hasActionsColumn && (
                  <th className="px-4 py-3 text-[11px] font-semibold text-ink-500">
                    إجراءات
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: 6 }).map(
                  (_, index) => (
                    <tr
                      key={index}
                      className="border-b border-stone-100"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.field}
                          className="px-4 py-4"
                        >
                          <div className="h-3 w-24 animate-pulse rounded bg-stone-100" />
                        </td>
                      ))}

                      {hasActionsColumn && (
                        <td className="px-4 py-4" />
                      )}
                    </tr>
                  )
                )}

              {!loading &&
                rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        (hasActionsColumn
                          ? 1
                          : 0)
                      }
                      className="px-4 py-14 text-center"
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                          <Trash size={24} />
                        </div>

                        <p className="text-sm font-semibold text-ink-700">
                          {activeFilters
                            ? "لا توجد نتائج"
                            : "لا توجد سجلات هدر"}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-ink-500">
                          {activeFilters
                            ? "جرّب تغيير الفلاتر المستخدمة."
                            : "لم يتم تسجيل أي هدر حتى الآن."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              {!loading &&
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
                        {col.field ===
                        "createdAt" ? (
                          <span dir="ltr">
                            <Figures>
                              {formatDateTime(
                                row[col.field]
                              )}
                            </Figures>
                          </span>
                        ) : [
                            "id",
                            "orderStageID",
                            "wasteQuantity",
                          ].includes(
                            col.field
                          ) ? (
                          <Figures>
                            {row[col.field]}
                          </Figures>
                        ) : (
                          row[col.field] || "-"
                        )}
                      </td>
                    ))}

                    {hasActionsColumn && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {hasUpdate && (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingRow(
                                  row
                                )
                              }
                              title="تعديل"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-ink-500 transition hover:border-stone-200 hover:bg-white hover:text-[var(--color-copper-600)] hover:shadow-sm"
                            >
                              <Pencil size={14} />
                            </button>
                          )}

                          {hasDelete && (
                            <button
                              type="button"
                              onClick={() =>
                                setDeletingRow(
                                  row
                                )
                              }
                              title="حذف"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[var(--color-status-danger)] transition hover:border-[var(--color-status-danger)]/20 hover:bg-[var(--color-status-danger-bg)]"
                            >
                              <Trash2 size={14} />
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
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger)]">
                  <Plus size={19} />
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-ink-900">
                    {config.addLabel}
                  </h3>

                  <p className="mt-0.5 text-[11px] text-ink-500">
                    تسجيل عملية هدر جديدة
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAdd(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-white hover:text-ink-900"
              >
                <X size={18} />
              </button>
            </div>

            <AddWasteForm
              onSubmit={handleAddSubmit}
              onCancel={() =>
                setShowAdd(false)
              }
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
          <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-copper-600)]/10 text-[var(--color-copper-600)]">
                  <Pencil size={18} />
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-ink-900">
                    تعديل سجل الهدر
                  </h3>

                  <p className="mt-0.5 text-[11px] text-ink-500">
                    رقم السجل:{" "}
                    <Figures>
                      {editingRow.id}
                    </Figures>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingRow(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-white hover:text-ink-900"
              >
                <X size={18} />
              </button>
            </div>

            <EditNotesForm
              initialData={editingRow}
              onSubmit={handleEditSubmit}
              onCancel={() =>
                setEditingRow(null)
              }
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingRow && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            <div className="p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger)]">
                <Trash2 size={21} />
              </div>

              <h3 className="text-[16px] font-bold text-ink-900">
                تأكيد حذف السجل
              </h3>

              <p className="mt-2 text-[13px] leading-6 text-ink-600">
                هل أنت متأكد من حذف سجل الهدر رقم{" "}
                <span className="font-bold text-ink-900">
                  <Figures>
                    {deletingRow.id}
                  </Figures>
                </span>
                ؟
                <br />
                لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-stone-200 bg-stone-50/70 px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  setDeletingRow(null)
                }
                disabled={submitting}
                className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-ink-600 hover:bg-white"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="rounded-xl bg-[var(--color-status-danger)] px-4 py-2.5 text-[13px] font-medium text-white shadow-sm disabled:opacity-50"
              >
                {submitting
                  ? "جارٍ الحذف..."
                  : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3.5 text-sm shadow-xl ${
            toast.type === "success"
              ? "border-[var(--color-status-success)]/20 bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]"
              : "border-[var(--color-status-danger)]/20 bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger)]"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span className="font-medium">
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}