import { useEffect, useMemo, useState } from "react";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  Scissors,
  PaintBucket,
  Boxes,
  ClipboardList,
  Gauge,
  AlertCircle,
  FileSearch,
  Layers,
} from "lucide-react";

import useReportOrdersStore from "../stores/ReportOrdersStore";
import { report_OrdersEntity } from "../entities/Report_OrdersEntity";

import Figures from "../components/Figures";
import StatusBadge from "../components/StatusBadge";

/* ================================================================
   CONFIG
================================================================ */

const SEARCH_CONFIG = report_OrdersEntity.operations.search;

const FILTER_DEFS = SEARCH_CONFIG?.filters ?? [];
const COLUMNS = SEARCH_CONFIG?.columns ?? [];

/* ================================================================
   HELPERS
================================================================ */

const EMPTY_FILTERS = FILTER_DEFS.reduce((acc, filter) => {
  acc[filter.name] = "";
  return acc;
}, {});

function toNum(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function sumBy(rows, field) {
  return rows.reduce((sum, row) => {
    return sum + toNum(row?.[field]);
  }, 0);
}

function avgBy(rows, field) {
  if (!rows.length) return 0;

  return sumBy(rows, field) / rows.length;
}

function formatInt(value) {
  return Math.round(toNum(value)).toLocaleString("en-US");
}

function formatDecimal(value) {
  return toNum(value).toFixed(1);
}

function formatPct(value) {
  return `${formatDecimal(value)}%`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function cleanFilters(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    )
  );
}

/* ================================================================
   NUMBER COMPONENT
================================================================ */

function Num({ children, className = "" }) {
  return (
    <span
      dir="ltr"
      className={`inline-block tabular-nums ${className}`}
    >
      <Figures>{children}</Figures>
    </span>
  );
}

/* ================================================================
   DISTINCT OPTIONS
================================================================ */

function useDistinctOptions(rows, field) {
  return useMemo(() => {
    const values = new Set();

    rows.forEach((row) => {
      const value = row?.[field];

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        values.add(String(value));
      }
    });

    return Array.from(values).sort((a, b) =>
      a.localeCompare(b, "ar")
    );
  }, [rows, field]);
}

/* ================================================================
   FILTERS
================================================================ */

