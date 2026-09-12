import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Edit3,
  Filter,
  Package,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Figures from "../components/Figures";

import useProductionOrdersStore from "../stores/ProductionOrdersStore";
import useProductionOrderStagesStore from "../stores/ProductionOrderStagesStore";

import { productionOrdersEntity } from "../entities/ProductionOrdersEntity";
import { productionOrderStagesEntity } from "../entities/ProductionOrderStagesEntity";
import { getCurrentUser } from "../api/httpClient";
import { useSourceOptions } from "../hooks/useSourceOptions";

const config = productionOrdersEntity;
const { operations } = config;

const keyField =
  operations.update?.by ||
  operations.delete?.by ||
  config.idField ||
  "id";

const hasSearch = Boolean(operations.search);
const hasAdd = Boolean(operations.add);
const hasUpdate = Boolean(operations.update);
const hasDelete = Boolean(operations.delete);

const columns =
  operations.getAll?.columns ||
  operations.search?.columns ||
  [];

// Fields on the ProductionOrderStages "add" operation that must be
// filled automatically from the logged-in user (autoFrom) rather
// than typed in, e.g. the email tied to the account starting
// production.
const stageAddFields =
  productionOrderStagesEntity.operations.add.fields;

/* =========================================================
   Helpers
========================================================= */

