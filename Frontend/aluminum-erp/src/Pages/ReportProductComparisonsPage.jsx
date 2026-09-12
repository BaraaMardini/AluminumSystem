import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  TrendingUp,
  FileSearch,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Trophy,
  Target,
  Activity,
  BarChart3,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import Figures from "../components/Figures";
import {
  FilterField,
  PercentBar,
  toNumber,
} from "../components/ReportControls";

import useReportProductComparisonStore from "../stores/ReportProductComparisonsStore";

import {
  report_ProductComparisonEntity,
} from "../entities/Report_ProductComparisonEntity";


/* ================================================================
   CONFIG
================================================================ */

const config = report_ProductComparisonEntity;

const { operations } = config;

const filtersConfig =
  operations.search?.filters ?? [];

const columns =
  operations.search?.columns ?? [];


/* ================================================================
   CONSTANTS
================================================================ */

const PERCENTAGE_FIELDS = new Set([
  "productionCompletionPercentage",
  "wastePercentage",
]);

const DATE_FIELDS = new Set([
  "createdAt",
]);

const PRODUCT_ID_FIELDS = new Set([
  "productID",
]);

const HIDDEN_FROM_RANKING = new Set([
  "productID",
]);


/* ================================================================
   HELPERS
================================================================ */

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


function formatNumber(value) {
  return Math.round(
    toNumber(value)
  ).toLocaleString("en-US");
}


function formatDecimal(value) {
  return toNumber(value).toFixed(1);
}


function formatPercentage(value) {
  return `${formatDecimal(value)}%`;
}


function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-GB"
  );
}


function Num({
  children,
  className = "",
}) {
  return (
    <span
      dir="ltr"
      className={`inline-block tabular-nums ${className}`}
    >
      <Figures>
        {children}
      </Figures>
    </span>
  );
}


/* ================================================================
   STATS
================================================================ */

function calculateStats(rows) {

  const totalProducts =
    rows.length;


  const totalProduced =
    rows.reduce(
      (sum, row) =>
        sum +
        toNumber(
          row.totalProducedQuantity
        ),
      0
    );


  const totalWaste =
    rows.reduce(
      (sum, row) =>
        sum +
        toNumber(
          row.totalWasteQuantity
        ),
      0
    );


  const avgCompletion =
    totalProducts > 0
      ? rows.reduce(
          (sum, row) =>
            sum +
            toNumber(
              row.productionCompletionPercentage
            ),
          0
        ) / totalProducts
      : 0;


  const avgWaste =
    totalProducts > 0
      ? rows.reduce(
          (sum, row) =>
            sum +
            toNumber(
              row.wastePercentage
            ),
          0
        ) / totalProducts
      : 0;


  const bestProduct =
    [...rows]
      .sort(
        (a, b) =>
          toNumber(
            b.totalProducedQuantity
          ) -
          toNumber(
            a.totalProducedQuantity
          )
      )[0] ?? null;


  const lowestWasteProduct =
    [...rows]
      .filter(
        (row) =>
          row.wastePercentage !==
          null &&
          row.wastePercentage !==
          undefined
      )
      .sort(
        (a, b) =>
          toNumber(
            a.wastePercentage
          ) -
          toNumber(
            b.wastePercentage
          )
      )[0] ?? null;


  return {
    totalProducts,
    totalProduced,
    totalWaste,
    avgCompletion,
    avgWaste,
    bestProduct,
    lowestWasteProduct,
  };
}


/* ================================================================
   FILTERS
================================================================ */

