import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Package,
  Pencil,
  X,
  ChevronDown,
  Layers3,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Figures from "../components/Figures";

import useProductionOrderStagesStore from "../stores/ProductionOrderStagesStore";
import useProductionStageEntriesStore from "../stores/ProductionStageEntriesStore";

import { productionOrderStagesEntity } from "../entities/ProductionOrderStagesEntity";
import { useSourceOptions } from "../hooks/useSourceOptions";

const config = productionOrderStagesEntity;
const { operations } = config;
const keyField = operations.update?.by || "id";

const PAGE_TITLE = "مراحل الطلبات";
const PAGE_DESCRIPTION =
  "متابعة مراحل التصنيع لكل طلبية بشكل واضح ومختصر.";

/* =========================================================
   Hidden Statuses
   الحالات التي لا نريد عرضها للمستخدم
========================================================= */

const HIDDEN_STATUSES = [
  "متوقفة",
  "ملغاة",
];

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
    !state?.errorCode ||
    state.errorCode === 0;

  const message =
    state?.message ||
    (success
      ? fallbackSuccess
      : fallbackError);

  return {
    success,
    message,
  };
}

/* =========================================================
   Edit Stage Modal
========================================================= */

function EditStageForm({
  initialData,
  onSubmit,
  onCancel,
  submitting,
}) {
  const fieldsConfig =
    operations.update.fields;

  const [values, setValues] = useState(() => {
    const initial = {};

    fieldsConfig.forEach((field) => {
      initial[field.name] =
        initialData?.[field.name] ?? "";
    });

    return initial;
  });

  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const missing = fieldsConfig.find(
      (field) => !values[field.name]
    );

    if (missing) {
      setError(
        `الحقل "${missing.label}" مطلوب`
      );
      return;
    }

    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col"
    >
      <div className="px-5 py-5 space-y-4">
        {fieldsConfig.map((field) => {
          if (
            field.type !== "select" ||
            !field.source
          ) {
            return null;
          }

          const {
            options,
            loading,
          } = useSourceOptions(
            field.source
          );

          /*
           * إخفاء الحالات:
           * متوقفة
           * ملغاة
           */
          const visibleOptions =
            options.filter(
              (option) =>
                !HIDDEN_STATUSES.includes(
                  option.label
                )
            );

          return (
            <div key={field.name}>
              <label className="block text-xs font-medium text-[var(--color-ink-700)] mb-2">
                {field.label}
              </label>

              <div className="relative">
                <select
                  value={
                    values[field.name] ?? ""
                  }
                  onChange={(event) => {
                    setValues((prev) => ({
                      ...prev,
                      [field.name]:
                        event.target.value,
                    }));

                    setError("");
                  }}
                  className="
                    w-full appearance-none
                    rounded-xl
                    border border-stone-200
                    bg-stone-50
                    px-3.5 py-3
                    text-sm
                    text-[var(--color-ink-900)]
                    transition
                    focus:border-[var(--color-copper-500)]
                    focus:bg-white
                    focus:outline-none
                  "
                >
                  <option value="">
                    {loading
                      ? "جارٍ التحميل..."
                      : "اختر..."}
                  </option>

                  {visibleOptions.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={16}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-stone-400
                  "
                />
              </div>
            </div>
          );
        })}

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-stone-100 bg-stone-50 px-5 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="
            rounded-xl
            px-4 py-2.5
            text-sm
            text-[var(--color-ink-600)]
            hover:bg-white
            transition
          "
        >
          إلغاء
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="
            rounded-xl
            bg-[var(--color-graphite-950)]
            px-5 py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
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
   Stage Details Drawer
========================================================= */

function StageDetailsPanel({
  stage,
  onClose,
}) {
  const {
    searchState,
    search,
  } = useProductionStageEntriesStore();

  useEffect(() => {
    search({
      OrderStageID: stage.id,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.id]);

  const entries =
    Array.isArray(searchState.data)
      ? searchState.data
      : [];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}

      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="
          absolute inset-0
          bg-black/20
          backdrop-blur-[2px]
        "
      />

      {/* Drawer */}

      <aside
        className="
          absolute
          right-0 top-0
          h-full
          w-full
          max-w-md
          bg-white
          shadow-2xl
          flex flex-col
          animate-fade-in
        "
      >
        {/* Header */}

        <div className="border-b border-stone-100 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl
                    bg-stone-100
                    text-[var(--color-copper-700)]
                  "
                >
                  <ClipboardList size={17} />
                </span>

                <span className="text-xs text-stone-500">
                  تفاصيل المرحلة
                </span>
              </div>

              <h3 className="text-base font-bold text-[var(--color-ink-900)]">
                {stage.stageName}
              </h3>

              <p className="mt-1 text-xs text-stone-500">
                طلبية #
                <Figures>
                  {stage.orderID}
                </Figures>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                text-stone-500
                hover:bg-stone-100
                transition
              "
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Entries */}

        <div className="flex-1 overflow-y-auto bg-stone-50 p-4">
          {searchState.loading && (
            <div className="space-y-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="
                      rounded-2xl
                      border border-stone-100
                      bg-white
                      p-4
                    "
                  >
                    <div className="h-3 w-24 animate-pulse rounded bg-stone-100" />

                    <div className="mt-3 h-5 w-16 animate-pulse rounded bg-stone-100" />

                    <div className="mt-4 h-3 w-full animate-pulse rounded bg-stone-100" />
                  </div>
                )
              )}
            </div>
          )}

          {!searchState.loading &&
            entries.length === 0 && (
              <div
                className="
                  flex
                  min-h-[260px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border border-dashed border-stone-200
                  bg-white
                  px-6
                  text-center
                "
              >
                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-stone-100
                    text-stone-400
                  "
                >
                  <Package size={20} />
                </div>

                <p className="mt-3 text-sm font-medium text-stone-700">
                  لا توجد إدخالات
                </p>

                <p className="mt-1 text-xs text-stone-400">
                  لم يتم تسجيل أي إدخال لهذه المرحلة بعد
                </p>
              </div>
            )}

          {!searchState.loading &&
            entries.length > 0 && (
              <div className="space-y-3">
                {entries.map(
                  (entry) => (
                    <div
                      key={entry.id}
                      className="
                        rounded-2xl
                        border border-stone-100
                        bg-white
                        p-4
                        shadow-sm
                      "
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              flex h-10 w-10
                              items-center justify-center
                              rounded-xl
                              bg-stone-100
                              text-[var(--color-copper-700)]
                            "
                          >
                            <Package size={17} />
                          </div>

                          <div>
                            <p className="text-[11px] text-stone-400">
                              الكمية
                            </p>

                            <p className="mt-0.5 text-lg font-bold text-[var(--color-ink-900)]">
                              <Figures>
                                {entry.quantity}
                              </Figures>
                            </p>
                          </div>
                        </div>

                        <span
                          dir="ltr"
                          className="text-[10px] text-stone-400"
                        >
                          <Figures>
                            {formatDateTime(
                              entry.createdAt
                            )}
                          </Figures>
                        </span>
                      </div>

                      {entry.notes && (
                        <div className="mt-4 border-t border-stone-100 pt-3">
                          <p className="text-xs leading-6 text-stone-600">
                            {entry.notes}
                          </p>
                        </div>
                      )}

                      {entry.userName && (
                        <p className="mt-3 text-[11px] text-stone-400">
                          بواسطة:{" "}
                          {entry.userName}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      </aside>
    </div>
  );
}

/* =========================================================
   Order Card
========================================================= */

function OrderStagesCard({
  orderId,
  stages,
  onEdit,
  onDetails,
}) {
  const completedCount =
    stages.filter(
      (stage) =>
        stage.statusName === "مكتملة"
    ).length;

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border border-stone-200
        bg-white
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      {/* Order Header */}

      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-stone-100
              text-[var(--color-copper-700)]
            "
          >
            <Layers3 size={18} />
          </div>

          <div>
            <p className="text-[11px] text-stone-400">
              طلبية إنتاج
            </p>

            <h3 className="mt-0.5 text-sm font-bold text-[var(--color-ink-900)]">
              #
              <Figures>
                {orderId}
              </Figures>
            </h3>
          </div>
        </div>

        <div className="text-left">
          <p className="text-xs font-semibold text-[var(--color-ink-700)]">
            <Figures>
              {completedCount}
            </Figures>

            <span className="mx-1 text-stone-300">
              /
            </span>

            <Figures>
              {stages.length}
            </Figures>
          </p>

          <p className="text-[10px] text-stone-400">
            مكتملة
          </p>
        </div>
      </div>

      {/* Progress */}

      <div className="px-5 pb-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
          <div
            className="
              h-full
              rounded-full
              bg-[var(--color-copper-600)]
              transition-all
            "
            style={{
              width:
                stages.length > 0
                  ? `${
                      (completedCount /
                        stages.length) *
                      100
                    }%`
                  : "0%",
            }}
          />
        </div>
      </div>

      {/* Stages */}

      <div className="border-t border-stone-100">
        {stages.map(
          (stage, index) => {
            const completed =
              stage.statusName ===
              "مكتملة";

            return (
              <div
                key={stage.id}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  px-5 py-3.5
                  border-b border-stone-100
                  last:border-b-0
                  transition
                  hover:bg-stone-50
                "
              >
                {/* Step */}

                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                  {index !==
                    stages.length - 1 && (
                    <span
                      className="
                        absolute
                        top-8
                        left-1/2
                        h-7
                        w-px
                        -translate-x-1/2
                        bg-stone-200
                      "
                    />
                  )}

                  <span
                    className={`
                      relative z-10
                      flex h-7 w-7
                      items-center justify-center
                      rounded-full
                      border
                      text-[10px]
                      font-semibold
                      transition
                      ${
                        completed
                          ? `
                            border-[var(--color-copper-600)]
                            bg-[var(--color-copper-600)]
                            text-white
                          `
                          : `
                            border-stone-200
                            bg-white
                            text-stone-400
                          `
                      }
                    `}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">
                      {stage.stageName}
                    </p>

                    <StatusBadge
                      status={
                        stage.statusName
                      }
                    />
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span
                      dir="ltr"
                      className="text-[10px] text-stone-400"
                    >
                      #
                      <Figures>
                        {stage.id}
                      </Figures>
                    </span>

                    <span className="text-stone-300">
                      •
                    </span>

                    <span
                      dir="ltr"
                      className="text-[10px] text-stone-400"
                    >
                      <Figures>
                        {formatDate(
                          stage.createdAt
                        )}
                      </Figures>
                    </span>
                  </div>
                </div>

                {/* Actions */}

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-1
                    opacity-100
                    md:opacity-0
                    md:group-hover:opacity-100
                    transition
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(stage)
                    }
                    title="تعديل"
                    className="
                      flex h-8 w-8
                      items-center justify-center
                      rounded-lg
                      text-stone-500
                      hover:bg-white
                      hover:text-[var(--color-ink-900)]
                      transition
                    "
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDetails(stage)
                    }
                    title="التفاصيل"
                    className="
                      flex h-8 w-8
                      items-center justify-center
                      rounded-lg
                      text-[var(--color-copper-700)]
                      hover:bg-white
                      transition
                    "
                  >
                    <ClipboardList
                      size={15}
                    />
                  </button>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

/* =========================================================
   Main Page
========================================================= */

export default function ProductionOrderStagesPage() {
  const {
    searchState,
    getAllState,
    search,
    fetchAll,
    update,
  } =
    useProductionOrderStagesStore();

  const [filters, setFilters] =
    useState({});

  const [editingStage, setEditingStage] =
    useState(null);

  const [detailsStage, setDetailsStage] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [toast, setToast] =
    useState(null);

  const activeFilters =
    Object.values(filters).some(
      (value) =>
        value !== "" &&
        value != null
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
  }, []);

  useEffect(() => {
    if (!activeFilters) {
      return;
    }

    const cleaned =
      Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) =>
            value !== "" &&
            value != null
        )
      );

    search(cleaned);
  }, [filters]);

  const showToast = (
    type,
    message
  ) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const groupedByOrder =
    useMemo(() => {
      const map = new Map();

      rows.forEach((row) => {
        if (!map.has(row.orderID)) {
          map.set(row.orderID, []);
        }

        map.get(row.orderID).push(row);
      });

      return Array.from(
        map.entries()
      ).sort(
        (a, b) => b[0] - a[0]
      );
    }, [rows]);

  const handleUpdateSubmit =
    async (payload) => {
      setSubmitting(true);

      try {
        const editPayload = {
          ...payload,
          [keyField]:
            editingStage[keyField],
        };

        await update(
          editingStage[keyField],
          editPayload
        );

        const latestState =
          useProductionOrderStagesStore.getState()
            .updateState;

        const {
          success,
          message,
        } = resolveResult(
          latestState,
          "تم تعديل المرحلة بنجاح",
          "تعذر تعديل المرحلة"
        );

        showToast(
          success
            ? "success"
            : "error",
          message
        );

        if (success) {
          setEditingStage(null);
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

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
      />

      {/* =====================================================
          Filters
      ====================================================== */}

      <div
        className="
          mb-6
          rounded-2xl
          border border-stone-200
          bg-white
          p-3
          shadow-sm
        "
      >
        <div className="flex flex-wrap items-center gap-2">
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

          {activeFilters && (
            <button
              type="button"
              onClick={() =>
                setFilters({})
              }
              className="
                rounded-xl
                px-3 py-2
                text-xs
                text-stone-500
                hover:bg-stone-100
                transition
              "
            >
              مسح الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          Loading
      ====================================================== */}

      {loading && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="
                  rounded-2xl
                  border border-stone-200
                  bg-white
                  p-5
                "
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-stone-100" />

                  <div className="flex-1">
                    <div className="h-3 w-20 animate-pulse rounded bg-stone-100" />

                    <div className="mt-2 h-4 w-28 animate-pulse rounded bg-stone-100" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[1, 2, 3].map(
                    (line) => (
                      <div
                        key={line}
                        className="h-10 animate-pulse rounded-xl bg-stone-100"
                      />
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* =====================================================
          Empty
      ====================================================== */}

      {!loading &&
        groupedByOrder.length === 0 && (
          <div
            className="
              flex
              min-h-[300px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border border-dashed border-stone-200
              bg-white
              text-center
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-stone-100
                text-stone-400
              "
            >
              <Layers3 size={22} />
            </div>

            <p className="mt-4 text-sm font-semibold text-stone-700">
              {activeFilters
                ? "لا توجد نتائج مطابقة"
                : "لا توجد بيانات بعد"}
            </p>

            <p className="mt-1 text-xs text-stone-400">
              {activeFilters
                ? "جرّب تغيير خيارات البحث"
                : "ستظهر الطلبات هنا عند توفرها"}
            </p>
          </div>
        )}

      {/* =====================================================
          Orders
      ====================================================== */}

      {!loading &&
        groupedByOrder.length > 0 && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {groupedByOrder.map(
              ([orderId, stages]) => (
                <OrderStagesCard
                  key={orderId}
                  orderId={orderId}
                  stages={stages}
                  onEdit={
                    setEditingStage
                  }
                  onDetails={
                    setDetailsStage
                  }
                />
              )
            )}
          </div>
        )}

      {/* =====================================================
          Edit Modal
      ====================================================== */}

      {editingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              border border-stone-200
              bg-white
              shadow-2xl
            "
          >
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <div>
                <p className="text-[11px] text-stone-400">
                  تعديل المرحلة
                </p>

                <h3 className="mt-1 text-sm font-bold text-[var(--color-ink-900)]">
                  {
                    editingStage.stageName
                  }
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingStage(
                    null
                  )
                }
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  text-stone-500
                  hover:bg-stone-100
                "
              >
                <X size={17} />
              </button>
            </div>

            <EditStageForm
              initialData={
                editingStage
              }
              onSubmit={
                handleUpdateSubmit
              }
              onCancel={() =>
                setEditingStage(
                  null
                )
              }
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* =====================================================
          Details
      ====================================================== */}

      {detailsStage && (
        <StageDetailsPanel
          stage={detailsStage}
          onClose={() =>
            setDetailsStage(null)
          }
        />
      )}

      {/* =====================================================
          Toast
      ====================================================== */}

      {toast && (
        <div
          className={`
            fixed
            bottom-5
            left-5
            z-[60]
            max-w-sm
            rounded-xl
            px-4 py-3
            text-sm
            text-white
            shadow-lg
            ${
              toast.type ===
              "success"
                ? "bg-[var(--color-status-success)]"
                : "bg-[var(--color-status-danger)]"
            }
          `}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Filter Field
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
    } = useSourceOptions(
      field.source
    );

    /*
     * إخفاء الحالات:
     * متوقفة
     * ملغاة
     */
    const visibleOptions =
      options.filter(
        (option) =>
          !HIDDEN_STATUSES.includes(
            option.label
          )
      );

    return (
      <div className="relative min-w-[170px]">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="
            w-full
            appearance-none
            rounded-xl
            border border-stone-200
            bg-stone-50
            px-3
            py-2.5
            pl-8
            text-xs
            text-[var(--color-ink-700)]
            transition
            focus:border-[var(--color-copper-500)]
            focus:bg-white
            focus:outline-none
          "
        >
          <option value="">
            {field.label}
          </option>

          {!loading &&
            visibleOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
        </select>

        <ChevronDown
          size={14}
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-stone-400
          "
        />
      </div>
    );
  }

  return (
    <input
      type="text"
      placeholder={field.label}
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value
        )
      }
      className="
        min-w-[170px]
        rounded-xl
        border border-stone-200
        bg-stone-50
        px-3
        py-2.5
        text-xs
        text-[var(--color-ink-700)]
        placeholder:text-stone-400
        transition
        focus:border-[var(--color-copper-500)]
        focus:bg-white
        focus:outline-none
      "
    />
  );
}