function formatDate(value) {
  if (!value) return "-";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "-";
  if (d.getFullYear() <= 1) return "-";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

function resolveResult(state, fallbackSuccess, fallbackError) {
  const success = !state?.errorCode || state.errorCode === 0;

  const message =
    state?.message ||
    (success ? fallbackSuccess : fallbackError);

  return {
    success,
    message,
  };
}

// Resolves every autoFrom field declared on a fields config against
// the current logged-in user, e.g. autoFrom: "user.email" -> email.
// Returns { payload, errorMsg } — errorMsg is set when the user (or
// the requested key on it) can't be resolved.
function resolveAutoFromFields(fieldsConfig, basePayload) {
  const payload = { ...basePayload };

  for (const field of fieldsConfig) {
    if (!field.autoFrom) continue;

    const user = getCurrentUser();
    const key = field.autoFrom.split(".")[1];
    const value = user?.[key];

    if (!user || value === null || value === undefined) {
      return {
        payload: null,
        errorMsg:
          "تعذر تحديد المستخدم الحالي، يرجى تسجيل الدخول من جديد",
      };
    }

    payload[field.name] = value;
  }

  return { payload, errorMsg: null };
}

/* =========================================================
   Field
========================================================= */

function FieldInput({
  field,
  value,
  error,
  onChange,
}) {
  if (field.type === "select" && field.source) {
    const { options, loading } = useSourceOptions(field.source);

    return (
      <div className="space-y-1.5">
        <label className="block text-[12px] font-medium text-stone-600">
          {field.label}
          {field.required !== false && (
            <span className="text-red-500 mr-1">*</span>
          )}
        </label>

        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full rounded-lg border border-stone-200 bg-white
            px-3.5 py-2.5 text-[13px] text-stone-800
            shadow-sm
            transition
            focus:border-[var(--color-copper-500)]
            focus:ring-2
            focus:ring-[var(--color-copper-100)]
            focus:outline-none
          "
        >
          <option value="">
            {loading ? "جارٍ التحميل..." : "اختر..."}
          </option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-[11px] text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label
        className="
          flex items-center gap-3 rounded-lg border border-stone-200
          bg-stone-50 px-3.5 py-3 cursor-pointer
          hover:bg-stone-100 transition
        "
      >
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-copper-600)]"
        />

        <span className="text-[13px] text-stone-700">
          {field.label}
        </span>
      </label>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-medium text-stone-600">
        {field.label}
        {field.required !== false && (
          <span className="text-red-500 mr-1">*</span>
        )}
      </label>

      <input
        type={field.type === "text" ? "text" : field.type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-lg border border-stone-200 bg-white
          px-3.5 py-2.5 text-[13px] text-stone-800
          shadow-sm
          transition
          placeholder:text-stone-400
          focus:border-[var(--color-copper-500)]
          focus:ring-2
          focus:ring-[var(--color-copper-100)]
          focus:outline-none
        "
      />

      {error && (
        <p className="text-[11px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   Order Form
========================================================= */

function OrderForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  submitting,
}) {
  const fieldsConfig =
    mode === "add"
      ? operations.add.fields
      : operations.update.fields;

  const visibleFields = fieldsConfig.filter(
    (f) => !f.autoFrom
  );

  const [values, setValues] = useState(() => {
    const initial = {};

    fieldsConfig.forEach((f) => {
      initial[f.name] =
        initialData?.[f.name] ??
        (f.type === "checkbox" ? false : "");
    });

    return initial;
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    visibleFields.forEach((field) => {
      const value = values[field.name];

      if (
        field.required !== false &&
        (value === "" ||
          value === null ||
          value === undefined)
      ) {
        nextErrors[field.name] = "هذا الحقل مطلوب";
      }

      if (
        field.type === "number" &&
        value !== "" &&
        Number.isNaN(Number(value))
      ) {
        nextErrors[field.name] =
          "يجب أن تكون القيمة رقمية";
      }
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const {
      payload,
      errorMsg,
    } = resolveAutoFromFields(
      fieldsConfig,
      values
    );

    if (errorMsg) {
      onSubmit(null, errorMsg);
      return;
    }

    onSubmit(payload, null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col min-h-0"
    >
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-4">
          {visibleFields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={(value) =>
                handleChange(field.name, value)
              }
            />
          ))}
        </div>
      </div>

      <div
        className="
          shrink-0 flex items-center justify-end gap-2
          px-6 py-4 border-t border-stone-200 bg-stone-50
        "
      >
        <button
          type="button"
          onClick={onCancel}
          className="
            rounded-lg px-4 py-2.5 text-[13px]
            text-stone-600 hover:bg-stone-200
            transition
          "
        >
          إلغاء
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="
            inline-flex items-center gap-2
            rounded-lg px-5 py-2.5 text-[13px]
            font-medium text-white
            bg-[var(--color-graphite-950)]
            hover:opacity-90
            disabled:opacity-50
            transition
          "
        >
          {submitting && (
            <RefreshCw
              size={14}
              className="animate-spin"
            />
          )}

          {submitting ? "جارٍ الحفظ..." : "حفظ البيانات"}
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
  if (
    field.type === "select" &&
    field.source
  ) {
    const {
      options,
      loading,
    } = useSourceOptions(field.source);

    return (
      <div className="relative min-w-[190px]">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            w-full appearance-none rounded-lg
            border border-stone-200 bg-white
            px-3.5 py-2.5 pl-9
            text-[12.5px] text-stone-700
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--color-copper-100)]
            focus:border-[var(--color-copper-500)]
          "
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

        <Filter
          size={14}
          className="
            absolute left-3 top-1/2
            -translate-y-1/2
            text-stone-400 pointer-events-none
          "
        />
      </div>
    );
  }

  return (
    <div className="relative min-w-[190px]">
      <Search
        size={14}
        className="
          absolute right-3 top-1/2
          -translate-y-1/2
          text-stone-400 pointer-events-none
        "
      />

      <input
        type="text"
        placeholder={field.label}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full rounded-lg
          border border-stone-200 bg-white
          pr-9 pl-3.5 py-2.5
          text-[12.5px]
          shadow-sm
          placeholder:text-stone-400
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--color-copper-100)]
          focus:border-[var(--color-copper-500)]
        "
      />
    </div>
  );
}

/* =========================================================
   Confirmation
========================================================= */

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  confirmClass,
  icon,
  onCancel,
  onConfirm,
}) {
  return (
    <div
      className="
        fixed inset-0 z-[70]
        flex items-center justify-center
        bg-black/40 backdrop-blur-[2px]
        p-4
      "
    >
      <div
        className="
          w-full max-w-md
          overflow-hidden rounded-2xl
          bg-white border border-stone-200
          shadow-2xl
        "
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl bg-stone-100
              "
            >
              {icon}
            </div>

            <div>
              <h3 className="
                text-[16px] font-bold
                text-stone-900
              ">
                {title}
              </h3>

              <p className="
                mt-1.5 text-[13px]
                leading-6 text-stone-500
              ">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            flex justify-end gap-2
            border-t border-stone-200
            bg-stone-50 px-6 py-4
          "
        >
          <button
            onClick={onCancel}
            className="
              rounded-lg px-4 py-2.5
              text-[13px] text-stone-600
              hover:bg-stone-200 transition
            "
          >
            إلغاء
          </button>

          <button
            onClick={onConfirm}
            className={`
              rounded-lg px-4 py-2.5
              text-[13px] font-medium
              text-white transition
              hover:opacity-90
              ${confirmClass}
            `}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Main Page
========================================================= */

export default function ProductionOrdersPage() {
  const {
    searchState,
    getAllState,
    search,
    fetchAll,
    add,
    update,
    remove,
  } = useProductionOrdersStore();

  const stagesStore =
    useProductionOrderStagesStore();

  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] =
    useState(false);
  const [modalMode, setModalMode] =
    useState("add");
  const [editingRow, setEditingRow] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [startingId, setStartingId] =
    useState(null);

  const [confirmStartId, setConfirmStartId] =
    useState(null);

  const [confirmDeleteId, setConfirmDeleteId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [toast, setToast] =
    useState(null);

  const activeFilters = Object.values(
    filters
  ).some(
    (value) =>
      value !== "" &&
      value !== null &&
      value !== undefined
  );

  const rawRows =
    hasSearch && activeFilters
      ? searchState.data
      : getAllState.data;

  const rows = Array.isArray(rawRows)
    ? rawRows
    : [];

  const loading =
    hasSearch && activeFilters
      ? searchState.loading
      : getAllState.loading;

  const completedCount = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.statusName === "مكتملة"
      ).length,
    [rows]
  );

  useEffect(() => {
    fetchAll?.();
  }, []);

  useEffect(() => {
    if (!hasSearch) return;

    if (activeFilters) {
      const cleaned = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) =>
            value !== "" &&
            value !== null &&
            value !== undefined
        )
      );

      search(cleaned);
    }
  }, [filters]);

  const showToast = (
    type,
    message
  ) => {
    setToast({
      type,
      message,
    });

    setTimeout(
      () => setToast(null),
      4000
    );
  };

  const openAdd = () => {
    setModalMode("add");
    setEditingRow(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setModalMode("edit");
    setEditingRow(row);
    setModalOpen(true);
  };

  const handleFormSubmit = async (
    payload,
    errorMsg
  ) => {
    if (errorMsg) {
      showToast(
        "error",
        errorMsg
      );
      return;
    }

    setSubmitting(true);

    try {
      if (modalMode === "add") {
        await add(payload);
      } else {
        const editPayload = {
          ...payload,
          [keyField]:
            editingRow[keyField],
        };

        await update(
          editingRow[keyField],
          editPayload
        );
      }

      const latestState =
        modalMode === "add"
          ? useProductionOrdersStore.getState()
              .addState
          : useProductionOrdersStore.getState()
              .updateState;

      const {
        success,
        message,
      } = resolveResult(
        latestState,
        "تم حفظ البيانات بنجاح",
        "حدث خطأ أثناء تنفيذ العملية"
      );

      showToast(
        success ? "success" : "error",
        message
      );

      if (success) {
        setModalOpen(false);
        fetchAll?.();
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

  const handleStartProduction =
    async (rowId) => {
      setStartingId(rowId);

      try {
        // orderID plus any autoFrom fields declared on the stages
        // "add" operation (e.g. email) — resolved from the logged-in
        // user, never typed in by hand.
        const {
          payload,
          errorMsg,
        } = resolveAutoFromFields(
          stageAddFields,
          { orderID: rowId }
        );

        if (errorMsg) {
          showToast("error", errorMsg);
          return;
        }

        await stagesStore.add(payload);

        const latestState =
          useProductionOrderStagesStore
            .getState()
            .addState;

        const {
          success,
          message,
        } = resolveResult(
          latestState,
          "تم بدء الإنتاج للطلبية بنجاح",
          "تعذر بدء الإنتاج"
        );

        showToast(
          success ? "success" : "error",
          message
        );

        if (success) {
          // The order's status changes on the backend as a side
          // effect of starting production — refetch so the table
          // reflects the new status instead of showing stale data.
          fetchAll?.();
        }
      } catch {
        showToast(
          "error",
          "تعذر الاتصال بالخادم"
        );
      } finally {
        setStartingId(null);
        setConfirmStartId(null);
      }
    };

  const handleDelete =
    async (rowId) => {
      setDeletingId(rowId);

      try {
        await remove(rowId);

        const latestState =
          useProductionOrdersStore
            .getState()
            .deleteState;

        const {
          success,
          message,
        } = resolveResult(
          latestState,
          "تم حذف الطلبية بنجاح",
          "تعذر حذف الطلبية"
        );

        showToast(
          success ? "success" : "error",
          message
        );

        if (success) {
          fetchAll?.();
        }
      } catch {
        showToast(
          "error",
          "تعذر الاتصال بالخادم"
        );
      } finally {
        setDeletingId(null);
        setConfirmDeleteId(null);
      }
    };

  return (
    <div
      dir="rtl"
      className="
        animate-fade-in
        space-y-5
      "
    >
      {/* =====================================================
          Header
      ===================================================== */}

      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          hasAdd && (
            <button
              onClick={openAdd}
              className="
                inline-flex items-center gap-2
                rounded-lg
                bg-[var(--color-copper-600)]
                px-4 py-2.5
                text-[13px] font-medium
                text-white
                shadow-sm
                hover:opacity-90
                transition
              "
            >
              <Plus size={16} />
              {config.addLabel ||
                "إضافة طلبية"}
            </button>
          )
        }
      />

      {/* =====================================================
          Summary
      ===================================================== */}

      <div className="
        grid grid-cols-1
        sm:grid-cols-3
        gap-3
      ">
        <SummaryCard
          icon={<ClipboardList size={18} />}
          label="إجمالي الطلبيات"
          value={rows.length}
        />

        <SummaryCard
          icon={<CheckCircle2 size={18} />}
          label="الطلبيات المكتملة"
          value={completedCount}
        />

        <SummaryCard
          icon={<Package size={18} />}
          label="قيد المعالجة"
          value={
            Math.max(
              rows.length -
                completedCount,
              0
            )
          }
        />
      </div>

      {/* =====================================================
          Filters
      ===================================================== */}

      {hasSearch && (
        <div
          className="
            rounded-xl
            border border-stone-200
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              flex items-center justify-between
              border-b border-stone-100
              px-4 py-3
            "
          >
            <div className="flex items-center gap-2">
              <div
                className="
                  flex h-8 w-8 items-center
                  justify-center rounded-lg
                  bg-stone-100
                  text-stone-500
                "
              >
                <Filter size={15} />
              </div>

              <div>
                <p className="
                  text-[12.5px]
                  font-semibold
                  text-stone-800
                ">
                  تصفية الطلبيات
                </p>

                <p className="
                  text-[10.5px]
                  text-stone-400
                ">
                  استخدم الحقول لتضييق النتائج
                </p>
              </div>
            </div>

            {activeFilters && (
              <button
                onClick={() =>
                  setFilters({})
                }
                className="
                  text-[11.5px]
                  text-stone-500
                  hover:text-red-600
                  transition
                "
              >
                مسح الفلاتر
              </button>
            )}
          </div>

          <div className="
            flex flex-wrap
            gap-2.5
            p-4
          ">
            {operations.search.filters.map(
              (field) => (
                <FilterField
                  key={field.name}
                  field={field}
                  value={
                    filters[field.name] ||
                    ""
                  }
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      [field.name]:
                        value,
                    }))
                  }
                />
              )
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          Table
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border border-stone-200
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            flex items-center justify-between
            border-b border-stone-100
            px-5 py-3.5
          "
        >
          <div>
            <h2 className="
              text-[14px]
              font-bold
              text-stone-900
            ">
              قائمة الطلبيات
            </h2>

            <p className="
              mt-0.5
              text-[11px]
              text-stone-400
            ">
              إجمالي النتائج:
              {" "}
              <Figures>
                {rows.length}
              </Figures>
            </p>
          </div>

          <button
            onClick={() => fetchAll?.()}
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              border border-stone-200
              text-stone-500
              hover:bg-stone-50
              hover:text-stone-800
              transition
            "
            title="تحديث"
          >
            <RefreshCw
              size={14}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table
            className="
              w-full min-w-[1000px]
              text-[12.5px]
            "
          >
            <thead>
              <tr
                className="
                  bg-stone-50/80
                  border-b border-stone-200
                "
              >
                {columns.map((column) => (
                  <th
                    key={column.field}
                    className="
                      whitespace-nowrap
                      px-5 py-3
                      text-right
                      text-[10.5px]
                      font-semibold
                      text-stone-500
                    "
                  >
                    {column.header}
                  </th>
                ))}

                <th
                  className="
                    px-5 py-3
                    text-right
                    text-[10.5px]
                    font-semibold
                    text-stone-500
                  "
                >
                  الإجراءات
                </th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({
                  length: 6,
                }).map((_, index) => (
                  <tr
                    key={index}
                    className="
                      border-b
                      border-stone-100
                    "
                  >
                    {columns.map(
                      (column) => (
                        <td
                          key={
                            column.field
                          }
                          className="
                            px-5 py-4
                          "
                        >
                          <div
                            className="
                              h-3
                              w-3/4
                              rounded
                              bg-stone-100
                              animate-pulse
                            "
                          />
                        </td>
                      )
                    )}

                    <td className="px-5 py-4">
                      <div
                        className="
                          h-7 w-28
                          rounded
                          bg-stone-100
                          animate-pulse
                        "
                      />
                    </td>
                  </tr>
                ))}

              {!loading &&
                rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={
                        columns.length + 1
                      }
                      className="py-16"
                    >
                      <div className="
                        flex flex-col
                        items-center
                        justify-center
                        text-center
                      ">
                        <div
                          className="
                            flex h-14 w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-stone-100
                            text-stone-400
                          "
                        >
                          <ClipboardList
                            size={24}
                          />
                        </div>

                        <p className="
                          mt-4
                          text-[13px]
                          font-semibold
                          text-stone-700
                        ">
                          {activeFilters
                            ? "لا توجد نتائج مطابقة"
                            : "لا توجد طلبيات بعد"}
                        </p>

                        <p className="
                          mt-1
                          text-[11.5px]
                          text-stone-400
                        ">
                          {activeFilters
                            ? "جرّب تغيير معايير البحث"
                            : "ابدأ بإضافة أول طلبية إنتاج"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              {!loading &&
                rows.map((row) => (
                  <tr
                    key={row[keyField]}
                    className="
                      group
                      border-b
                      border-stone-100
                      last:border-b-0
                      hover:bg-stone-50/70
                      transition
                    "
                  >
                    {columns.map(
                      (column) => (
                        <td
                          key={
                            column.field
                          }
                          className="
                            whitespace-nowrap
                            px-5 py-3.5
                            text-stone-700
                          "
                        >
                          {renderCell(
                            column,
                            row
                          )}
                        </td>
                      )
                    )}

                    <td className="px-5 py-3.5">
                      <div className="
                        flex items-center
                        gap-1.5
                      ">
                        {hasUpdate && (
                          <ActionButton
                            title="تعديل"
                            onClick={() =>
                              openEdit(row)
                            }
                          >
                            <Edit3 size={14} />
                          </ActionButton>
                        )}

                        <button
                          onClick={() =>
                            setConfirmStartId(
                              row[keyField]
                            )
                          }
                          disabled={
                            startingId ===
                            row[keyField]
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-[var(--color-copper-200)]
                            bg-[var(--color-copper-50)]
                            px-2.5 py-1.5
                            text-[11px]
                            font-medium
                            text-[var(--color-copper-700)]
                            hover:bg-[var(--color-copper-600)]
                            hover:text-white
                            disabled:opacity-50
                            transition
                          "
                        >
                          <Play
                            size={12}
                            className={
                              startingId ===
                              row[keyField]
                                ? "animate-spin"
                                : ""
                            }
                          />

                          {startingId ===
                          row[keyField]
                            ? "جارٍ البدء"
                            : "بدء الإنتاج"}
                        </button>

                        {hasDelete && (
                          <ActionButton
                            title="حذف"
                            danger
                            disabled={
                              deletingId ===
                              row[keyField]
                            }
                            onClick={() =>
                              setConfirmDeleteId(
                                row[keyField]
                              )
                            }
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          Start confirmation
      ===================================================== */}

      {confirmStartId !== null && (
        <ConfirmDialog
          title="بدء الإنتاج"
          message="هل تريد بدء الإنتاج لهذه الطلبية؟ سيتم إنشاء مرحلة الإنتاج المرتبطة بها."
          confirmLabel="بدء الإنتاج"
          confirmClass="bg-[var(--color-copper-600)]"
          icon={
            <Play
              size={20}
              className="text-[var(--color-copper-600)]"
            />
          }
          onCancel={() =>
            setConfirmStartId(null)
          }
          onConfirm={() =>
            handleStartProduction(
              confirmStartId
            )
          }
        />
      )}

      {/* =====================================================
          Delete confirmation
      ===================================================== */}

      {confirmDeleteId !== null && (
        <ConfirmDialog
          title="حذف الطلبية"
          message="هل أنت متأكد من حذف هذه الطلبية؟ لا يمكن التراجع عن هذا الإجراء."
          confirmLabel="حذف الطلبية"
          confirmClass="bg-red-600"
          icon={
            <Trash2
              size={20}
              className="text-red-600"
            />
          }
          onCancel={() =>
            setConfirmDeleteId(null)
          }
          onConfirm={() =>
            handleDelete(
              confirmDeleteId
            )
          }
        />
      )}

      {/* =====================================================
          Add / Edit Modal
      ===================================================== */}

      {modalOpen && (
        <div
          className="
            fixed inset-0 z-[60]
            flex items-center justify-center
            bg-black/40 backdrop-blur-[2px]
            p-4
          "
        >
          <div
            className="
              flex flex-col
              w-full max-w-lg
              max-h-[calc(100vh-2rem)]
              overflow-hidden
              rounded-2xl
              bg-white
              border border-stone-200
              shadow-2xl
            "
          >
            <div
              className="
                flex items-center
                justify-between
                border-b border-stone-200
                px-6 py-4
              "
            >
              <div>
                <p className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-[var(--color-copper-600)]
                ">
                  Production Order
                </p>

                <h3 className="
                  mt-1
                  text-[16px]
                  font-bold
                  text-stone-900
                ">
                  {modalMode === "add"
                    ? config.addLabel ||
                      "إضافة طلبية"
                    : "تعديل الطلبية"}
                </h3>
              </div>

              <button
                onClick={() =>
                  setModalOpen(false)
                }
                className="
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-stone-400
                  hover:bg-stone-100
                  hover:text-stone-700
                  transition
                "
              >
                <X size={16} />
              </button>
            </div>

            <OrderForm
              mode={modalMode}
              initialData={editingRow}
              onSubmit={
                handleFormSubmit
              }
              onCancel={() =>
                setModalOpen(false)
              }
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* =====================================================
          Toast
      ===================================================== */}

      {toast && (
        <div
          className="
            fixed bottom-5 left-5
            z-[100]
            w-[calc(100%-2.5rem)]
            max-w-sm
          "
        >
          <div
            className={`
              flex items-start gap-3
              rounded-xl
              border
              px-4 py-3.5
              shadow-xl
              ${
                toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }
            `}
          >
            {toast.type === "success" ? (
              <CheckCircle2
                size={18}
                className="shrink-0 mt-0.5"
              />
            ) : (
              <X
                size={18}
                className="shrink-0 mt-0.5"
              />
            )}

            <p className="text-[12.5px]">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Small Components
========================================================= */

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border border-stone-200
        bg-white
        p-4
        shadow-sm
      "
    >
      <div className="
        flex items-center
        justify-between
      ">
        <div>
          <p className="
            text-[11px]
            text-stone-400
          ">
            {label}
          </p>

          <p className="
            mt-1
            text-[22px]
            font-bold
            tracking-tight
            text-stone-900
          ">
            <Figures>{value}</Figures>
          </p>
        </div>

        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-stone-100
            text-[var(--color-copper-600)]
          "
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  title,
  onClick,
  danger = false,
  disabled = false,
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`
        flex h-8 w-8
        items-center justify-center
        rounded-lg
        border
        transition
        disabled:opacity-40
        ${
          danger
            ? "border-red-100 text-red-500 hover:bg-red-50"
            : "border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
        }
      `}
    >
      {children}
    </button>
  );
}

function renderCell(column, row) {
  const value = row[column.field];

  if (column.field === "statusName") {
    return <StatusBadge status={value} />;
  }

  if (
    column.field === "createdAt" ||
    column.field === "updatedAt"
  ) {
    return (
      <span dir="ltr" className="inline-block">
        <Figures>
          {formatDate(value)}
        </Figures>
      </span>
    );
  }

  if (typeof value === "number") {
    return <Figures>{value}</Figures>;
  }

  return value ?? "-";
}