import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  FileSearch,
  AlertCircle,
  Scissors,
  Paintbrush,
  Package,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import Figures from "../components/Figures";

import {
  FilterField,
  PercentBar,
  StatCard,
  toNumber,
} from "../components/ReportControls";

import useReportProductProductionStore from "../stores/ReportProductProductionsStore";
import { report_ProductProductionEntity } from "../entities/Report_ProductProductionEntity";

const config = report_ProductProductionEntity;
const { operations } = config;

const filtersConfig = operations.search?.filters ?? [];
const columns = operations.search?.columns ?? [];

const COLUMN_GROUP_LABELS = {
  cuttingQuantity: "القص",
  cuttingWaste: "القص",
  cuttingGoodQuantity: "القص",

  paintingQuantity: "التلوين",
  paintingWaste: "التلوين",
  paintingGoodQuantity: "التلوين",

  packagingQuantity: "التعبئة",
  packagingWaste: "التعبئة",
  finalProducedQuantity: "التعبئة",
};

const PERCENTAGE_FIELDS = new Set([
  "productionCompletionPercentage",
  "wastePercentage",
]);

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

function buildHeaderGroups(cols) {
  const groups = [];
  let current = null;

  cols.forEach((col) => {
    const label =
      COLUMN_GROUP_LABELS[col.field] || null;

    if (current && current.label === label) {
      current.columns.push(col);
    } else {
      current = {
        label,
        columns: [col],
      };

      groups.push(current);
    }
  });

  return groups;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}

