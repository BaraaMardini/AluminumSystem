import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  X,
  AlertCircle,
  CheckCircle2,
  Package,
  Boxes,
  Save,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import Figures from "../components/Figures";

import useProductsStore from "../stores/ProductsStore";
import { productsEntity } from "../entities/ProductsEntity";

const config = productsEntity;
const { operations } = config;

const columns =
  operations.getAll?.columns ?? [];

const keyField =
  operations.update?.by ||
  operations.delete?.by ||
  config.idField ||
  "id";

const hasSearch = Boolean(operations.search);
const hasAdd = Boolean(operations.add);
const hasUpdate = Boolean(operations.update);
const hasDelete = Boolean(operations.delete);
const hasActionsColumn =
  hasUpdate || hasDelete;

const PAGE_TITLE =
  config.title || "المنتجات";

const PAGE_DESCRIPTION =
  config.description ||
  "إدارة قائمة المنتجات المسجّلة بالنظام.";

const ADD_LABEL =
  config.addLabel || "إضافة منتج";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function ProductsPage() {
  const {
    getAllState,
    fetchAll,
    add,
    addState,
    update,
    updateState,
  } = useProductsStore();

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("add");

  const [activeRow, setActiveRow] =
    useState(null);

  const [formValues, setFormValues] =
    useState({});

  const [formErrors, setFormErrors] =
    useState({});

  const [toast, setToast] =
    useState(null);

  const prevAddLoading =
    useRef(false);

  const prevUpdateLoading =
    useRef(false);

  const toastTimer =
    useRef(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function showToast(type, message) {
    setToast({
      type,
      message,
    });

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(
      () => setToast(null),
      4000
    );
  }

  useEffect(() => {
    if (
      prevAddLoading.current &&
      !addState.loading
    ) {
      if (addState.errorCode === 0) {
        showToast(
          "success",
          addState.message ||
            "تمت إضافة المنتج بنجاح."
        );

        closeModal();
        fetchAll();
      } else {
        showToast(
          "error",
          addState.message ||
            "تعذّرت إضافة المنتج."
        );
      }
    }

    prevAddLoading.current =
      addState.loading;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addState.loading]);

  useEffect(() => {
    if (
      prevUpdateLoading.current &&
      !updateState.loading
    ) {
      if (updateState.errorCode === 0) {
        showToast(
          "success",
          updateState.message ||
            "تم تعديل المنتج بنجاح."
        );

        closeModal();
        fetchAll();
      } else {
        showToast(
          "error",
          updateState.message ||
            "تعذّر تعديل المنتج."
        );
      }
    }

    prevUpdateLoading.current =
      updateState.loading;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState.loading]);

  function openAddModal() {
    setModalMode("add");
    setActiveRow(null);

    const initial = {};

    (
      operations.add?.fields || []
    ).forEach((field) => {
      initial[field.name] =
        field.type === "checkbox"
          ? false
          : "";
    });

    setFormValues(initial);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEditModal(row) {
    setModalMode("edit");
    setActiveRow(row);

    const initial = {};

    (
      operations.update?.fields || []
    ).forEach((field) => {
      initial[field.name] =
        row[field.name] ??
        (field.type === "checkbox"
          ? false
          : "");
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
    return modalMode === "add"
      ? operations.add?.fields || []
      : operations.update?.fields || [];
  }

  function validate(fields) {
    const errors = {};

    fields.forEach((field) => {
      const value =
        formValues[field.name];

      if (field.type === "checkbox") {
        return;
      }

      if (
        field.required &&
        (
          value === undefined ||
          value === null ||
          String(value).trim() === ""
        )
      ) {
        errors[field.name] =
          "هذا الحقل مطلوب.";
        return;
      }

      if (
        field.type === "email" &&
        value
      ) {
        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
          errors[field.name] =
            "صيغة البريد الإلكتروني غير صحيحة.";
        }
      }

      if (
        field.type === "number" &&
        value !== "" &&
        value !== undefined &&
        Number.isNaN(Number(value))
      ) {
        errors[field.name] =
          "يجب إدخال رقم صحيح.";
      }
    });

    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const fields =
      getActiveFields();

    const errors =
      validate(fields);

    if (
      Object.keys(errors).length > 0
    ) {
      setFormErrors(errors);
      return;
    }

    const payload = {};

    fields.forEach((field) => {
      payload[field.name] =
        formValues[field.name];
    });

    if (modalMode === "add") {
      add(payload);
    } else {
      const keyValue =
        activeRow?.[keyField];

      update(
        keyValue,
        payload
      );
    }
  }

  const rows =
    getAllState.data || [];

  const isLoading =
    getAllState.loading;

  const isSubmitting =
    modalMode === "add"
      ? addState.loading
      : updateState.loading;

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          hasAdd && (
            <button
              type="button"
              onClick={openAddModal}
              className="group flex items-center gap-2 rounded-xl bg-[var(--color-copper-600)] px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-copper-700)] hover:shadow-md"
            >
              <Plus
                className="h-4 w-4 transition-transform group-hover:rotate-90"
                strokeWidth={2}
              />

              {ADD_LABEL}
            </button>
          )
        }
      />

      {!hasSearch && null}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-copper-600)]/10 text-[var(--color-copper-600)]">
              <Package size={21} />
            </div>

            <div>
              <p className="text-xs text-ink-500">
                إجمالي المنتجات
              </p>

              <p className="mt-1 text-xl font-bold text-ink-900">
                <Figures>
                  {rows.length}
                </Figures>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:col-span-2">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-ink-500">
              <Boxes size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-ink-900">
                إدارة المنتجات
              </p>

              <p className="mt-1 text-xs leading-6 text-ink-500">
                استعرض المنتجات المسجلة في النظام وقم
                بإضافة منتجات جديدة أو تعديل البيانات
                الحالية بسهولة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/70 px-5 py-3.5">
          <div>
            <h2 className="text-sm font-bold text-ink-900">
              قائمة المنتجات
            </h2>

            <p className="mt-0.5 text-[11px] text-ink-500">
              المنتجات المسجلة حاليًا في النظام
            </p>
          </div>

          <div className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-medium text-ink-500 shadow-sm ring-1 ring-stone-200">
            <Figures>{rows.length}</Figures>{" "}
            منتج
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-right">
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
              {isLoading &&
                Array.from({
                  length: 6,
                }).map((_, index) => (
                  <tr
                    key={`skeleton-${index}`}
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
                      <td className="px-4 py-4">
                        <div className="h-7 w-12 animate-pulse rounded bg-stone-100" />
                      </td>
                    )}
                  </tr>
                ))}

              {!isLoading &&
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
                          <Package
                            size={25}
                            strokeWidth={1.7}
                          />
                        </div>

                        <p className="text-sm font-semibold text-ink-700">
                          لا توجد منتجات
                        </p>

                        <p className="mt-1 text-xs leading-5 text-ink-500">
                          لم يتم تسجيل أي منتج في النظام
                          حتى الآن.
                        </p>

                        {hasAdd && (
                          <button
                            type="button"
                            onClick={
                              openAddModal
                            }
                            className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--color-copper-600)] px-3.5 py-2 text-xs font-medium text-white"
                          >
                            <Plus size={14} />
                            إضافة أول منتج
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

              {!isLoading &&
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
                        {renderCell(
                          row,
                          col
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
                                openEditModal(
                                  row
                                )
                              }
                              aria-label="تعديل"
                              title="تعديل المنتج"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-ink-500 transition hover:border-stone-200 hover:bg-white hover:text-[var(--color-copper-600)] hover:shadow-sm"
                            >
                              <Pencil
                                className="h-3.5 w-3.5"
                                strokeWidth={
                                  1.8
                                }
                              />
                            </button>
                          )}

                          {hasDelete && (
                            <button
                              type="button"
                              title="حذف"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-status-danger)] hover:bg-[var(--color-status-danger-bg)]"
                            >
                              <X size={14} />
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]">
          <div className="animate-fade-in flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-copper-600)]/10 text-[var(--color-copper-600)]">
                  {modalMode ===
                  "add" ? (
                    <Plus size={19} />
                  ) : (
                    <Pencil size={18} />
                  )}
                </div>

                <div>
                  <h3 className="font-display text-[16px] font-bold text-ink-900">
                    {modalMode ===
                    "add"
                      ? ADD_LABEL
                      : "تعديل المنتج"}
                  </h3>

                  <p className="mt-0.5 text-[11px] text-ink-500">
                    {modalMode ===
                    "add"
                      ? "إضافة منتج جديد إلى النظام"
                      : "تعديل بيانات المنتج المحدد"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="إغلاق"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition hover:bg-white hover:text-ink-900"
              >
                <X
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-5 py-5"
            >
              <div className="space-y-4">
                {getActiveFields().map(
                  (field) => (
                    <FormField
                      key={field.name}
                      field={field}
                      value={
                        formValues[
                          field.name
                        ]
                      }
                      error={
                        formErrors[
                          field.name
                        ]
                      }
                      onChange={(
                        value
                      ) =>
                        setFormValues(
                          (prev) => ({
                            ...prev,
                            [field.name]:
                              value,
                          })
                        )
                      }
                    />
                  )
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-stone-200 pt-4">
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    isSubmitting
                  }
                  className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-ink-600 transition hover:bg-stone-100 disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                  className="flex items-center gap-2 rounded-xl bg-[var(--color-graphite-950)] px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      جارٍ الحفظ...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      حفظ البيانات
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3.5 text-[13px] shadow-xl ${
            toast.type ===
            "success"
              ? "border-[var(--color-status-success)]/20 bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]"
              : "border-[var(--color-status-danger)]/20 bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger)]"
          }`}
        >
          {toast.type ===
          "success" ? (
            <CheckCircle2
              className="h-4 w-4 shrink-0"
              strokeWidth={1.8}
            />
          ) : (
            <AlertCircle
              className="h-4 w-4 shrink-0"
              strokeWidth={1.8}
            />
          )}

          <span className="font-medium">
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}

function renderCell(row, col) {
  const value = row[col.field];

  if (col.field === "isActive") {
    return value ? (
      <span
        className="inline-flex items-center gap-2 font-medium"
        style={{
          color:
            "var(--color-status-success)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor:
              "var(--color-status-success)",
          }}
        />

        فعّال
      </span>
    ) : (
      <span
        className="inline-flex items-center gap-2 font-medium"
        style={{
          color:
            "var(--color-status-danger)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor:
              "var(--color-status-danger)",
          }}
        />

        غير فعّال
      </span>
    );
  }

  if (
    col.field === "createdAt" ||
    col.field === "updatedAt"
  ) {
    return (
      <span
        dir="ltr"
        className="inline-block"
      >
        <Figures>
          {formatDate(value)}
        </Figures>
      </span>
    );
  }

  if (
    col.field === "id" ||
    typeof value === "number"
  ) {
    return (
      <Figures>{value}</Figures>
    );
  }

  return value ?? "—";
}

function FormField({
  field,
  value,
  error,
  onChange,
}) {
  if (field.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5 transition hover:border-[var(--color-copper-300)] hover:bg-white">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) =>
            onChange(
              e.target.checked
            )
          }
          className="h-4 w-4 rounded"
          style={{
            accentColor:
              "var(--color-copper-600)",
          }}
        />

        <span className="text-[13px] font-medium text-ink-700">
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
        type={
          field.type === "email"
            ? "email"
            : field.type === "number"
            ? "number"
            : "text"
        }
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`w-full rounded-xl border bg-white px-3.5 py-3 text-[13px] text-ink-900 outline-none transition focus:ring-4 ${
          error
            ? "border-[var(--color-status-danger)] focus:border-[var(--color-status-danger)] focus:ring-[var(--color-status-danger)]/10"
            : "border-stone-200 focus:border-[var(--color-copper-500)] focus:ring-[var(--color-copper-500)]/10"
        }`}
      />

      {error && (
        <div
          className="mt-1.5 flex items-center gap-1.5 text-[12px]"
          style={{
            color:
              "var(--color-status-danger)",
          }}
        >
          <AlertCircle size={13} />

          <span>{error}</span>
        </div>
      )}
    </div>
  );
}