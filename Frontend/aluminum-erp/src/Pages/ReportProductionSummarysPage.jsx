import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Package,
  PackageCheck,
  PackageMinus,
  Trash2,
  Target,
  Activity,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import Figures from "../components/Figures";
import {
  FilterField,
  PercentHero,
  StatCard,
  toNumber,
} from "../components/ReportControls";

import useReportProductionSummaryStore from "../stores/ReportProductionSummarysStore";
import { report_ProductionSummaryEntity } from "../entities/Report_ProductionSummaryEntity";

const config = report_ProductionSummaryEntity;
const { operations } = config;

const filtersConfig = operations.search?.filters ?? [];

function cleanFilters(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}

export default function ReportProductionSummarysPage() {
  const { search, searchState } = useReportProductionSummaryStore();

  const [filters, setFilters] = useState(() =>
    Object.fromEntries(filtersConfig.map((field) => [field.name, ""]))
  );

  const activeFilters = useMemo(
    () => cleanFilters(filters),
    [filters]
  );

  useEffect(() => {
    search(activeFilters);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(activeFilters)]);

  const isLoading = searchState.loading;

  const hasError =
    !isLoading &&
    searchState.errorCode !== 0 &&
    searchState.errorCode !== undefined;

  const summary =
    searchState.data?.[0] ?? {};

  const stats = useMemo(() => {
    const orders = toNumber(summary.ordersCount);
    const completed = toNumber(summary.completedOrdersCount);
    const incomplete = toNumber(summary.incompleteOrdersCount);

    const requested = toNumber(summary.totalRequestedQuantity);
    const produced = toNumber(summary.totalProducedQuantity);
    const remaining = toNumber(summary.remainingQuantity);
    const waste = toNumber(summary.totalWasteQuantity);

    return {
      orders,
      completed,
      incomplete,
      requested,
      produced,
      remaining,
      waste,

      completedRate:
        orders > 0
          ? (completed / orders) * 100
          : 0,

      productionRate:
        requested > 0
          ? (produced / requested) * 100
          : 0,

      remainingRate:
        requested > 0
          ? (remaining / requested) * 100
          : 0,

      wasteRate:
        requested > 0
          ? (waste / requested) * 100
          : 0,
    };
  }, [summary]);

  return (
    <div
      dir="rtl"
      className="animate-fade-in space-y-5"
    >
      <PageHeader
        title="ملخّص الإنتاج"
        description="لوحة تنفيذية مختصرة لمتابعة حجم الإنتاج، الطلبيات، الإنجاز والهدر خلال الفترة المحددة."
      />

      {/* Filters */}
      <section className="overflow-hidden border border-stone-200 bg-white">
        <div className="flex items-center gap-3 border-b border-stone-200 px-5 py-4">
          <div
            className="flex h-9 w-9 items-center justify-center"
            style={{
              backgroundColor:
                "var(--color-copper-50)",
              color:
                "var(--color-copper-700)",
            }}
          >
            <CalendarDays
              className="h-4.5 w-4.5"
              strokeWidth={1.7}
            />
          </div>

          <div>
            <h2 className="font-display text-[14px] font-bold text-ink-900">
              نطاق التقرير
            </h2>

            <p className="mt-0.5 text-[11.5px] text-ink-500">
              اختر الفترة الزمنية التي تريد تحليلها
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
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
              "تعذّر تحميل ملخّص الإنتاج."}
          </span>
        </div>
      )}

      {isLoading ? (
        <SummarySkeleton />
      ) : (
        <>
          {/* Main performance */}
          <section>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2 className="font-display text-[15px] font-bold text-ink-900">
                  مؤشرات الأداء
                </h2>

                <p className="mt-1 text-[11.5px] text-ink-500">
                  الصورة العامة لأداء الإنتاج خلال الفترة المحددة
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <PercentHero
                label="نسبة إنجاز الإنتاج"
                value={
                  summary.productionCompletionPercentage
                }
                tone="copper"
              />

              <PercentHero
                label="نسبة الهدر"
                value={summary.wastePercentage}
                tone="danger"
              />
            </div>
          </section>

          {/* Orders */}
          <section>
            <div className="mb-3">
              <h2 className="font-display text-[15px] font-bold text-ink-900">
                حالة الطلبيات
              </h2>

              <p className="mt-1 text-[11.5px] text-ink-500">
                توزيع الطلبيات حسب حالة التنفيذ
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              <StatCard
                label="إجمالي الطلبيات"
                value={stats.orders}
                icon={ClipboardList}
              />

              <StatCard
                label="الطلبيات المكتملة"
                value={stats.completed}
                icon={CheckCircle2}
              />

              <StatCard
                label="الطلبيات غير المكتملة"
                value={stats.incomplete}
                icon={XCircle}
                tone="danger"
              />
            </div>
          </section>

          {/* Quantity */}
          <section>
            <div className="mb-3">
              <h2 className="font-display text-[15px] font-bold text-ink-900">
                حركة الكميات
              </h2>

              <p className="mt-1 text-[11.5px] text-ink-500">
                مقارنة الكمية المطلوبة بالإنتاج والمتبقي والهدر
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="الكمية المطلوبة"
                value={stats.requested}
                icon={Package}
              />

              <StatCard
                label="الإنتاج النهائي"
                value={stats.produced}
                icon={PackageCheck}
              />

              <StatCard
                label="الكمية المتبقية"
                value={stats.remaining}
                icon={PackageMinus}
              />

              <StatCard
                label="إجمالي الهدر"
                value={stats.waste}
                icon={Trash2}
                tone="danger"
              />
            </div>
          </section>

          {/* Analysis */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="border border-stone-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center"
                  style={{
                    backgroundColor:
                      "var(--color-copper-50)",
                    color:
                      "var(--color-copper-700)",
                  }}
                >
                  <Target
                    className="h-4 w-4"
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <h3 className="font-display text-[13.5px] font-bold text-ink-900">
                    كفاءة تحقيق الطلب
                  </h3>

                  <p className="text-[11px] text-ink-500">
                    نسبة الإنتاج من إجمالي الكمية المطلوبة
                  </p>
                </div>
              </div>

              <MetricRow
                label="الإنتاج"
                value={stats.productionRate}
                tone="copper"
              />

              <MetricRow
                label="المتبقي"
                value={stats.remainingRate}
                tone="neutral"
              />

              <MetricRow
                label="الهدر"
                value={stats.wasteRate}
                tone="danger"
              />
            </div>

            <div className="border border-stone-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center"
                  style={{
                    backgroundColor:
                      "var(--color-copper-50)",
                    color:
                      "var(--color-copper-700)",
                  }}
                >
                  <Activity
                    className="h-4 w-4"
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <h3 className="font-display text-[13.5px] font-bold text-ink-900">
                    معدل إغلاق الطلبيات
                  </h3>

                  <p className="text-[11px] text-ink-500">
                    نسبة الطلبيات المكتملة من الإجمالي
                  </p>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span
                    dir="ltr"
                    className="font-display text-4xl font-bold tracking-tight text-ink-900"
                  >
                    {stats.completedRate.toFixed(1)}
                    <span className="mr-1 text-lg text-ink-500">
                      %
                    </span>
                  </span>

                  <p className="mt-2 text-[11.5px] text-ink-500">
                    {formatNumber(stats.completed)} من{" "}
                    {formatNumber(stats.orders)} طلبية مكتملة
                  </p>
                </div>

                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-[7px] border-stone-100" />

                  <div
                    className="absolute inset-0 rounded-full border-[7px]"
                    style={{
                      borderColor:
                        "var(--color-copper-500)",
                      clipPath: "inset(0 0 0 0)",
                      transform: `rotate(${
                        stats.completedRate * 3.6 - 90
                      }deg)`,
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2
                      className="h-6 w-6"
                      style={{
                        color:
                          "var(--color-copper-600)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MetricRow({
  label,
  value,
  tone = "copper",
}) {
  const safeValue = Math.min(
    100,
    Math.max(0, Number(value) || 0)
  );

  const barColor =
    tone === "danger"
      ? "var(--color-status-danger)"
      : tone === "neutral"
        ? "var(--color-ink-400)"
        : "var(--color-copper-500)";

  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] text-ink-600">
          {label}
        </span>

        <span
          dir="ltr"
          className="text-[12px] font-semibold text-ink-900"
        >
          {safeValue.toFixed(1)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-[2px] bg-stone-100">
        <div
          className="h-full rounded-[2px] transition-all"
          style={{
            width: `${safeValue}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="border border-stone-200 bg-white p-5"
          >
            <div className="mb-4 h-3 w-28 animate-pulse bg-stone-150" />
            <div className="mb-4 h-9 w-24 animate-pulse bg-stone-150" />
            <div className="h-2 w-full animate-pulse bg-stone-150" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse border border-stone-200 bg-white"
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse border border-stone-200 bg-white"
          />
        ))}
      </div>
    </>
  );
}