export default function ReportProductProductionsPage() {
  const {
    search,
    searchState,
  } = useReportProductProductionStore();

  const [filters, setFilters] = useState(() =>
    Object.fromEntries(
      filtersConfig.map((field) => [
        field.name,
        "",
      ])
    )
  );

  const activeFilters = useMemo(
    () => cleanFilters(filters),
    [filters]
  );

  useEffect(() => {
    search(activeFilters);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(activeFilters)]);

  const rows = searchState.data ?? [];

  const isLoading = searchState.loading;

  const hasError =
    !isLoading &&
    searchState.errorCode !== 0 &&
    searchState.errorCode !== undefined;

  const headerGroups = useMemo(
    () => buildHeaderGroups(columns),
    []
  );

  const stats = useMemo(() => {
    const totalProducts = rows.length;

    const requested = rows.reduce(
      (sum, row) =>
        sum +
        toNumber(
          row.totalRequestedQuantity
        ),
      0
    );

    const finalProduced = rows.reduce(
      (sum, row) =>
        sum +
        toNumber(
          row.finalProducedQuantity
        ),
      0
    );

    const totalWaste = rows.reduce(
      (sum, row) =>
        sum +
        toNumber(
          row.totalWasteQuantity
        ),
      0
    );

    const remaining = rows.reduce(
      (sum, row) =>
        sum +
        toNumber(
          row.remainingQuantity
        ),
      0
    );

    const avgCompletion = totalProducts
      ? rows.reduce(
          (sum, row) =>
            sum +
            toNumber(
              row.productionCompletionPercentage
            ),
          0
        ) / totalProducts
      : 0;

    const avgWaste = totalProducts
      ? rows.reduce(
          (sum, row) =>
            sum +
            toNumber(row.wastePercentage),
          0
        ) / totalProducts
      : 0;

    return {
      totalProducts,
      requested,
      finalProduced,
      totalWaste,
      remaining,
      avgCompletion,
      avgWaste,
    };
  }, [rows]);

  const topProducts = useMemo(() => {
    return [...rows]
      .sort(
        (a, b) =>
          toNumber(
            b.finalProducedQuantity
          ) -
          toNumber(
            a.finalProducedQuantity
          )
      )
      .slice(0, 6);
  }, [rows]);

  const maxProduced = Math.max(
    1,
    ...topProducts.map((row) =>
      toNumber(
        row.finalProducedQuantity
      )
    )
  );

  const stageStats = useMemo(() => {
    return [
      {
        key: "cutting",
        title: "القص",
        icon: Scissors,
        quantity: rows.reduce(
          (sum, row) =>
            sum +
            toNumber(row.cuttingQuantity),
          0
        ),
        waste: rows.reduce(
          (sum, row) =>
            sum +
            toNumber(row.cuttingWaste),
          0
        ),
        good: rows.reduce(
          (sum, row) =>
            sum +
            toNumber(
              row.cuttingGoodQuantity
            ),
          0
        ),
      },
      {
        key: "painting",
        title: "التلوين",
        icon: Paintbrush,
        quantity: rows.reduce(
          (sum, row) =>
            sum +
            toNumber(row.paintingQuantity),
          0
        ),
        waste: rows.reduce(
          (sum, row) =>
            sum +
            toNumber(row.paintingWaste),
          0
        ),
        good: rows.reduce(
          (sum, row) =>
            sum +
            toNumber(
              row.paintingGoodQuantity
            ),
          0
        ),
      },
      {
        key: "packaging",
        title: "التعبئة",
        icon: Package,
        quantity: rows.reduce(
          (sum, row) =>
            sum +
            toNumber(
              row.packagingQuantity
            ),
          0
        ),
        waste: rows.reduce(
          (sum, row) =>
            sum +
            toNumber(row.packagingWaste),
          0
        ),
        good: rows.reduce(
          (sum, row) =>
            sum +
            toNumber(
              row.finalProducedQuantity
            ),
          0
        ),
      },
    ];
  }, [rows]);

  return (
    <div
      dir="rtl"
      className="animate-fade-in space-y-5"
    >
      <PageHeader
        title="إنتاج المنتجات"
        description="تحليل تفصيلي لإنتاج المنتجات ومراحل التصنيع والهدر خلال الفترة المحددة."
      />

      {/* Filters */}
      <section className="border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <h2 className="font-display text-[14px] font-bold text-ink-900">
              فلاتر التقرير
            </h2>

            <p className="mt-1 text-[11.5px] text-ink-500">
              حدّد المنتج والفترة الزمنية لعرض النتائج
            </p>
          </div>

          <BarChart3
            className="h-5 w-5 text-ink-400"
            strokeWidth={1.6}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtersConfig.map((field) => (
            <FilterField
              key={field.name}
              field={field}
              value={filters[field.name] ?? ""}
              onChange={(value) =>
                setFilters((previous) => ({
                  ...previous,
                  [field.name]: value,
                }))
              }
            />
          ))}
        </div>
      </section>

      {/* Error */}
      {hasError && (
        <div
          className="flex items-center gap-2 border px-4 py-3 text-[13px]"
          style={{
            color: "var(--color-status-danger)",
            backgroundColor:
              "var(--color-status-danger-bg)",
            borderColor: "transparent",
          }}
        >
          <AlertCircle
            className="h-4 w-4 shrink-0"
            strokeWidth={1.8}
          />

          <span>
            {searchState.message ||
              "تعذّر تحميل تقرير إنتاج المنتجات."}
          </span>
        </div>
      )}

      {isLoading ? (
        <ProductProductionSkeleton />
      ) : (
        <>
          {/* KPI */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="عدد المنتجات"
              value={stats.totalProducts}
              icon={Boxes}
            />

            <StatCard
              label="إجمالي الإنتاج النهائي"
              value={stats.finalProduced}
              icon={PackageCheck}
            />

            <StatCard
              label="متوسط نسبة الإنجاز"
              value={`${stats.avgCompletion.toFixed(
                1
              )}%`}
              icon={TrendingUp}
            />

            <StatCard
              label="متوسط نسبة الهدر"
              value={`${stats.avgWaste.toFixed(
                1
              )}%`}
              icon={AlertTriangle}
              tone="danger"
            />
          </section>

          {/* Quantity Overview */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard
              label="إجمالي الكمية المطلوبة"
              value={stats.requested}
              icon={Package}
            />

            <StatCard
              label="الإنتاج النهائي"
              value={stats.finalProduced}
              icon={PackageCheck}
            />

            <StatCard
              label="الكمية المتبقية"
              value={stats.remaining}
              icon={Package}
            />
          </section>

          {/* Production stages */}
          <section>
            <div className="mb-3">
              <h2 className="font-display text-[15px] font-bold text-ink-900">
                تحليل مراحل الإنتاج
              </h2>

              <p className="mt-1 text-[11.5px] text-ink-500">
                مقارنة الكميات والهدر والصافي في كل مرحلة
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {stageStats.map((stage) => (
                <StageCard
                  key={stage.key}
                  {...stage}
                />
              ))}
            </div>
          </section>

          {/* Top products */}
          {topProducts.length > 0 && (
            <section className="border border-stone-200 bg-white">
              <div className="border-b border-stone-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-[14px] font-bold text-ink-900">
                      المنتجات الأعلى إنتاجًا
                    </h2>

                    <p className="mt-1 text-[11.5px] text-ink-500">
                      ترتيب المنتجات حسب الإنتاج النهائي
                    </p>
                  </div>

                  <ArrowUp
                    className="h-4 w-4"
                    style={{
                      color:
                        "var(--color-copper-600)",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4 p-5">
                {topProducts.map((row, index) => {
                  const value = toNumber(
                    row.finalProducedQuantity
                  );

                  const percentage =
                    (value / maxProduced) * 100;

                  return (
                    <div
                      key={
                        row.productID ??
                        `${row.productName}-${index}`
                      }
                      className="group"
                    >
                      <div className="mb-1.5 flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-stone-100 text-[10px] font-bold text-ink-600">
                          {index + 1}
                        </span>

                        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink-800">
                          {row.productName ||
                            "منتج غير محدد"}
                        </span>

                        <span
                          dir="ltr"
                          className="text-[12px] font-semibold text-ink-900"
                        >
                          {formatNumber(value)}
                        </span>
                      </div>

                      <div className="mr-9 h-2 overflow-hidden bg-stone-100">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor:
                              "var(--color-copper-500)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Detailed table */}
          <section className="overflow-hidden border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div>
                <h2 className="font-display text-[14px] font-bold text-ink-900">
                  التفاصيل حسب المنتج
                </h2>

                <p className="mt-1 text-[11.5px] text-ink-500">
                  جميع مراحل الإنتاج والكميات والهدر
                </p>
              </div>

              <span className="text-[11px] text-ink-500">
                {formatNumber(rows.length)} منتج
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1700px] border-collapse text-right">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    {headerGroups.map(
                      (group, index) =>
                        group.label ? (
                          <th
                            key={`group-${index}`}
                            colSpan={
                              group.columns.length
                            }
                            className="border-b border-stone-200 px-3 py-2 text-center text-[10.5px] font-bold"
                            style={{
                              backgroundColor:
                                "var(--color-copper-50)",
                              color:
                                "var(--color-copper-700)",
                            }}
                          >
                            {group.label}
                          </th>
                        ) : (
                          group.columns.map(
                            (column) => (
                              <th
                                key={
                                  column.field
                                }
                                rowSpan={2}
                                className="whitespace-nowrap px-3.5 py-3 align-bottom text-[11px] font-medium text-ink-500"
                              >
                                {column.header}
                              </th>
                            )
                          )
                        )
                    )}
                  </tr>

                  <tr className="border-b border-stone-200 bg-stone-50">
                    {headerGroups.flatMap(
                      (group) =>
                        group.label
                          ? group.columns.map(
                              (column) => (
                                <th
                                  key={
                                    column.field
                                  }
                                  className="whitespace-nowrap border-t border-stone-200 px-3 py-2 text-[10.5px] font-medium text-ink-500"
                                >
                                  {column.header}
                                </th>
                              )
                            )
                          : []
                    )}
                  </tr>
                </thead>

                <tbody>
                  {!isLoading &&
                    rows.length === 0 &&
                    !hasError && (
                      <tr>
                        <td
                          colSpan={
                            columns.length
                          }
                          className="px-4 py-16 text-center"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <FileSearch
                              className="h-7 w-7 text-ink-400"
                              strokeWidth={1.4}
                            />

                            <span className="text-[13px] text-ink-500">
                              لا توجد نتائج مطابقة للفلاتر المحددة.
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}

                  {!isLoading &&
                    rows.map((row, rowIndex) => (
                      <tr
                        key={
                          row.productID ??
                          `${row.productName}-${rowIndex}`
                        }
                        className="border-b border-stone-100 transition-colors last:border-0 hover:bg-stone-50"
                      >
                        {columns.map(
                          (column) => (
                            <td
                              key={
                                column.field
                              }
                              className="whitespace-nowrap px-3.5 py-3 text-[12.5px] text-ink-700"
                            >
                              {renderCell(
                                row,
                                column
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StageCard({
  title,
  icon: Icon,
  quantity,
  waste,
  good,
}) {
  const wastePercentage =
    quantity > 0
      ? (waste / quantity) * 100
      : 0;

  const efficiency =
    quantity > 0
      ? (good / quantity) * 100
      : 0;

  return (
    <div className="border border-stone-200 bg-white p-5">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center"
          style={{
            backgroundColor:
              "var(--color-copper-50)",
            color:
              "var(--color-copper-700)",
          }}
        >
          <Icon
            className="h-4.5 w-4.5"
            strokeWidth={1.6}
          />
        </div>

        <div>
          <h3 className="font-display text-[13.5px] font-bold text-ink-900">
            {title}
          </h3>

          <p className="text-[11px] text-ink-500">
            مؤشرات المرحلة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-y border-stone-100 py-4">
        <MiniMetric
          label="الكمية"
          value={quantity}
        />

        <MiniMetric
          label="الصافي"
          value={good}
        />

        <MiniMetric
          label="الهدر"
          value={waste}
          danger
        />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] text-ink-500">
            كفاءة المرحلة
          </span>

          <span
            dir="ltr"
            className="text-[11.5px] font-semibold text-ink-900"
          >
            {efficiency.toFixed(1)}%
          </span>
        </div>

        <div className="h-2 overflow-hidden bg-stone-100">
          <div
            className="h-full"
            style={{
              width: `${Math.min(
                100,
                Math.max(0, efficiency)
              )}%`,
              backgroundColor:
                "var(--color-copper-500)",
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10.5px] text-ink-400">
            نسبة الهدر
          </span>

          <span
            dir="ltr"
            className="text-[11px] font-medium"
            style={{
              color:
                "var(--color-status-danger)",
            }}
          >
            {wastePercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  danger = false,
}) {
  return (
    <div>
      <div className="mb-1 text-[10px] text-ink-400">
        {label}
      </div>

      <div
        dir="ltr"
        className="text-[13px] font-semibold"
        style={{
          color: danger
            ? "var(--color-status-danger)"
            : "var(--color-ink-900)",
        }}
      >
        {formatNumber(value)}
      </div>
    </div>
  );
}

function renderCell(row, column) {
  const value = row[column.field];

  if (
    PERCENTAGE_FIELDS.has(column.field)
  ) {
    return (
      <PercentBar
        value={value}
        tone={
          column.field === "wastePercentage"
            ? "danger"
            : "copper"
        }
      />
    );
  }

  if (typeof value === "number") {
    return (
      <Figures>
        {value}
      </Figures>
    );
  }

  return value ?? "—";
}

function ProductProductionSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse border border-stone-200 bg-white"
            />
          )
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse border border-stone-200 bg-white"
            />
          )
        )}
      </div>

      <div className="h-80 animate-pulse border border-stone-200 bg-white" />
    </>
  );
}