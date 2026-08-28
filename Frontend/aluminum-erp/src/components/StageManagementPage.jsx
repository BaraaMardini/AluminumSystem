import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  X,
  Package,
  Scissors,
  Palette,
  ClipboardList,
  CheckCircle2,
  Clock3,
  Hash,
  Boxes,
  AlertTriangle,
} from "lucide-react";

import Figures from "./Figures";
import { useSourceOptions } from "../hooks/useSourceOptions";
import { getCurrentUser } from "../api/httpClient";

const ICONS = {
  coloring: Palette,
  cutting: Scissors,
  packaging: Package,
};

const THEMES = {
  coloring: {
    accent: "var(--color-copper-600)",
    soft: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-100",
    icon: Palette,
  },
  cutting: {
    accent: "#2563eb",
    soft: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
    icon: Scissors,
  },
  packaging: {
    accent: "#7c3aed",
    soft: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-100",
    icon: Package,
  },
};

function formatDateTime(value) {
  if (!value) return "-";

  const d = new Date(value);

  if (Number.isNaN(d.getTime()) || d.getFullYear() <= 1) {
    return "-";
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

function resolveResult(state, successMessage, errorMessage) {
  const success = !state?.errorCode || state.errorCode === 0;

  return {
    success,
    message:
      state?.message ||
      (success ? successMessage : errorMessage),
  };
}

function StatCard({ icon: Icon, label, value, theme }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-stone-500 mb-2">{label}</p>

          <div className="text-2xl font-bold text-stone-900">
            <Figures>{value}</Figures>
          </div>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${theme.soft}`}
        >
          <Icon size={20} className={theme.text} />
        </div>
      </div>
    </div>
  );
}

function Modal({ children, onClose, title, icon: Icon }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                <Icon size={19} />
              </div>
            )}

            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {title}
              </h3>

              <p className="text-xs text-stone-500 mt-1">
                أدخل المعلومات المطلوبة ثم احفظ التغييرات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-stone-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-medium text-stone-700 mb-2">
      {children}
    </label>
  );
}

function AddEntryForm({
  config,
  onSubmit,
  onCancel,
  submitting,
  theme,
}) {
  const fieldsConfig = config.operations.add.fields.filter(
    (f) => !f.autoFrom
  );

  const orderStageField = fieldsConfig.find(
    (f) => f.name === "orderStageID"
  );

  const {
    options: orderStageOptions,
    loading: orderStageLoading,
  } = useSourceOptions(
    orderStageField?.source,
    {
      StageName: config.stageName,
    }
  );

  const [values, setValues] = useState(() => {
    const initial = {};

    fieldsConfig.forEach((field) => {
      initial[field.name] = "";
    });

    return initial;
  });

  const [error, setError] = useState("");

  const change = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const submit = (e) => {
    e.preventDefault();

    const missing = fieldsConfig.find(
      (field) => !values[field.name]
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

  return (
    <form onSubmit={submit}>
      <div className="p-6 space-y-5">
        {orderStageField && (
          <div>
            <FieldLabel>{orderStageField.label}</FieldLabel>

            <select
              value={values.orderStageID}
              onChange={(e) =>
                change("orderStageID", e.target.value)
              }
              className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none transition focus:border-stone-400 focus:bg-white"
            >
              <option value="">
                {orderStageLoading
                  ? "جارٍ تحميل الطلبات..."
                  : "اختر الطلبية"}
              </option>

              {orderStageOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <FieldLabel>الكمية</FieldLabel>

          <input
            type="number"
            min="1"
            value={values.quantity || ""}
            onChange={(e) =>
              change("quantity", e.target.value)
            }
            placeholder="أدخل الكمية"
            className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none transition focus:border-stone-400 focus:bg-white"
          />
        </div>

        <div>
          <FieldLabel>ملاحظات</FieldLabel>

          <textarea
            value={values.notes || ""}
            onChange={(e) =>
              change("notes", e.target.value)
            }
            rows={4}
            placeholder="أضف أي ملاحظات..."
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm outline-none resize-none transition focus:border-stone-400 focus:bg-white"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-3 text-xs text-red-700">
            <AlertTriangle size={15} />
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 px-6 py-4 bg-stone-50 border-t border-stone-100">
        <button
          type="submit"
          disabled={submitting}
          style={{ backgroundColor: theme.accent }}
          className="flex-1 h-11 rounded-xl text-white text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "جارٍ الحفظ..." : "حفظ الإدخال"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-5 h-11 rounded-xl border border-stone-200 bg-white text-sm text-stone-700"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}

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
    >
      <div className="p-6">
        <FieldLabel>ملاحظات</FieldLabel>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          placeholder="أضف ملاحظات..."
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm outline-none resize-none focus:border-stone-400 focus:bg-white"
        />
      </div>

      <div className="flex gap-3 px-6 py-4 bg-stone-50 border-t border-stone-100">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 h-11 rounded-xl bg-stone-900 text-white text-sm disabled:opacity-50"
        >
          {submitting ? "جارٍ الحفظ..." : "حفظ التعديل"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-5 h-11 rounded-xl border border-stone-200 bg-white text-sm"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}

function DeleteModal({
  row,
  onConfirm,
  onCancel,
  submitting,
}) {
  return (
    <Modal
      title="حذف الإدخال"
      onClose={onCancel}
      icon={Trash2}
    >
      <div className="p-6">
        <div className="rounded-2xl bg-red-50 border border-red-100 p-5 mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-red-100 flex items-center justify-center">
              <Trash2 size={18} className="text-red-600" />
            </div>

            <div>
              <p className="font-semibold text-red-900 text-sm">
                هل أنت متأكد؟
              </p>

              <p className="text-xs text-red-700 mt-1 leading-6">
                سيتم حذف الإدخال رقم{" "}
                <Figures>{row.id}</Figures> نهائياً.
                لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 h-11 rounded-xl bg-red-600 text-white text-sm disabled:opacity-50"
          >
            {submitting ? "جارٍ الحذف..." : "نعم، حذف الإدخال"}
          </button>

          <button
            onClick={onCancel}
            className="px-5 h-11 rounded-xl border border-stone-200 text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function StageManagementPage({
  config,
  storeHook,
  stageId,
  stageName,
  type,
}) {
  const theme = THEMES[type];

  const {
    searchState,
    search,
    add,
    update,
    remove,
  } = storeHook();

  const [filters, setFilters] = useState({
    OrderID: "",
    OrderStageID: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const rows = Array.isArray(searchState.data)
    ? searchState.data
    : [];

  const loading = searchState.loading;

  const columns = config.operations.search.columns;

  const keyField =
    config.operations.update?.by ||
    config.operations.delete?.by ||
    config.idField ||
    "id";

  const hasUpdate = !!config.operations.update;
  const hasDelete = !!config.operations.delete;

  const totalQuantity = useMemo(
    () =>
      rows.reduce(
        (sum, row) =>
          sum + Number(row.quantity || 0),
        0
      ),
    [rows]
  );

  const runSearch = () => {
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) =>
          value !== "" &&
          value != null
      )
    );

    search({
      StageID: stageId,
      ...cleaned,
    });
  };

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const notify = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleAdd = async (payload) => {
    setSubmitting(true);

    try {
      await add(payload);

      const state =
        storeHook.getState?.().addState;

      const result = resolveResult(
        state,
        "تمت إضافة الإدخال بنجاح",
        "تعذر إضافة الإدخال"
      );

      notify(
        result.success ? "success" : "error",
        result.message
      );

      if (result.success) {
        setShowAdd(false);
        runSearch();
      }
    } catch {
      notify(
        "error",
        "تعذر الاتصال بالخادم"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (payload) => {
    setSubmitting(true);

    try {
      await update(
        editingRow[keyField],
        {
          ...payload,
          [keyField]: editingRow[keyField],
        }
      );

      const state =
        storeHook.getState?.().updateState;

      const result = resolveResult(
        state,
        "تم تعديل الإدخال بنجاح",
        "تعذر تعديل الإدخال"
      );

      notify(
        result.success ? "success" : "error",
        result.message
      );

      if (result.success) {
        setEditingRow(null);
        runSearch();
      }
    } catch {
      notify(
        "error",
        "تعذر الاتصال بالخادم"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);

    try {
      await remove(
        deletingRow[keyField]
      );

      const state =
        storeHook.getState?.().deleteState;

      const result = resolveResult(
        state,
        "تم حذف الإدخال بنجاح",
        "تعذر حذف الإدخال"
      );

      notify(
        result.success ? "success" : "error",
        result.message
      );

      if (result.success) {
        setDeletingRow(null);
        runSearch();
      }
    } catch {
      notify(
        "error",
        "تعذر الاتصال بالخادم"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const Icon = theme.icon;

  return (
    <div
      dir="rtl"
      className="min-h-full bg-[#f7f7f5] animate-fade-in"
    >
      {/* HEADER */}
      <div className="mb-7">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.soft}`}
              >
                <Icon
                  size={23}
                  className={theme.text}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-stone-950">
                    {config.title}
                  </h1>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${theme.soft} ${theme.text}`}
                  >
                    نشطة
                  </span>
                </div>

                <p className="text-sm text-stone-500 mt-1">
                  {config.description}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            style={{
              backgroundColor: theme.accent,
            }}
            className="h-11 px-5 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus size={17} />
            {config.addLabel}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={ClipboardList}
          label="عدد الإدخالات"
          value={rows.length}
          theme={theme}
        />

        <StatCard
          icon={Boxes}
          label="إجمالي الكمية"
          value={totalQuantity}
          theme={theme}
        />

        <StatCard
          icon={CheckCircle2}
          label="حالة المرحلة"
          value="مفتوحة"
          theme={theme}
        />
      </div>

      {/* FILTER CARD */}
      <div className="bg-white border border-stone-200 rounded-2xl mb-5">
        <div className="p-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="number"
              value={filters.OrderID}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  OrderID: e.target.value,
                }))
              }
              placeholder="ابحث برقم الطلب..."
              className="w-full h-11 rounded-xl bg-stone-50 border border-stone-200 pr-10 pl-3 text-sm outline-none focus:bg-white focus:border-stone-400"
            />
          </div>

          <button
            onClick={() =>
              setShowFilters((value) => !value)
            }
            className={`h-11 px-4 rounded-xl border text-sm flex items-center justify-center gap-2 ${
              showFilters
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white border-stone-200 text-stone-700"
            }`}
          >
            <SlidersHorizontal size={16} />
            فلاتر متقدمة
          </button>

          <button
            onClick={runSearch}
            style={{
              backgroundColor: theme.accent,
            }}
            className="h-11 px-5 rounded-xl text-white text-sm"
          >
            بحث
          </button>
        </div>

        {showFilters && (
          <div className="border-t border-stone-100 p-4">
            <div className="max-w-xs">
              <FieldLabel>
                معرّف مرحلة الطلب
              </FieldLabel>

              <input
                type="number"
                value={filters.OrderStageID}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    OrderStageID:
                      e.target.value,
                  }))
                }
                placeholder="مثال: 102"
                className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-stone-900 text-sm">
              سجلات المرحلة
            </h2>

            <p className="text-xs text-stone-500 mt-1">
              جميع الإدخالات المرتبطة بمرحلة {stageName}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Clock3 size={14} />
            آخر تحديث تلقائي
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="bg-stone-50/80">
                {columns.map((column) => (
                  <th
                    key={column.field}
                    className="px-5 py-3 text-right text-[11px] font-semibold text-stone-500"
                  >
                    {column.header}
                  </th>
                ))}

                {(hasUpdate || hasDelete) && (
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-stone-500">
                    الإجراءات
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
                      className="border-t border-stone-100"
                    >
                      {columns.map(
                        (column) => (
                          <td
                            key={
                              column.field
                            }
                            className="px-5 py-4"
                          >
                            <div className="h-4 rounded bg-stone-100 animate-pulse w-2/3" />
                          </td>
                        )
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
                        (hasUpdate ||
                        hasDelete
                          ? 1
                          : 0)
                      }
                      className="py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                          <ClipboardList
                            size={22}
                            className="text-stone-400"
                          />
                        </div>

                        <p className="font-semibold text-stone-800 text-sm">
                          لا توجد إدخالات
                        </p>

                        <p className="text-xs text-stone-500 mt-1">
                          لم يتم العثور على أي
                          سجلات مطابقة.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              {!loading &&
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-stone-100 hover:bg-stone-50/70 transition"
                  >
                    {columns.map((column) => {
                      const value =
                        row[column.field];

                      const numericFields = [
                        "id",
                        "orderID",
                        "orderStageID",
                        "quantity",
                      ];

                      return (
                        <td
                          key={
                            column.field
                          }
                          className="px-5 py-4 text-sm text-stone-800"
                        >
                          {column.field ===
                          "createdAt" ? (
                            <span
                              dir="ltr"
                              className="text-xs text-stone-500"
                            >
                              {formatDateTime(
                                value
                              )}
                            </span>
                          ) : numericFields.includes(
                              column.field
                            ) ? (
                            <div className="inline-flex items-center gap-1.5 font-semibold">
                              {column.field ===
                                "orderID" && (
                                <Hash
                                  size={13}
                                  className="text-stone-400"
                                />
                              )}

                              <Figures>
                                {value}
                              </Figures>
                            </div>
                          ) : (
                            value || "-"
                          )}
                        </td>
                      );
                    })}

                    {(hasUpdate ||
                      hasDelete) && (
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {hasUpdate && (
                            <button
                              onClick={() =>
                                setEditingRow(
                                  row
                                )
                              }
                              title="تعديل"
                              className="w-9 h-9 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-100"
                            >
                              <Pencil
                                size={15}
                              />
                            </button>
                          )}

                          {hasDelete && (
                            <button
                              onClick={() =>
                                setDeletingRow(
                                  row
                                )
                              }
                              title="حذف"
                              className="w-9 h-9 rounded-xl border border-red-100 bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100"
                            >
                              <Trash2
                                size={15}
                              />
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

      {/* ADD */}
      {showAdd && (
        <Modal
          title={config.addLabel}
          onClose={() => setShowAdd(false)}
          icon={Icon}
        >
          <AddEntryForm
            config={{
              ...config,
              stageName,
            }}
            onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)}
            submitting={submitting}
            theme={theme}
          />
        </Modal>
      )}

      {/* EDIT */}
      {editingRow && (
        <Modal
          title={`تعديل الإدخال #${editingRow.id}`}
          onClose={() => setEditingRow(null)}
          icon={Pencil}
        >
          <EditNotesForm
            initialData={editingRow}
            onSubmit={handleEdit}
            onCancel={() =>
              setEditingRow(null)
            }
            submitting={submitting}
          />
        </Modal>
      )}

      {/* DELETE */}
      {deletingRow && (
        <DeleteModal
          row={deletingRow}
          onConfirm={handleDelete}
          onCancel={() =>
            setDeletingRow(null)
          }
          submitting={submitting}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-[60] min-w-[300px] max-w-[420px] rounded-2xl shadow-xl border px-4 py-4 ${
            toast.type === "success"
              ? "bg-white border-emerald-100"
              : "bg-white border-red-100"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                toast.type === "success"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 size={17} />
              ) : (
                <AlertTriangle size={17} />
              )}
            </div>

            <div>
              <p className="font-semibold text-sm text-stone-900">
                {toast.type === "success"
                  ? "تمت العملية"
                  : "تعذر تنفيذ العملية"}
              </p>

              <p className="text-xs text-stone-500 mt-1">
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}