function ReportFilters({
  filters,
  setFilters,
  onReset,
}) {

  const [expanded, setExpanded] =
    useState(true);


  const activeFilters =
    Object.entries(filters)
      .filter(
        ([, value]) =>
          value !== "" &&
          value !== null &&
          value !== undefined
      );


  return (
    <section className="overflow-hidden border border-stone-200 bg-white">

      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">

        <div className="flex items-center gap-2">

          <div
            className="flex h-7 w-7 items-center justify-center"
            style={{
              backgroundColor:
                "var(--color-copper-50)",
              color:
                "var(--color-copper-600)",
            }}
          >
            <SlidersHorizontal
              size={14}
              strokeWidth={1.8}
            />
          </div>

          <div>

            <h2 className="text-[12.5px] font-bold text-ink-900">
              نطاق التقرير
            </h2>

            <p className="mt-0.5 text-[10.5px] text-ink-400">
              تخصيص البيانات المعروضة
            </p>

          </div>

        </div>


        <div className="flex items-center gap-2">

          {activeFilters.length > 0 && (
            <span className="text-[11px] text-ink-500">
              <Num>
                {activeFilters.length}
              </Num>{" "}
              فلتر مفعّل
            </span>
          )}


          <button
            type="button"
            onClick={() =>
              setExpanded(
                (value) => !value
              )
            }
            className="flex h-7 w-7 items-center justify-center border border-stone-200 text-ink-500 transition hover:border-copper-400 hover:text-copper-600"
          >
            <ChevronDown
              size={14}
              className={
                expanded
                  ? "rotate-180 transition-transform"
                  : "transition-transform"
              }
            />
          </button>

        </div>

      </div>


      {expanded && (
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">

          {filtersConfig.map(
            (field) => (

              <FilterField
                key={field.name}
                field={field}
                value={
                  filters[
                    field.name
                  ] ?? ""
                }
                onChange={(value) =>
                  setFilters(
                    (previous) => ({
                      ...previous,
                      [field.name]:
                        value,
                    })
                  )
                }
              />

            )
          )}

        </div>
      )}


      {activeFilters.length > 0 && (

        <div className="flex flex-wrap items-center gap-2 border-t border-stone-200 bg-stone-50 px-4 py-2.5">

          {activeFilters.map(
            ([name, value]) => {

              const field =
                filtersConfig.find(
                  (item) =>
                    item.name === name
                );

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() =>
                    setFilters(
                      (previous) => ({
                        ...previous,
                        [name]: "",
                      })
                    )
                  }
                  className="flex items-center gap-1.5 border border-copper-200 bg-white px-2 py-1 text-[10.5px] text-copper-700 transition hover:border-copper-400"
                >

                  <span className="text-ink-400">
                    {field?.label ??
                      name}
                    :
                  </span>

                  <span className="font-medium">
                    {String(value)}
                  </span>

                  <span className="text-copper-500">
                    ×
                  </span>

                </button>
              );
            }
          )}


          <button
            type="button"
            onClick={onReset}
            className="mr-auto flex items-center gap-1 text-[10.5px] text-ink-500 transition hover:text-copper-600"
          >

            <RotateCcw
              size={11}
            />

            مسح الفلاتر

          </button>

        </div>

      )}

    </section>
  );
}


/* ================================================================
   KPI STRIP
================================================================ */

function KPISection({ stats }) {

  const cards = [
    {
      label: "عدد المنتجات",
      value: formatNumber(
        stats.totalProducts
      ),
      icon: Boxes,
      description:
        "ضمن النطاق الحالي",
    },
    {
      label: "إجمالي الإنتاج",
      value: formatNumber(
        stats.totalProduced
      ),
      icon: PackageCheck,
      description:
        "الكمية المنتجة",
    },
    {
      label: "إجمالي الهدر",
      value: formatNumber(
        stats.totalWaste
      ),
      icon: AlertTriangle,
      danger: true,
      description:
        "الكمية المهدرة",
    },
    {
      label: "متوسط الإنجاز",
      value: formatPercentage(
        stats.avgCompletion
      ),
      icon: TrendingUp,
      description:
        "متوسط إتمام الإنتاج",
    },
  ];


  return (
    <section className="grid grid-cols-2 border border-stone-200 bg-white lg:grid-cols-4">

      {cards.map(
        (card, index) => {

          const Icon =
            card.icon;

          return (
            <div
              key={card.label}
              className={`relative px-4 py-4 sm:px-5 ${
                index > 0
                  ? "border-t border-stone-200 lg:border-t-0 lg:border-e"
                  : ""
              }`}
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[10.5px] font-medium tracking-wide text-ink-500">
                    {card.label}
                  </p>

                  <div className="mt-1.5 font-mono text-[20px] font-bold text-ink-900">
                    <Num>
                      {card.value}
                    </Num>
                  </div>

                  <p className="mt-1 text-[9.5px] text-ink-400">
                    {card.description}
                  </p>

                </div>


                <div
                  className="flex h-8 w-8 items-center justify-center"
                  style={{
                    backgroundColor:
                      card.danger
                        ? "var(--color-status-danger-bg)"
                        : "var(--color-copper-50)",
                    color:
                      card.danger
                        ? "var(--color-status-danger)"
                        : "var(--color-copper-600)",
                  }}
                >

                  <Icon
                    size={16}
                    strokeWidth={1.7}
                  />

                </div>

              </div>

            </div>
          );
        }
      )}

    </section>
  );
}