function ReportFilters({
  rows,
  draft,
  onChange,
  onClear,
}) {
  const [expanded, setExpanded] = useState(true);

  const orderOptions = useDistinctOptions(rows, "orderID");
  const productOptions = useDistinctOptions(rows, "productName");
  const statusOptions = useDistinctOptions(rows, "statusName");

  const optionsMap = {
    OrderID: orderOptions,
    ProductName: productOptions,
    StatusName: statusOptions,
  };

  const activeFilters = FILTER_DEFS.filter(
    (filter) =>
      draft[filter.name] !== "" &&
      draft[filter.name] !== null &&
      draft[filter.name] !== undefined
  );

  return (
    <section className="border border-[var(--color-stone-300,#d8d2c6)] bg-white">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-4 border-b border-[var(--color-stone-200,#e7e2d8)] px-5 py-4 text-start"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            strokeWidth={1.7}
            className="text-[var(--color-copper-600,#a1541f)]"
          />

          <div>
            <div className="text-sm font-semibold text-[var(--color-ink-900,#2b2723)]">
              نطاق التقرير
            </div>

            <div className="mt-0.5 text-[11px] text-[var(--color-ink-500,#78716a)]">
              اختر الطلبية أو المنتج أو الحالة أو الفترة الزمنية
            </div>
          </div>
        </div>

        <ChevronDown
          size={17}
          className={`transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-stone-200,#e7e2d8)] px-5 py-3">
          {activeFilters.map((filter) => (
            <div
              key={filter.name}
              className="flex items-center gap-2 border border-[var(--color-copper-300,#d6a57e)] bg-[var(--color-copper-50,#faf0e8)] px-2.5 py-1.5 text-xs"
            >
              <span className="text-[var(--color-ink-500,#78716a)]">
                {filter.label}:
              </span>

              <span className="font-medium text-[var(--color-copper-700,#87471f)]">
                {draft[filter.name]}
              </span>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...draft,
                    [filter.name]: "",
                  })
                }
                className="text-[var(--color-ink-400,#9c9690)] hover:text-[var(--color-status-danger,#a8452f)]"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-[var(--color-ink-500,#78716a)] hover:text-[var(--color-copper-700,#87471f)]"
          >
            <RotateCcw size={12} />
            مسح الكل
          </button>
        </div>
      )}

      {/* Inputs */}
      {expanded && (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
          {FILTER_DEFS.map((filter) => {
            if (filter.type === "select") {
              const options =
                optionsMap[filter.name] ?? [];

              return (
                <label
                  key={filter.name}
                  className="flex flex-col gap-1.5"
                >
                  <span className="text-[11px] font-medium text-[var(--color-ink-500,#78716a)]">
                    {filter.label}
                  </span>

                  <select
                    value={draft[filter.name] ?? ""}
                    onChange={(event) =>
                      onChange({
                        ...draft,
                        [filter.name]: event.target.value,
                      })
                    }
                    className="h-9 border border-[var(--color-stone-300,#d8d2c6)] bg-white px-2.5 text-sm text-[var(--color-ink-900,#2b2723)] outline-none focus:border-[var(--color-copper-500,#b8632c)]"
                  >
                    <option value="">الكل</option>

                    {options.map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label
                key={filter.name}
                className="flex flex-col gap-1.5"
              >
                <span className="text-[11px] font-medium text-[var(--color-ink-500,#78716a)]">
                  {filter.label}
                </span>

                <input
                  type="date"
                  value={draft[filter.name] ?? ""}
                  onChange={(event) =>
                    onChange({
                      ...draft,
                      [filter.name]: event.target.value,
                    })
                  }
                  className="h-9 border border-[var(--color-stone-300,#d8d2c6)] bg-white px-2.5 text-sm text-[var(--color-ink-900,#2b2723)] outline-none focus:border-[var(--color-copper-500,#b8632c)]"
                  dir="ltr"
                />
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ================================================================
   SUMMARY STRIP
================================================================ */

function SummaryStrip({ rows }) {
  const items = [
    {
      label: "الطلبيات",
      value: formatInt(rows.length),
      icon: ClipboardList,
    },
    {
      label: "المطلوب",
      value: formatInt(
        sumBy(rows, "requestedQuantity")
      ),
      icon: Layers,
    },
    {
      label: "الإنتاج النهائي",
      value: formatInt(
        sumBy(rows, "finalProducedQuantity")
      ),
      icon: PackageCheck,
    },
    {
      label: "المتبقي",
      value: formatInt(
        sumBy(rows, "remainingQuantity")
      ),
      icon: Gauge,
    },
    {
      label: "إجمالي الهدر",
      value: formatInt(
        sumBy(rows, "totalWasteQuantity")
      ),
      icon: AlertTriangle,
    },
    {
      label: "متوسط الإنجاز",
      value: formatPct(
        avgBy(
          rows,
          "productionCompletionPercentage"
        )
      ),
      icon: TrendingUp,
    },
    {
      label: "متوسط الهدر",
      value: formatPct(
        avgBy(rows, "wastePercentage")
      ),
      icon: AlertTriangle,
    },
  ];

  return (
    <section className="border border-[var(--color-stone-300,#d8d2c6)] bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`px-4 py-4 ${
                index > 0
                  ? "border-t md:border-e md:border-t-0"
                  : ""
              } border-[var(--color-stone-200,#e7e2d8)]`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-ink-500,#78716a)]">
                <Icon
                  size={13}
                  strokeWidth={1.7}
                />

                <span>{item.label}</span>
              </div>

              <div className="mt-1.5 text-lg font-semibold text-[var(--color-ink-900,#2b2723)]">
                <Num>{item.value}</Num>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ================================================================
   PRODUCTION FLOW
================================================================ */

function ProductionFlow({ rows }) {
  const stages = [
    {
      label: "المطلوب",
      value: sumBy(rows, "requestedQuantity"),
      waste: 0,
      icon: ClipboardList,
    },
    {
      label: "القص",
      value: sumBy(rows, "cuttingGoodQuantity"),
      waste: sumBy(rows, "cuttingWaste"),
      icon: Scissors,
    },
    {
      label: "التلوين",
      value: sumBy(rows, "paintingGoodQuantity"),
      waste: sumBy(rows, "paintingWaste"),
      icon: PaintBucket,
    },
    {
      label: "التعبئة",
      value: sumBy(rows, "finalProducedQuantity"),
      waste: sumBy(rows, "packagingWaste"),
      icon: Boxes,
    },
  ];

  const base =
    sumBy(rows, "requestedQuantity") || 1;

  return (
    <section className="border border-[var(--color-stone-300,#d8d2c6)] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-base font-bold text-[var(--color-ink-900,#2b2723)]">
            حركة الإنتاج
          </h2>

          <p className="mt-1 text-xs text-[var(--color-ink-500,#78716a)]">
            مقارنة الكميات الصافية والهدر عبر مراحل الإنتاج
          </p>
        </div>

        <Layers
          size={18}
          strokeWidth={1.6}
          className="text-[var(--color-copper-500,#b8632c)]"
        />
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {stages.map((stage) => {
          const Icon = stage.icon;

          const goodWidth = Math.min(
            (stage.value / base) * 100,
            100
          );

          const wasteWidth = Math.min(
            (stage.waste / base) * 100,
            100
          );

          return (
            <div key={stage.label}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink-700,#3d3833)]">
                  <Icon
                    size={14}
                    strokeWidth={1.7}
                  />

                  {stage.label}
                </div>

                <div className="text-xs text-[var(--color-ink-500,#78716a)]">
                  <Num>
                    {formatInt(stage.value)}
                  </Num>
                </div>
              </div>

              <div className="h-6 overflow-hidden bg-[var(--color-stone-100,#f1ede4)]">
                <div className="flex h-full">
                  <div
                    className="h-full bg-[var(--color-graphite-800,#3a3733)] transition-all duration-500"
                    style={{
                      width: `${goodWidth}%`,
                    }}
                  />

                  <div
                    className="h-full bg-[var(--color-status-danger,#a8452f)] transition-all duration-500"
                    style={{
                      width: `${wasteWidth}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-1.5 flex gap-4 text-[10.5px]">
                <span className="text-[var(--color-ink-500,#78716a)]">
                  صافي:
                  {" "}
                  <Num>
                    {formatInt(stage.value)}
                  </Num>
                </span>

                {stage.waste > 0 && (
                  <span className="text-[var(--color-status-danger,#a8452f)]">
                    هدر:
                    {" "}
                    <Num>
                      {formatInt(stage.waste)}
                    </Num>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ================================================================
   WASTE ANALYSIS
================================================================ */

function WasteAnalysis({ rows }) {
  const stages = [
    {
      label: "القص",
      value: sumBy(rows, "cuttingWaste"),
      icon: Scissors,
    },
    {
      label: "التلوين",
      value: sumBy(rows, "paintingWaste"),
      icon: PaintBucket,
    },
    {
      label: "التعبئة",
      value: sumBy(rows, "packagingWaste"),
      icon: Boxes,
    },
  ];

  const max =
    Math.max(
      ...stages.map((stage) => stage.value),
      1
    );

  const total = stages.reduce(
    (sum, stage) => sum + stage.value,
    0
  );

  return (
    <section className="border border-[var(--color-stone-300,#d8d2c6)] bg-white p-5">
      <h2 className="font-display text-base font-bold text-[var(--color-ink-900,#2b2723)]">
        تحليل الهدر
      </h2>

      <p className="mt-1 text-xs text-[var(--color-ink-500,#78716a)]">
        توزيع إجمالي الهدر بين مراحل الإنتاج
      </p>

      <div className="mt-6 flex flex-col gap-5">
        {stages.map((stage) => {
          const Icon = stage.icon;

          const percentage =
            total > 0
              ? (stage.value / total) * 100
              : 0;

          return (
            <div key={stage.label}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink-700,#3d3833)]">
                  <Icon size={14} />

                  {stage.label}
                </div>

                <div className="text-xs">
                  <Num>
                    {formatInt(stage.value)}
                  </Num>

                  <span className="ms-1 text-[var(--color-ink-400,#9c9690)]">
                    ({formatPct(percentage)})
                  </span>
                </div>
              </div>

              <div className="h-4 bg-[var(--color-stone-100,#f1ede4)]">
                <div
                  className="h-full bg-[var(--color-status-danger,#a8452f)] transition-all duration-500"
                  style={{
                    width: `${(stage.value / max) * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ================================================================
   ATTENTION BOARD
================================================================ */

function RankedList({
  title,
  rows,
  field,
  direction = "desc",
  unit = "",
}) {
  const ranked = useMemo(() => {
    return [...rows]
      .sort((a, b) => {
        const av = toNum(a?.[field]);
        const bv = toNum(b?.[field]);

        return direction === "desc"
          ? bv - av
          : av - bv;
      })
      .slice(0, 5);
  }, [rows, field, direction]);

  return (
    <div className="border border-[var(--color-stone-300,#d8d2c6)] bg-white p-4">
      <h3 className="text-sm font-semibold text-[var(--color-ink-800,#2b2723)]">
        {title}
      </h3>

      <div className="mt-3 divide-y divide-[var(--color-stone-200,#e7e2d8)]">
        {ranked.length === 0 && (
          <div className="py-4 text-xs text-[var(--color-ink-400,#9c9690)]">
            لا توجد بيانات
          </div>
        )}

        {ranked.map((row, index) => (
          <div
            key={`${row.orderID}-${index}`}
            className="flex items-center justify-between gap-4 py-2.5"
          >
            <div className="min-w-0 truncate text-xs text-[var(--color-ink-700,#3d3833)]">
              <span className="font-medium">
                #{row.orderID}
              </span>

              {" — "}

              {row.productName || "بدون منتج"}
            </div>

            <div className="shrink-0 text-xs font-medium text-[var(--color-ink-900,#2b2723)]">
              <Num>
                {field.includes("Percentage")
                  ? formatDecimal(row[field])
                  : formatInt(row[field])}
              </Num>

              {unit && (
                <span className="ms-1">
                  {unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttentionBoard({ rows }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-display text-base font-bold text-[var(--color-ink-900,#2b2723)]">
          طلبيات تستحق الانتباه
        </h2>

        <p className="mt-1 text-xs text-[var(--color-ink-500,#78716a)]">
          ترتيب مبني على البيانات الفعلية الموجودة في التقرير
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <RankedList
          title="الأعلى هدرًا"
          rows={rows}
          field="wastePercentage"
          direction="desc"
          unit="%"
        />

        <RankedList
          title="الأكبر كمية متبقية"
          rows={rows}
          field="remainingQuantity"
          direction="desc"
        />

        <RankedList
          title="الأقل إنجازًا"
          rows={rows}
          field="productionCompletionPercentage"
          direction="asc"
          unit="%"
        />
      </div>
    </section>
  );
}

/* ================================================================
   TABLE
================================================================ */

const GROUPS = [
  {
    label: "الطلبية",
    fields: [
      "orderID",
      "productName",
      "statusName",
      "createdAt",
    ],
  },
  {
    label: "المطلوب",
    fields: ["requestedQuantity"],
  },
  {
    label: "القص",
    fields: [
      "cuttingQuantity",
      "cuttingWaste",
      "cuttingGoodQuantity",
    ],
  },
  {
    label: "التلوين",
    fields: [
      "paintingQuantity",
      "paintingWaste",
      "paintingGoodQuantity",
    ],
  },
  {
    label: "التعبئة",
    fields: [
      "packagingQuantity",
      "packagingWaste",
      "finalProducedQuantity",
    ],
  },
  {
    label: "النتيجة",
    fields: [
      "totalWasteQuantity",
      "remainingQuantity",
      "productionCompletionPercentage",
      "wastePercentage",
    ],
  },
];

const PERCENT_FIELDS = new Set([
  "productionCompletionPercentage",
  "wastePercentage",
]);

const DATE_FIELDS = new Set([
  "createdAt",
]);

const STRING_FIELDS = new Set([
  "productName",
  "statusName",
]);

function OrdersExplorer({ rows }) {
  const [sort, setSort] = useState({
    field: "createdAt",
    direction: "desc",
  });

  const columnMap = useMemo(() => {
    return Object.fromEntries(
      COLUMNS.map((column) => [
        column.field,
        column,
      ])
    );
  }, []);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = a?.[sort.field];
      const bv = b?.[sort.field];

      if (DATE_FIELDS.has(sort.field)) {
        const ad = new Date(av).getTime() || 0;
        const bd = new Date(bv).getTime() || 0;

        return sort.direction === "desc"
          ? bd - ad
          : ad - bd;
      }

      if (STRING_FIELDS.has(sort.field)) {
        const result = String(av ?? "").localeCompare(
          String(bv ?? ""),
          "ar"
        );

        return sort.direction === "desc"
          ? -result
          : result;
      }

      const an = toNum(av);
      const bn = toNum(bv);

      return sort.direction === "desc"
        ? bn - an
        : an - bn;
    });
  }, [rows, sort]);

  function toggleSort(field) {
    setSort((previous) => {
      if (previous.field !== field) {
        return {
          field,
          direction: "desc",
        };
      }

      return {
        field,
        direction:
          previous.direction === "desc"
            ? "asc"
            : "desc",
      };
    });
  }

  function renderCell(row, field) {
    const value = row?.[field];

    if (field === "statusName") {
      return (
        <StatusBadge status={value} />
      );
    }

    if (field === "createdAt") {
      return (
        <Num>
          {formatDate(value)}
        </Num>
      );
    }

    if (field === "productName") {
      return value || "—";
    }

    if (field === "orderID") {
      return (
        <Num>
          {value}
        </Num>
      );
    }

    if (PERCENT_FIELDS.has(field)) {
      return (
        <Num>
          {formatPct(value)}
        </Num>
      );
    }

    return (
      <Num>
        {formatInt(value)}
      </Num>
    );
  }

  return (
    <section className="border border-[var(--color-stone-300,#d8d2c6)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--color-stone-200,#e7e2d8)] px-5 py-4">
        <div>
          <h2 className="font-display text-base font-bold text-[var(--color-ink-900,#2b2723)]">
            سجل الطلبيات
          </h2>

          <p className="mt-1 text-xs text-[var(--color-ink-500,#78716a)]">
            استكشف كامل البيانات مع إمكانية ترتيب الأعمدة
          </p>
        </div>

        <span className="text-xs text-[var(--color-ink-500,#78716a)]">
          <Num>{rows.length}</Num>
          {" "}
          طلبية
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1500px] border-collapse text-sm">
          <thead>
            <tr>
              {GROUPS.map((group) => (
                <th
                  key={group.label}
                  colSpan={group.fields.length}
                  className="border-e border-b border-[var(--color-stone-200,#e7e2d8)] bg-[var(--color-stone-50,#faf8f4)] px-3 py-2 text-start text-[10.5px] font-semibold tracking-wide text-[var(--color-copper-700,#87471f)]"
                >
                  {group.label}
                </th>
              ))}
            </tr>

            <tr className="border-b border-[var(--color-stone-300,#d8d2c6)]">
              {GROUPS.flatMap((group) =>
                group.fields.map((field) => {
                  const column = columnMap[field];

                  if (!column) {
                    return null;
                  }

                  const isSticky =
                    field === "orderID";

                  return (
                    <th
                      key={field}
                      onClick={() =>
                        toggleSort(field)
                      }
                      className={`cursor-pointer whitespace-nowrap px-3 py-2 text-start text-[11px] font-medium text-[var(--color-ink-700,#3d3833)] hover:bg-[var(--color-stone-100,#f1ede4)] ${
                        isSticky
                          ? "sticky right-0 z-20 bg-white"
                          : ""
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {column.header}

                        <ArrowUpDown
                          size={11}
                          strokeWidth={1.8}
                          className={
                            sort.field === field
                              ? "text-[var(--color-copper-600,#a1541f)]"
                              : "text-[var(--color-ink-300,#b8b1a7)]"
                          }
                        />
                      </span>
                    </th>
                  );
                })
              )}
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((row, index) => (
              <tr
                key={
                  row.orderID ??
                  `${index}`
                }
                className="border-b border-[var(--color-stone-100,#f1ede4)] hover:bg-[var(--color-stone-50,#faf8f4)]"
              >
                {GROUPS.flatMap((group) =>
                  group.fields.map((field) => {
                    const isSticky =
                      field === "orderID";

                    return (
                      <td
                        key={field}
                        className={`whitespace-nowrap px-3 py-2.5 text-xs text-[var(--color-ink-800,#2b2723)] ${
                          isSticky
                            ? "sticky right-0 z-10 bg-white font-semibold"
                            : ""
                        }`}
                      >
                        {renderCell(
                          row,
                          field
                        )}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ================================================================
   STATES
================================================================ */

function LoadingState() {
  return (
    <div className="border border-[var(--color-stone-300,#d8d2c6)] bg-white py-16 text-center">
      <div className="mx-auto h-1 w-48 overflow-hidden bg-[var(--color-stone-200,#e7e2d8)]">
        <div className="h-full w-1/3 animate-[report-loading_1.2s_ease-in-out_infinite] bg-[var(--color-copper-500,#b8632c)]" />
      </div>

      <p className="mt-4 text-sm text-[var(--color-ink-500,#78716a)]">
        جاري تحميل تقرير الطلبيات…
      </p>

      <style>{`
        @keyframes report-loading {
          0% {
            transform: translateX(-150%);
          }

          100% {
            transform: translateX(450%);
          }
        }
      `}</style>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}) {
  return (
    <div className="flex flex-col items-center border border-[var(--color-stone-300,#d8d2c6)] bg-white px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center border border-[var(--color-stone-300,#d8d2c6)]">
        <FileSearch
          size={20}
          strokeWidth={1.5}
          className="text-[var(--color-ink-400,#9c9690)]"
        />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[var(--color-ink-800,#2b2723)]">
        لا توجد طلبيات
      </h3>

      <p className="mt-1 max-w-md text-xs leading-6 text-[var(--color-ink-500,#78716a)]">
        {hasFilters
          ? "لم نجد نتائج ضمن الفلاتر الحالية. جرّب توسيع الفترة الزمنية أو إزالة أحد الفلاتر."
          : "لا توجد بيانات متاحة في التقرير حاليًا."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 border border-[var(--color-stone-300,#d8d2c6)] px-4 py-2 text-xs hover:border-[var(--color-copper-500,#b8632c)]"
        >
          مسح الفلاتر
        </button>
      )}
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
}) {
  const message =
    typeof error === "string"
      ? error
      : error?.message;

  return (
    <div className="border border-[var(--color-status-danger,#a8452f)] bg-white px-6 py-16 text-center">
      <AlertCircle
        size={22}
        className="mx-auto text-[var(--color-status-danger,#a8452f)]"
      />

      <h3 className="mt-3 text-sm font-semibold text-[var(--color-status-danger,#a8452f)]">
        تعذّر تحميل التقرير
      </h3>

      <p className="mt-1 text-xs text-[var(--color-ink-500,#78716a)]">
        {message ||
          "حدث خطأ أثناء جلب بيانات التقرير من الخادم."}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 border border-[var(--color-stone-300,#d8d2c6)] px-4 py-2 text-xs hover:border-[var(--color-copper-500,#b8632c)]"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}

/* ================================================================
   PAGE
================================================================ */

export default function ReportOrdersPage() {
  /*
   * مهم:
   * createEntityStore عندك كان مستخدمًا سابقًا بهذا الشكل:
   *
   * const { search, searchState } = useReportOrdersStore();
   *
   * لذلك نعتمد searchState بدل افتراض data/loading/error.
   */

  const store = useReportOrdersStore();

  const search = store?.search;
  const searchState = store?.searchState;

  const [filters, setFilters] =
    useState(EMPTY_FILTERS);

  /*
   * بعض نسخ createEntityStore قد ترجع البيانات
   * داخل data، وبعضها داخل searchState.data.
   *
   * ندعم الاثنين حتى ما تنكسر الصفحة.
   */

  const rows = useMemo(() => {
    if (Array.isArray(searchState?.data)) {
      return searchState.data;
    }

    if (Array.isArray(store?.data)) {
      return store.data;
    }

    if (Array.isArray(searchState?.rows)) {
      return searchState.rows;
    }

    return [];
  }, [
    searchState?.data,
    searchState?.rows,
    store?.data,
  ]);

  const loading =
    searchState?.loading ??
    store?.loading ??
    false;

  const error =
    searchState?.error ??
    store?.error ??
    null;

  const errorCode =
    searchState?.errorCode ??
    store?.errorCode;

  /*
   * أول تحميل.
   */
  useEffect(() => {
    if (typeof search !== "function") {
      console.error(
        "ReportOrdersPage: search is not available in ReportOrdersStore"
      );

      return;
    }

    search({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * تنفيذ البحث.
   */
  function runSearch(nextFilters) {
    setFilters(nextFilters);

    if (typeof search !== "function") {
      console.error(
        "ReportOrdersPage: search is not a function"
      );

      return;
    }

    const cleaned = cleanFilters(
      nextFilters
    );

    search(cleaned);
  }

  function clearFilters() {
    runSearch(EMPTY_FILTERS);
  }

  function retry() {
    if (typeof search === "function") {
      search(cleanFilters(filters));
    }
  }

  const hasFilters = Object.values(
    filters
  ).some(Boolean);

  /*
   * في بعض implementations:
   * errorCode = 0 يعني لا يوجد خطأ.
   */
  const hasError =
    Boolean(error) ||
    (errorCode !== undefined &&
      errorCode !== null &&
      errorCode !== 0);

  return (
    <div
      dir="rtl"
      className="min-h-full bg-[var(--color-stone-100,#f1ede4)] pb-16"
    >
      {/* ============================================================
          HEADER
      ============================================================ */}

      <header className="border-b border-[var(--color-stone-300,#d8d2c6)] bg-white px-6 py-7">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardList
                  size={19}
                  strokeWidth={1.7}
                  className="text-[var(--color-copper-600,#a1541f)]"
                />

                <span className="text-[11px] font-medium tracking-wider text-[var(--color-copper-600,#a1541f)]">
                  PRODUCTION REPORT
                </span>
              </div>

              <h1 className="mt-2 font-display text-2xl font-bold text-[var(--color-ink-900,#2b2723)]">
                تقرير الطلبيات والإنتاج
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink-500,#78716a)]">
                قراءة تشغيلية لحجم الطلبيات وتقدّم الإنتاج والهدر عبر مراحل القص والتلوين والتعبئة.
              </p>
            </div>

            <div className="hidden text-end sm:block">
              <div className="text-[10px] uppercase tracking-widest text-[var(--color-ink-400,#9c9690)]">
                نتائج التقرير
              </div>

              <div className="mt-1 text-xl font-semibold text-[var(--color-ink-900,#2b2723)]">
                <Num>{rows.length}</Num>
              </div>

              <div className="text-[11px] text-[var(--color-ink-500,#78716a)]">
                طلبية
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          MAIN
      ============================================================ */}

      <main className="mx-auto flex max-w-[1600px] flex-col gap-5 px-6 py-6">

        {/* FILTERS */}

        <ReportFilters
          rows={rows}
          draft={filters}
          onChange={runSearch}
          onClear={clearFilters}
        />

        {/* LOADING */}

        {loading && <LoadingState />}

        {/* ERROR */}

        {!loading && hasError && (
          <ErrorState
            error={
              error ||
              searchState
            }
            onRetry={retry}
          />
        )}

        {/* EMPTY */}

        {!loading &&
          !hasError &&
          rows.length === 0 && (
            <EmptyState
              hasFilters={hasFilters}
              onClear={clearFilters}
            />
          )}

        {/* DATA */}

        {!loading &&
          !hasError &&
          rows.length > 0 && (
            <>
              <SummaryStrip rows={rows} />

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <ProductionFlow
                  rows={rows}
                />

                <WasteAnalysis
                  rows={rows}
                />
              </div>

              <AttentionBoard
                rows={rows}
              />

              <OrdersExplorer
                rows={rows}
              />
            </>
          )}
      </main>
    </div>
  );
}