/* ================================================================
   EXECUTIVE INSIGHTS
================================================================ */

function ExecutiveInsights({ stats }) {

  if (
    !stats.bestProduct &&
    !stats.lowestWasteProduct
  ) {
    return null;
  }


  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2">

      {stats.bestProduct && (

        <div className="relative overflow-hidden border border-stone-200 bg-white p-4">

          <div className="absolute right-0 top-0 h-full w-1 bg-copper-500" />

          <div className="flex items-start gap-3">

            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center"
              style={{
                backgroundColor:
                  "var(--color-copper-50)",
                color:
                  "var(--color-copper-600)",
              }}
            >
              <Trophy
                size={17}
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0">

              <p className="text-[10.5px] font-medium text-ink-400">
                المنتج الأعلى إنتاجًا
              </p>

              <h3 className="mt-1 truncate text-[14px] font-bold text-ink-900">
                {stats.bestProduct.productName ??
                  "—"}
              </h3>

              <div className="mt-1.5 text-[11px] text-ink-500">

                <Num>
                  {formatNumber(
                    stats.bestProduct
                      .totalProducedQuantity
                  )}
                </Num>{" "}
                وحدة منتجة

              </div>

            </div>

          </div>

        </div>

      )}


      {stats.lowestWasteProduct && (

        <div className="relative overflow-hidden border border-stone-200 bg-white p-4">

          <div className="absolute right-0 top-0 h-full w-1 bg-stone-700" />

          <div className="flex items-start gap-3">

            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center"
              style={{
                backgroundColor:
                  "var(--color-stone-100)",
                color:
                  "var(--color-ink-700)",
              }}
            >
              <Target
                size={17}
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0">

              <p className="text-[10.5px] font-medium text-ink-400">
                الأقل هدرًا
              </p>

              <h3 className="mt-1 truncate text-[14px] font-bold text-ink-900">
                {stats.lowestWasteProduct.productName ??
                  "—"}
              </h3>

              <div className="mt-1.5 text-[11px] text-ink-500">

                هدر{" "}

                <Num>
                  {formatPercentage(
                    stats.lowestWasteProduct
                      .wastePercentage
                  )}
                </Num>

              </div>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}


/* ================================================================
   PRODUCTION RANKING
================================================================ */

function ProductionRanking({ rows }) {

  const topProducts =
    useMemo(
      () =>
        [...rows]
          .sort(
            (a, b) =>
              toNumber(
                b.totalProducedQuantity
              ) -
              toNumber(
                a.totalProducedQuantity
              )
          )
          .slice(0, 8),
      [rows]
    );


  if (!topProducts.length) {
    return null;
  }


  const maxProduced =
    Math.max(
      1,
      ...topProducts.map(
        (row) =>
          toNumber(
            row.totalProducedQuantity
          )
      )
    );


  return (
    <section className="border border-stone-200 bg-white">

      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">

        <div className="flex items-center gap-2">

          <BarChart3
            size={15}
            strokeWidth={1.7}
            style={{
              color:
                "var(--color-copper-600)",
            }}
          />

          <div>

            <h2 className="text-[12.5px] font-bold text-ink-900">
              ترتيب الإنتاج
            </h2>

            <p className="text-[10px] text-ink-400">
              أعلى المنتجات إنتاجًا
            </p>

          </div>

        </div>

        <span className="text-[10px] text-ink-400">
          أفضل {topProducts.length}
        </span>

      </div>


      <div className="p-4">

        <div className="space-y-3">

          {topProducts.map(
            (row, index) => {

              const value =
                toNumber(
                  row.totalProducedQuantity
                );

              const percentage =
                (value /
                  maxProduced) *
                100;


              return (
                <div
                  key={
                    row.productID ??
                    row.productName ??
                    index
                  }
                  className="group"
                >

                  <div className="mb-1.5 flex items-center justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-2">

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center text-[9px] font-bold ${
                          index === 0
                            ? "bg-copper-600 text-white"
                            : "bg-stone-100 text-ink-500"
                        }`}
                      >
                        {index + 1}
                      </span>

                      <span className="truncate text-[11.5px] font-medium text-ink-700">
                        {row.productName ??
                          "منتج غير معروف"}
                      </span>

                    </div>


                    <span className="shrink-0 font-mono text-[11px] text-ink-700">
                      <Num>
                        {formatNumber(
                          value
                        )}
                      </Num>
                    </span>

                  </div>


                  <div className="h-2 overflow-hidden bg-stone-100">

                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          percentage,
                          100
                        )}%`,
                        backgroundColor:
                          index === 0
                            ? "var(--color-copper-600)"
                            : "var(--color-copper-300)",
                      }}
                    />

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </section>
  );
}


/* ================================================================
   WASTE ANALYSIS
================================================================ */

function WasteAnalysis({ rows }) {

  const totalWaste =
    rows.reduce(
      (sum, row) =>
        sum +
        toNumber(
          row.totalWasteQuantity
        ),
      0
    );


  const avgWaste =
    rows.length
      ? rows.reduce(
          (sum, row) =>
            sum +
            toNumber(
              row.wastePercentage
            ),
          0
        ) / rows.length
      : 0;


  const avgCompletion =
    rows.length
      ? rows.reduce(
          (sum, row) =>
            sum +
            toNumber(
              row.productionCompletionPercentage
            ),
          0
        ) / rows.length
      : 0;


  return (
    <section className="border border-stone-200 bg-white">

      <div className="border-b border-stone-200 px-4 py-3">

        <div className="flex items-center gap-2">

          <Activity
            size={15}
            strokeWidth={1.7}
            style={{
              color:
                "var(--color-copper-600)",
            }}
          />

          <div>

            <h2 className="text-[12.5px] font-bold text-ink-900">
              جودة الأداء
            </h2>

            <p className="text-[10px] text-ink-400">
              مؤشرات مقارنة على مستوى المنتجات
            </p>

          </div>

        </div>

      </div>


      <div className="space-y-5 p-5">

        <PerformanceMetric
          label="متوسط الإنجاز"
          value={avgCompletion}
          tone="copper"
          description="متوسط نسبة إتمام الإنتاج"
        />


        <PerformanceMetric
          label="متوسط الهدر"
          value={avgWaste}
          tone="danger"
          description="متوسط نسبة الهدر"
        />


        <div className="border-t border-stone-200 pt-4">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-[10.5px] text-ink-400">
                إجمالي الكمية المهدرة
              </p>

              <p className="mt-1 font-mono text-[18px] font-bold text-ink-900">
                <Num>
                  {formatNumber(
                    totalWaste
                  )}
                </Num>
              </p>

            </div>

            <AlertTriangle
              size={18}
              strokeWidth={1.6}
              style={{
                color:
                  "var(--color-status-danger)",
              }}
            />

          </div>

        </div>

      </div>

    </section>
  );
}


function PerformanceMetric({
  label,
  value,
  tone,
  description,
}) {

  const safeValue =
    Math.max(
      0,
      Math.min(
        100,
        toNumber(value)
      )
    );


  return (
    <div>

      <div className="flex items-center justify-between gap-3">

        <div>

          <p className="text-[11px] font-medium text-ink-700">
            {label}
          </p>

          <p className="mt-0.5 text-[9.5px] text-ink-400">
            {description}
          </p>

        </div>

        <span
          className="font-mono text-[15px] font-bold"
          style={{
            color:
              tone === "danger"
                ? "var(--color-status-danger)"
                : "var(--color-copper-600)",
          }}
        >
          <Num>
            {formatPercentage(
              safeValue
            )}
          </Num>
        </span>

      </div>


      <div className="mt-2">
        <PercentBar
          value={safeValue}
          tone={tone}
        />
      </div>

    </div>
  );
}


/* ================================================================
   TABLE
================================================================ */

function ProductExplorer({ rows }) {

  const [sort, setSort] =
    useState({
      field:
        "totalProducedQuantity",
      dir: "desc",
    });


  const columnByField =
    useMemo(
      () =>
        Object.fromEntries(
          columns.map(
            (column) => [
              column.field,
              column,
            ]
          )
        ),
      []
    );


  const sortedRows =
    useMemo(() => {

      return [...rows].sort(
        (a, b) => {

          const va =
            a[sort.field];

          const vb =
            b[sort.field];


          if (
            DATE_FIELDS.has(
              sort.field
            )
          ) {

            const da =
              new Date(va).getTime() ||
              0;

            const db =
              new Date(vb).getTime() ||
              0;

            return sort.dir ===
              "desc"
              ? db - da
              : da - db;
          }


          if (
            typeof va ===
              "string" &&
            !PERCENTAGE_FIELDS.has(
              sort.field
            )
          ) {

            return sort.dir ===
              "desc"
              ? String(vb).localeCompare(
                  String(va),
                  "ar"
                )
              : String(va).localeCompare(
                  String(vb),
                  "ar"
                );
          }


          return sort.dir ===
            "desc"
            ? toNumber(vb) -
                toNumber(va)
            : toNumber(va) -
                toNumber(vb);

        }
      );

    }, [rows, sort]);


  function toggleSort(field) {

    setSort(
      (previous) => {

        if (
          previous.field !==
          field
        ) {

          return {
            field,
            dir: "desc",
          };

        }


        return {
          field,
          dir:
            previous.dir ===
            "desc"
              ? "asc"
              : "desc",
        };

      }
    );
  }


  function SortIcon({ field }) {

    if (
      sort.field !== field
    ) {

      return (
        <ArrowUpDown
          size={11}
          strokeWidth={1.7}
          className="text-ink-300"
        />
      );

    }


    return sort.dir ===
      "desc" ? (
      <ArrowDown
        size={11}
        strokeWidth={2}
        className="text-copper-600"
      />
    ) : (
      <ArrowUp
        size={11}
        strokeWidth={2}
        className="text-copper-600"
      />
    );
  }


  function renderCell(
    row,
    field
  ) {

    const value =
      row[field];


    if (
      PERCENTAGE_FIELDS.has(
        field
      )
    ) {

      return (
        <div className="min-w-[110px]">

          <PercentBar
            value={value}
            tone={
              field ===
              "wastePercentage"
                ? "danger"
                : "copper"
            }
          />

        </div>
      );

    }


    if (
      DATE_FIELDS.has(
        field
      )
    ) {

      return (
        <Num>
          {formatDate(value)}
        </Num>
      );

    }


    if (
      PRODUCT_ID_FIELDS.has(
        field
      )
    ) {

      return (
        <Num>
          {value}
        </Num>
      );

    }


    if (
      typeof value ===
      "number"
    ) {

      return (
        <Num>
          {formatNumber(value)}
        </Num>
      );

    }


    return (
      value ??
      "—"
    );
  }


  return (
    <section className="overflow-hidden border border-stone-200 bg-white">

      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">

        <div>

          <h2 className="text-[12.5px] font-bold text-ink-900">
            مقارنة المنتجات
          </h2>

          <p className="mt-0.5 text-[10px] text-ink-400">
            السجل الكامل للبيانات القادمة من التقرير
          </p>

        </div>


        <div className="flex items-center gap-2 text-[10.5px] text-ink-500">

          <span className="flex items-center gap-1">

            <Boxes
              size={12}
            />

            <Num>
              {rows.length}
            </Num>

          </span>

          <span>
            منتج
          </span>

        </div>

      </div>


      <div className="overflow-x-auto">

        <table className="w-full min-w-[1000px] border-collapse text-right">

          <thead>

            <tr className="border-b border-stone-200 bg-stone-50">

              {columns.map(
                (column) => (

                  <th
                    key={
                      column.field
                    }
                    className="whitespace-nowrap px-3.5 py-2.5 text-[10.5px] font-medium text-ink-500"
                  >

                    <button
                      type="button"
                      onClick={() =>
                        toggleSort(
                          column.field
                        )
                      }
                      className="flex items-center gap-1.5 transition hover:text-ink-900"
                    >

                      {
                        column.header
                      }

                      <SortIcon
                        field={
                          column.field
                        }
                      />

                    </button>

                  </th>

                )
              )}

            </tr>

          </thead>


          <tbody>

            {sortedRows.map(
              (row, rowIndex) => (

                <tr
                  key={
                    row.productID ??
                    rowIndex
                  }
                  className="border-b border-stone-100 transition hover:bg-stone-50"
                >

                  {columns.map(
                    (column) => {

                      const isProduct =
                        column.field ===
                        "productName";


                      const isDanger =
                        column.field ===
                        "wastePercentage";


                      return (
                        <td
                          key={
                            column.field
                          }
                          className={`whitespace-nowrap px-3.5 py-2.5 text-[12px] ${
                            isProduct
                              ? "font-medium text-ink-900"
                              : isDanger
                              ? "text-status-danger"
                              : "text-ink-700"
                          }`}
                        >

                          {renderCell(
                            row,
                            column.field
                          )}

                        </td>
                      );

                    }
                  )}

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}


/* ================================================================
   LOADING
================================================================ */

function LoadingState() {

  return (
    <div className="border border-stone-200 bg-white">

      <div className="flex items-center justify-center py-20">

        <div className="flex flex-col items-center gap-3">

          <div className="relative h-1 w-40 overflow-hidden bg-stone-100">

            <div
              className="absolute inset-y-0 left-0 w-1/3 animate-[report-loading_1.2s_ease-in-out_infinite]"
              style={{
                backgroundColor:
                  "var(--color-copper-500)",
              }}
            />

          </div>

          <span className="text-[11.5px] text-ink-400">
            جاري تحليل بيانات المنتجات…
          </span>

        </div>

      </div>

      <style>
        {`
          @keyframes report-loading {
            0% {
              transform: translateX(-120%);
            }

            100% {
              transform: translateX(420%);
            }
          }
        `}
      </style>

    </div>
  );
}


/* ================================================================
   EMPTY
================================================================ */

function EmptyState({
  hasFilters,
  onReset,
}) {

  return (
    <div className="border border-stone-200 bg-white">

      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

        <div
          className="flex h-12 w-12 items-center justify-center border border-stone-200"
          style={{
            color:
              "var(--color-ink-400)",
          }}
        >

          <FileSearch
            size={21}
            strokeWidth={1.4}
          />

        </div>


        <h3 className="mt-4 text-[13px] font-bold text-ink-800">
          لا توجد بيانات مطابقة
        </h3>


        <p className="mt-1 max-w-sm text-[11px] leading-5 text-ink-400">

          {hasFilters
            ? "لم يتم العثور على منتجات تطابق نطاق البحث الحالي. جرّب تعديل الفلاتر."
            : "لا توجد بيانات منتجات متاحة حاليًا ضمن التقرير."}

        </p>


        {hasFilters && (

          <button
            type="button"
            onClick={onReset}
            className="mt-4 flex items-center gap-1.5 border border-stone-300 px-3 py-1.5 text-[11px] text-ink-600 transition hover:border-copper-400 hover:text-copper-600"
          >

            <RotateCcw
              size={11}
            />

            مسح الفلاتر

          </button>

        )}

      </div>

    </div>
  );
}


/* ================================================================
   ERROR
================================================================ */

function ErrorState({
  message,
  onRetry,
}) {

  return (
    <div className="border border-status-danger bg-white">

      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

        <div
          className="flex h-11 w-11 items-center justify-center"
          style={{
            backgroundColor:
              "var(--color-status-danger-bg)",
            color:
              "var(--color-status-danger)",
          }}
        >

          <AlertCircle
            size={20}
            strokeWidth={1.6}
          />

        </div>


        <h3
          className="mt-4 text-[13px] font-bold"
          style={{
            color:
              "var(--color-status-danger)",
          }}
        >
          تعذّر تحميل التقرير
        </h3>


        <p className="mt-1 max-w-md text-[11px] leading-5 text-ink-500">
          {message ||
            "حدث خطأ أثناء الاتصال بالخادم."}
        </p>


        <button
          type="button"
          onClick={onRetry}
          className="mt-4 border border-stone-300 px-3 py-1.5 text-[11px] text-ink-600 transition hover:border-copper-400 hover:text-copper-600"
        >
          إعادة المحاولة
        </button>

      </div>

    </div>
  );
}


/* ================================================================
   PAGE
================================================================ */

const EMPTY_FILTERS =
  filtersConfig.reduce(
    (accumulator, field) => ({
      ...accumulator,
      [field.name]: "",
    }),
    {}
  );


export default function ReportProductComparisonsPage() {

  const {
    search,
    searchState,
  } =
    useReportProductComparisonStore();


  const [
    filters,
    setFilters,
  ] = useState(
    EMPTY_FILTERS
  );


  const activeFilters =
    useMemo(
      () =>
        cleanFilters(
          filters
        ),
      [filters]
    );


  useEffect(() => {

    search(
      activeFilters
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(
      activeFilters
    ),
  ]);


  const rows =
    searchState.data ?? [];


  const isLoading =
    searchState.loading;


  const hasError =
    !isLoading &&
    searchState.errorCode !==
      0 &&
    searchState.errorCode !==
      undefined;


  const stats =
    useMemo(
      () =>
        calculateStats(
          rows
        ),
      [rows]
    );


  const hasFilters =
    Object.values(
      filters
    ).some(
      (value) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    );


  const resetFilters =
    () =>
      setFilters(
        EMPTY_FILTERS
      );


  return (
    <div className="animate-fade-in">

      <PageHeader
        title="مقارنة المنتجات"
        description="لوحة تحليلية لمقارنة الإنتاج والهدر وأداء المنتجات ضمن النطاق المحدّد."
      />


      <main className="mt-4 flex flex-col gap-4">


        {/* ======================================================
            FILTERS
        ====================================================== */}

        <ReportFilters
          filters={filters}
          setFilters={
            setFilters
          }
          onReset={
            resetFilters
          }
        />


        {/* ======================================================
            ERROR
        ====================================================== */}

        {hasError && (

          <ErrorState
            message={
              searchState.message
            }
            onRetry={() =>
              search(
                activeFilters
              )
            }
          />

        )}


        {/* ======================================================
            LOADING
        ====================================================== */}

        {isLoading && (
          <LoadingState />
        )}


        {/* ======================================================
            EMPTY
        ====================================================== */}

        {!isLoading &&
          !hasError &&
          rows.length === 0 && (

            <EmptyState
              hasFilters={
                hasFilters
              }
              onReset={
                resetFilters
              }
            />

          )}


        {/* ======================================================
            REPORT
        ====================================================== */}

        {!isLoading &&
          !hasError &&
          rows.length > 0 && (

            <>

              {/* KPI */}

              <KPISection
                stats={stats}
              />


              {/* INSIGHTS */}

              <ExecutiveInsights
                stats={stats}
              />


              {/* ANALYTICS */}

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                <ProductionRanking
                  rows={rows}
                />

                <WasteAnalysis
                  rows={rows}
                />

              </div>


              {/* TABLE */}

              <ProductExplorer
                rows={rows}
              />

            </>

          )}

      </main>

    </div>
  );
}