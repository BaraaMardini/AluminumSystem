import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Factory,
  PackageCheck,
  PackageMinus,
  PackageOpen,
  RefreshCw,
  Target,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import Figures from "../components/Figures";
import {
  FilterField,
  PercentBar,
  StatCard,
  toNumber,
} from "../components/ReportControls";

import useReportProductionSummaryStore from "../stores/ReportProductionSummarysStore";
import useReportProductProductionStore from "../stores/ReportProductProductionsStore";
import useReportOrdersStore from "../stores/ReportOrdersStore";

import { report_ProductionSummaryEntity } from "../entities/Report_ProductionSummaryEntity";
import { report_ProductProductionEntity } from "../entities/Report_ProductProductionEntity";
import { report_OrdersEntity } from "../entities/Report_OrdersEntity";


/* =========================================================
   CONFIG
========================================================= */

const summaryFilters =
  report_ProductionSummaryEntity.operations.search?.filters ?? [];

const productFilters =
  report_ProductProductionEntity.operations.search?.filters ?? [];

const orderFilters =
  report_OrdersEntity.operations.search?.filters ?? [];


/* =========================================================
   HELPERS
========================================================= */

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
  return toNumber(value).toLocaleString("en-US");
}


function getCompletionColor(value) {
  const number = toNumber(value);

  if (number >= 90) return "var(--color-status-success)";
  if (number >= 60) return "var(--color-copper-600)";
  if (number >= 30) return "var(--color-status-warning)";

  return "var(--color-status-danger)";
}


function getOrderStatusTone(status) {
  const value = String(status || "").toLowerCase();

  if (
    value.includes("مكتمل") ||
    value.includes("completed") ||
    value.includes("complete")
  ) {
    return "success";
  }

  if (
    value.includes("متأخر") ||
    value.includes("late") ||
    value.includes("delayed")
  ) {
    return "danger";
  }

  if (
    value.includes("انتظار") ||
    value.includes("pending") ||
    value.includes("waiting")
  ) {
    return "warning";
  }

  return "copper";
}


/* =========================================================
   MAIN
========================================================= */

export default function Dashboard() {

  const {
    search: searchSummary,
    searchState: summaryState,
  } = useReportProductionSummaryStore();

  const {
    search: searchProducts,
    searchState: productsState,
  } = useReportProductProductionStore();

  const {
    search: searchOrders,
    searchState: ordersState,
  } = useReportOrdersStore();


  /* -------------------------------------------------------
     FILTERS
  ------------------------------------------------------- */

  const [filters, setFilters] = useState(() => ({
    FromDate: "",
    ToDate: "",
  }));


  const activeFilters = useMemo(
    () => cleanFilters(filters),
    [filters]
  );


  /* -------------------------------------------------------
     LOAD DASHBOARD DATA
  ------------------------------------------------------- */

  useEffect(() => {

    searchSummary(activeFilters);
    searchProducts(activeFilters);
    searchOrders(activeFilters);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(activeFilters)]);


  /* -------------------------------------------------------
     STATES
  ------------------------------------------------------- */

  const isLoading =
    summaryState.loading ||
    productsState.loading ||
    ordersState.loading;


  const hasError =
    !isLoading &&
    (
      summaryState.errorCode !== 0 &&
      summaryState.errorCode !== undefined
    ) ||
    (
      productsState.errorCode !== 0 &&
      productsState.errorCode !== undefined
    ) ||
    (
      ordersState.errorCode !== 0 &&
      ordersState.errorCode !== undefined
    );


  const errorMessage =
    summaryState.message ||
    productsState.message ||
    ordersState.message ||
    "تعذّر تحميل بيانات لوحة الإنتاج.";


  /* -------------------------------------------------------
     DATA
  ------------------------------------------------------- */

  const summary =
    summaryState.data?.[0] ?? {};


  const products =
    productsState.data ?? [];


  const orders =
    ordersState.data ?? [];


  /* =======================================================
     PRODUCT STATISTICS
  ======================================================= */

  const productStats = useMemo(() => {

    if (!products.length) {
      return {
        count: 0,
        produced: 0,
        waste: 0,
        requested: 0,
        remaining: 0,
        completion: 0,
        wastePercentage: 0,
      };
    }


    const requested = products.reduce(
      (sum, row) =>
        sum + toNumber(row.totalRequestedQuantity),
      0
    );


    const produced = products.reduce(
      (sum, row) =>
        sum + toNumber(row.finalProducedQuantity),
      0
    );


    const waste = products.reduce(
      (sum, row) =>
        sum + toNumber(row.totalWasteQuantity),
      0
    );


    const remaining = products.reduce(
      (sum, row) =>
        sum + toNumber(row.remainingQuantity),
      0
    );


    const completion =
      requested > 0
        ? (produced / requested) * 100
        : 0;


    const wastePercentage =
      requested > 0
        ? (waste / requested) * 100
        : 0;


    return {
      count: products.length,
      produced,
      waste,
      requested,
      remaining,
      completion,
      wastePercentage,
    };

  }, [products]);


  /* =======================================================
     STAGE STATISTICS
  ======================================================= */

  const stageStats = useMemo(() => {

    const cutting = products.reduce(
      (sum, row) =>
        sum + toNumber(row.cuttingGoodQuantity),
      0
    );


    const painting = products.reduce(
      (sum, row) =>
        sum + toNumber(row.paintingGoodQuantity),
      0
    );


    const packaging = products.reduce(
      (sum, row) =>
        sum + toNumber(row.finalProducedQuantity),
      0
    );


    const cuttingWaste = products.reduce(
      (sum, row) =>
        sum + toNumber(row.cuttingWaste),
      0
    );


    const paintingWaste = products.reduce(
      (sum, row) =>
        sum + toNumber(row.paintingWaste),
      0
    );


    const packagingWaste = products.reduce(
      (sum, row) =>
        sum + toNumber(row.packagingWaste),
      0
    );


    const requested =
      toNumber(summary.totalRequestedQuantity) ||
      productStats.requested ||
      1;


    return [
      {
        name: "القص",
        produced: cutting,
        waste: cuttingWaste,
        percentage: Math.min(
          100,
          (cutting / requested) * 100
        ),
      },
      {
        name: "التلوين",
        produced: painting,
        waste: paintingWaste,
        percentage: Math.min(
          100,
          (painting / requested) * 100
        ),
      },
      {
        name: "التعبئة والتغليف",
        produced: packaging,
        waste: packagingWaste,
        percentage: Math.min(
          100,
          (packaging / requested) * 100
        ),
      },
    ];

  }, [products, summary, productStats]);


  /* =======================================================
     TOP PRODUCTS
  ======================================================= */

  const topProducts = useMemo(() => {

    return [...products]
      .sort(
        (a, b) =>
          toNumber(b.finalProducedQuantity) -
          toNumber(a.finalProducedQuantity)
      )
      .slice(0, 6);

  }, [products]);


  const maxProductProduction =
    Math.max(
      1,
      ...topProducts.map((row) =>
        toNumber(row.finalProducedQuantity)
      )
    );


  /* =======================================================
     ORDER STATISTICS
  ======================================================= */

  const orderStats = useMemo(() => {

    const total = orders.length;


    const completed = orders.filter((row) => {

      const status =
        String(row.statusName || "").toLowerCase();

      return (
        status.includes("مكتمل") ||
        status.includes("completed") ||
        toNumber(row.productionCompletionPercentage) >= 100
      );

    }).length;


    const delayed = orders.filter((row) => {

      const status =
        String(row.statusName || "").toLowerCase();

      return (
        status.includes("متأخر") ||
        status.includes("late") ||
        status.includes("delayed")
      );

    }).length;


    const incomplete =
      Math.max(
        0,
        total - completed
      );


    return {
      total,
      completed,
      incomplete,
      delayed,
    };

  }, [orders]);


  /* =======================================================
     ORDER ALERTS
  ======================================================= */

  const attentionOrders = useMemo(() => {

    return orders
      .filter((row) => {

        const completion =
          toNumber(
            row.productionCompletionPercentage
          );


        const waste =
          toNumber(row.wastePercentage);


        const status =
          String(
            row.statusName || ""
          ).toLowerCase();


        return (
          completion < 50 ||
          waste >= 10 ||
          status.includes("متأخر") ||
          status.includes("late")
        );

      })
      .sort(
        (a, b) =>
          toNumber(
            a.productionCompletionPercentage
          ) -
          toNumber(
            b.productionCompletionPercentage
          )
      )
      .slice(0, 5);

  }, [orders]);


  /* =======================================================
     KPIs
  ======================================================= */

  const kpis = [
    {
      label: "إجمالي الطلبيات",
      value:
        summary.ordersCount ??
        orderStats.total ??
        0,
      icon: ClipboardList,
    },
    {
      label: "إجمالي الإنتاج",
      value:
        summary.totalProducedQuantity ??
        productStats.produced,
      icon: Factory,
    },
    {
      label: "نسبة الإنجاز",
      value: `${toNumber(
        summary.productionCompletionPercentage ||
        productStats.completion
      ).toFixed(1)}%`,
      icon: TrendingUp,
    },
    {
      label: "نسبة الهدر",
      value: `${toNumber(
        summary.wastePercentage ||
        productStats.wastePercentage
      ).toFixed(1)}%`,
      icon: AlertTriangle,
      tone: "danger",
    },
  ];


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="animate-fade-in">

      {/* ===================================================
          HEADER
      =================================================== */}

      <PageHeader
        title="لوحة الإنتاج"
        description="مركز تحكم موحّد لمتابعة الإنتاج والطلبيات والهدر وأداء مراحل التشغيل."
      />


      {/* ===================================================
          FILTERS
      =================================================== */}

      <div className="mt-5 border border-stone-200 bg-white">

        <div className="flex flex-col gap-3 border-b border-stone-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Activity
                className="h-4 w-4 text-copper-600"
                strokeWidth={1.8}
              />

              <h2 className="font-display text-[13.5px] font-bold text-ink-900">
                نطاق التقرير
              </h2>

            </div>

            <p className="mt-1 text-[11.5px] text-ink-500">
              حدّد الفترة التي تريد تحليل أداء الإنتاج خلالها.
            </p>

          </div>


          <div className="flex items-center gap-2 text-[11px] text-ink-400">

            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isLoading
                  ? "animate-spin"
                  : ""
              }`}
              strokeWidth={1.8}
            />

            {isLoading
              ? "جاري تحديث البيانات..."
              : "البيانات محدثة"}

          </div>

        </div>


        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">

          {summaryFilters.map((field) => (

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

      </div>


      {/* ===================================================
          ERROR
      =================================================== */}

      {hasError && (

        <div
          className="mt-4 flex items-center gap-2 border px-4 py-3 text-[13px]"
          style={{
            color:
              "var(--color-status-danger)",

            backgroundColor:
              "var(--color-status-danger-bg)",

            borderColor:
              "transparent",
          }}
        >

          <AlertCircle
            className="h-4 w-4 shrink-0"
            strokeWidth={1.8}
          />

          <span>
            {errorMessage}
          </span>

        </div>

      )}


      {/* ===================================================
          KPI CARDS
      =================================================== */}

      {isLoading ? (

        <DashboardSkeleton />

      ) : (

        <>

          <section
            aria-label="مؤشرات الإنتاج"
            className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4"
          >

            {kpis.map((kpi) => (

              <StatCard
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                icon={kpi.icon}
                tone={kpi.tone}
              />

            ))}

          </section>


          {/* ===============================================
              MAIN PRODUCTION OVERVIEW
          =============================================== */}

          <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">

            {/* PRODUCTION */}
            <div className="border border-stone-200 bg-white">

              <div className="border-b border-stone-200 px-5 py-4">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="font-display text-[15px] font-bold text-ink-900">
                      أداء الإنتاج
                    </h2>

                    <p className="mt-1 text-[11.5px] text-ink-500">
                      مقارنة الكمية المطلوبة بالإنتاج الفعلي والمتبقي.
                    </p>

                  </div>

                  <Target
                    className="h-5 w-5 text-copper-600"
                    strokeWidth={1.5}
                  />

                </div>

              </div>


              <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-3">

                <MetricBlock
                  label="الكمية المطلوبة"
                  value={
                    summary.totalRequestedQuantity ??
                    productStats.requested
                  }
                  icon={PackageOpen}
                />

                <MetricBlock
                  label="الإنتاج الفعلي"
                  value={
                    summary.totalProducedQuantity ??
                    productStats.produced
                  }
                  icon={PackageCheck}
                  highlight
                />

                <MetricBlock
                  label="الكمية المتبقية"
                  value={
                    summary.remainingQuantity ??
                    productStats.remaining
                  }
                  icon={PackageMinus}
                  danger={
                    toNumber(
                      summary.remainingQuantity ??
                      productStats.remaining
                    ) > 0
                  }
                />

              </div>


              <div className="border-t border-stone-100 px-5 py-4">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-[11.5px] font-medium text-ink-500">
                    نسبة إنجاز الإنتاج
                  </span>

                  <strong
                    dir="ltr"
                    className="text-[13px] font-bold"
                  >
                    {toNumber(
                      summary.productionCompletionPercentage ||
                      productStats.completion
                    ).toFixed(1)}
                    %
                  </strong>

                </div>


                <PercentBar
                  value={
                    summary.productionCompletionPercentage ||
                    productStats.completion
                  }
                  tone="copper"
                />

              </div>

            </div>


            {/* ORDER HEALTH */}
            <div className="border border-stone-200 bg-white">

              <div className="border-b border-stone-200 px-5 py-4">

                <h2 className="font-display text-[15px] font-bold text-ink-900">
                  صحة الطلبيات
                </h2>

                <p className="mt-1 text-[11.5px] text-ink-500">
                  الحالة الحالية للطلبيات ضمن الفترة المحددة.
                </p>

              </div>


              <div className="grid grid-cols-2 gap-3 p-5">

                <MiniStatusCard
                  label="إجمالي"
                  value={
                    summary.ordersCount ??
                    orderStats.total
                  }
                  icon={ClipboardList}
                />

                <MiniStatusCard
                  label="مكتملة"
                  value={
                    summary.completedOrdersCount ??
                    orderStats.completed
                  }
                  icon={CheckCircle2}
                  tone="success"
                />

                <MiniStatusCard
                  label="غير مكتملة"
                  value={
                    summary.incompleteOrdersCount ??
                    orderStats.incomplete
                  }
                  icon={XCircle}
                  tone="danger"
                />

                <MiniStatusCard
                  label="تحتاج متابعة"
                  value={
                    attentionOrders.length
                  }
                  icon={AlertTriangle}
                  tone="warning"
                />

              </div>

            </div>

          </section>


          {/* ===============================================
              PRODUCTION STAGES
          =============================================== */}

          <section className="mt-4 border border-stone-200 bg-white">

            <div className="border-b border-stone-200 px-5 py-4">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-display text-[15px] font-bold text-ink-900">
                    مراحل الإنتاج
                  </h2>

                  <p className="mt-1 text-[11.5px] text-ink-500">
                    تدفق الإنتاج عبر القص والتلوين والتعبئة.
                  </p>

                </div>

                <Factory
                  className="h-5 w-5 text-copper-600"
                  strokeWidth={1.5}
                />

              </div>

            </div>


            <div className="grid grid-cols-1 divide-y divide-stone-100 md:grid-cols-3 md:divide-x md:divide-y-0">

              {stageStats.map((stage, index) => (

                <StageCard
                  key={stage.name}
                  index={index + 1}
                  {...stage}
                />

              ))}

            </div>

          </section>


          {/* ===============================================
              PRODUCTS + WASTE
          =============================================== */}

          <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* TOP PRODUCTS */}
            <div className="border border-stone-200 bg-white">

              <div className="border-b border-stone-200 px-5 py-4">

                <h2 className="font-display text-[15px] font-bold text-ink-900">
                  أعلى المنتجات إنتاجًا
                </h2>

                <p className="mt-1 text-[11.5px] text-ink-500">
                  المنتجات ذات أعلى إنتاج نهائي خلال الفترة.
                </p>

              </div>


              <div className="p-5">

                {topProducts.length === 0 ? (

                  <EmptyState />

                ) : (

                  <div className="space-y-4">

                    {topProducts.map((product, index) => {

                      const produced =
                        toNumber(
                          product.finalProducedQuantity
                        );


                      const width =
                        (produced /
                          maxProductProduction) *
                        100;


                      return (

                        <div
                          key={
                            product.productID ??
                            product.productName ??
                            index
                          }
                        >

                          <div className="mb-1.5 flex items-center justify-between gap-3">

                            <div className="flex min-w-0 items-center gap-2">

                              <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-stone-100 text-[10px] font-bold text-ink-500">
                                {index + 1}
                              </span>

                              <span className="truncate text-[12.5px] font-medium text-ink-800">
                                {product.productName || "منتج"}
                              </span>

                            </div>


                            <span
                              dir="ltr"
                              className="shrink-0 text-[12px] font-medium text-ink-700"
                            >
                              <Figures>
                                {produced}
                              </Figures>
                            </span>

                          </div>


                          <div className="h-2 overflow-hidden rounded-[1px] bg-stone-100">

                            <div
                              className="h-full rounded-[1px] transition-all"
                              style={{
                                width: `${width}%`,
                                backgroundColor:
                                  "var(--color-copper-600)",
                              }}
                            />

                          </div>

                        </div>

                      );

                    })}

                  </div>

                )}

              </div>

            </div>


            {/* WASTE */}
            <div className="border border-stone-200 bg-white">

              <div className="border-b border-stone-200 px-5 py-4">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="font-display text-[15px] font-bold text-ink-900">
                      تحليل الهدر
                    </h2>

                    <p className="mt-1 text-[11.5px] text-ink-500">
                      توزيع الهدر على مراحل الإنتاج.
                    </p>

                  </div>

                  <Trash2
                    className="h-5 w-5"
                    style={{
                      color:
                        "var(--color-status-danger)",
                    }}
                    strokeWidth={1.5}
                  />

                </div>

              </div>


              <div className="p-5">

                <div className="mb-5 flex items-end justify-between">

                  <div>

                    <p className="text-[11px] text-ink-500">
                      إجمالي الهدر
                    </p>

                    <p
                      dir="ltr"
                      className="mt-1 text-2xl font-bold text-ink-900"
                    >
                      <Figures>
                        {summary.totalWasteQuantity ??
                          productStats.waste}
                      </Figures>
                    </p>

                  </div>


                  <div className="text-left">

                    <p className="text-[11px] text-ink-500">
                      نسبة الهدر
                    </p>

                    <p
                      dir="ltr"
                      className="mt-1 text-lg font-bold"
                      style={{
                        color:
                          "var(--color-status-danger)",
                      }}
                    >
                      {toNumber(
                        summary.wastePercentage ||
                        productStats.wastePercentage
                      ).toFixed(1)}
                      %
                    </p>

                  </div>

                </div>


                <div className="space-y-4">

                  {stageStats.map((stage) => {

                    const waste =
                      toNumber(stage.waste);


                    const totalWaste =
                      Math.max(
                        1,
                        ...stageStats.map(
                          (item) =>
                            toNumber(item.waste)
                        )
                      );


                    const width =
                      (waste /
                        totalWaste) *
                      100;


                    return (

                      <div key={stage.name}>

                        <div className="mb-1.5 flex items-center justify-between">

                          <span className="text-[12px] text-ink-700">
                            {stage.name}
                          </span>

                          <span
                            dir="ltr"
                            className="text-[11.5px] font-medium text-ink-800"
                          >
                            <Figures>
                              {waste}
                            </Figures>
                          </span>

                        </div>


                        <div className="h-2 overflow-hidden bg-stone-100">

                          <div
                            className="h-full"
                            style={{
                              width: `${width}%`,
                              backgroundColor:
                                "var(--color-status-danger)",
                            }}
                          />

                        </div>

                      </div>

                    );

                  })}

                </div>

              </div>

            </div>

          </section>


          {/* ===============================================
              ATTENTION ORDERS
          =============================================== */}

          <section className="mt-4 border border-stone-200 bg-white">

            <div className="border-b border-stone-200 px-5 py-4">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-display text-[15px] font-bold text-ink-900">
                    الطلبيات التي تحتاج متابعة
                  </h2>

                  <p className="mt-1 text-[11.5px] text-ink-500">
                    طلبيات ذات إنجاز منخفض أو هدر مرتفع أو حالة تشغيلية حرجة.
                  </p>

                </div>

                <AlertTriangle
                  className="h-5 w-5"
                  style={{
                    color:
                      "var(--color-status-warning)",
                  }}
                  strokeWidth={1.6}
                />

              </div>

            </div>


            {attentionOrders.length === 0 ? (

              <div className="flex flex-col items-center justify-center px-5 py-12 text-center">

                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-stone-100">

                  <CheckCircle2
                    className="h-5 w-5 text-ink-500"
                    strokeWidth={1.5}
                  />

                </div>

                <p className="text-[13px] font-medium text-ink-800">
                  لا توجد طلبيات حرجة حاليًا
                </p>

                <p className="mt-1 text-[11.5px] text-ink-500">
                  أداء الطلبيات ضمن الحدود الطبيعية.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px] border-collapse text-right">

                  <thead>

                    <tr className="border-b border-stone-200 bg-stone-50">

                      <th className="px-5 py-3 text-[11px] font-medium text-ink-500">
                        الطلبية
                      </th>

                      <th className="px-5 py-3 text-[11px] font-medium text-ink-500">
                        المنتج
                      </th>

                      <th className="px-5 py-3 text-[11px] font-medium text-ink-500">
                        المطلوب
                      </th>

                      <th className="px-5 py-3 text-[11px] font-medium text-ink-500">
                        الإنتاج
                      </th>

                      <th className="px-5 py-3 text-[11px] font-medium text-ink-500">
                        الإنجاز
                      </th>

                      <th className="px-5 py-3 text-[11px] font-medium text-ink-500">
                        الهدر
                      </th>

                      <th className="px-5 py-3 text-[11px] font-medium text-ink-500">
                        الحالة
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {attentionOrders.map(
                      (order, index) => (

                        <tr
                          key={
                            order.orderID ??
                            index
                          }
                          className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                        >

                          <td className="px-5 py-3.5 text-[12.5px] font-medium text-ink-900">

                            <Figures>
                              #{order.orderID}
                            </Figures>

                          </td>


                          <td className="px-5 py-3.5 text-[12.5px] text-ink-700">
                            {order.productName || "—"}
                          </td>


                          <td
                            dir="ltr"
                            className="px-5 py-3.5 text-[12px] text-ink-700"
                          >

                            <Figures>
                              {order.requestedQuantity}
                            </Figures>

                          </td>


                          <td
                            dir="ltr"
                            className="px-5 py-3.5 text-[12px] text-ink-700"
                          >

                            <Figures>
                              {order.finalProducedQuantity}
                            </Figures>

                          </td>


                          <td className="px-5 py-3.5">

                            <div className="flex items-center gap-2">

                              <div className="h-1.5 w-16 overflow-hidden bg-stone-100">

                                <div
                                  className="h-full"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      toNumber(
                                        order.productionCompletionPercentage
                                      )
                                    )}%`,
                                    backgroundColor:
                                      getCompletionColor(
                                        order.productionCompletionPercentage
                                      ),
                                  }}
                                />

                              </div>

                              <span
                                dir="ltr"
                                className="text-[11.5px] text-ink-600"
                              >
                                {toNumber(
                                  order.productionCompletionPercentage
                                ).toFixed(0)}
                                %
                              </span>

                            </div>

                          </td>


                          <td
                            dir="ltr"
                            className="px-5 py-3.5"
                          >

                            <span
                              className="text-[12px] font-medium"
                              style={{
                                color:
                                  toNumber(
                                    order.wastePercentage
                                  ) >= 10
                                    ? "var(--color-status-danger)"
                                    : "var(--color-ink-700)",
                              }}
                            >
                              {toNumber(
                                order.wastePercentage
                              ).toFixed(1)}
                              %
                            </span>

                          </td>


                          <td className="px-5 py-3.5">

                            <StatusPill
                              status={
                                order.statusName
                              }
                            />

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          {/* ===============================================
              QUICK SUMMARY
          =============================================== */}

          <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <FooterMetric
              label="المنتجات"
              value={
                productStats.count
              }
              icon={Boxes}
            />

            <FooterMetric
              label="الطلبات المكتملة"
              value={
                summary.completedOrdersCount ??
                orderStats.completed
              }
              icon={CheckCircle2}
            />

            <FooterMetric
              label="المتبقي"
              value={
                summary.remainingQuantity ??
                productStats.remaining
              }
              icon={PackageMinus}
            />

            <FooterMetric
              label="إجمالي الهدر"
              value={
                summary.totalWasteQuantity ??
                productStats.waste
              }
              icon={Trash2}
              danger
            />

          </section>

        </>

      )}

    </div>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */


function MetricBlock({
  label,
  value,
  icon: Icon,
  highlight = false,
  danger = false,
}) {

  return (

    <div>

      <div className="mb-3 flex items-center gap-2">

        <div
          className="flex h-8 w-8 items-center justify-center"
          style={{
            backgroundColor:
              danger
                ? "var(--color-status-danger-bg)"
                : "var(--color-copper-50)",
          }}
        >

          <Icon
            className="h-4 w-4"
            style={{
              color:
                danger
                  ? "var(--color-status-danger)"
                  : "var(--color-copper-600)",
            }}
            strokeWidth={1.7}
          />

        </div>

        <span className="text-[11.5px] text-ink-500">
          {label}
        </span>

      </div>


      <div
        dir="ltr"
        className={`text-2xl font-bold ${
          highlight
            ? "text-ink-950"
            : "text-ink-800"
        }`}
      >

        <Figures>
          {value ?? 0}
        </Figures>

      </div>

    </div>

  );
}


function MiniStatusCard({
  label,
  value,
  icon: Icon,
  tone,
}) {

  const colors = {
    success: "var(--color-status-success)",
    danger: "var(--color-status-danger)",
    warning: "var(--color-status-warning)",
    copper: "var(--color-copper-600)",
  };


  const backgrounds = {
    success: "var(--color-status-success-bg)",
    danger: "var(--color-status-danger-bg)",
    warning: "var(--color-status-warning-bg)",
    copper: "var(--color-copper-50)",
  };


  return (

    <div className="border border-stone-100 p-3.5">

      <div className="mb-2 flex items-center justify-between">

        <span className="text-[11px] text-ink-500">
          {label}
        </span>

        <Icon
          className="h-4 w-4"
          style={{
            color:
              colors[tone] ||
              colors.copper,
          }}
          strokeWidth={1.7}
        />

      </div>


      <div
        dir="ltr"
        className="text-xl font-bold text-ink-900"
      >

        <Figures>
          {value ?? 0}
        </Figures>

      </div>

    </div>

  );
}


function StageCard({
  index,
  name,
  produced,
  waste,
  percentage,
}) {

  return (

    <div className="p-5">

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <span
            className="flex h-8 w-8 items-center justify-center text-[11px] font-bold"
            style={{
              backgroundColor:
                "var(--color-copper-50)",
              color:
                "var(--color-copper-700)",
            }}
          >
            {String(index).padStart(2, "0")}
          </span>

          <div>

            <h3 className="text-[13px] font-bold text-ink-900">
              {name}
            </h3>

            <p className="mt-0.5 text-[10.5px] text-ink-500">
              مرحلة الإنتاج
            </p>

          </div>

        </div>


        <span
          dir="ltr"
          className="text-lg font-bold"
          style={{
            color:
              getCompletionColor(
                percentage
              ),
          }}
        >
          {toNumber(
            percentage
          ).toFixed(0)}
          %
        </span>

      </div>


      <div className="mb-4">

        <div className="h-2 overflow-hidden bg-stone-100">

          <div
            className="h-full transition-all"
            style={{
              width: `${Math.min(
                100,
                percentage
              )}%`,
              backgroundColor:
                getCompletionColor(
                  percentage
                ),
            }}
          />

        </div>

      </div>


      <div className="grid grid-cols-2 gap-4">

        <div>

          <p className="text-[10.5px] text-ink-500">
            الصافي
          </p>

          <p
            dir="ltr"
            className="mt-1 text-[13px] font-bold text-ink-800"
          >
            <Figures>
              {produced}
            </Figures>
          </p>

        </div>


        <div>

          <p className="text-[10.5px] text-ink-500">
            الهدر
          </p>

          <p
            dir="ltr"
            className="mt-1 text-[13px] font-bold"
            style={{
              color:
                "var(--color-status-danger)",
            }}
          >
            <Figures>
              {waste}
            </Figures>
          </p>

        </div>

      </div>

    </div>

  );
}


function StatusPill({ status }) {

  const tone =
    getOrderStatusTone(status);


  const styles = {
    success: {
      color: "var(--color-status-success)",
      background:
        "var(--color-status-success-bg)",
    },
    danger: {
      color: "var(--color-status-danger)",
      background:
        "var(--color-status-danger-bg)",
    },
    warning: {
      color: "var(--color-status-warning)",
      background:
        "var(--color-status-warning-bg)",
    },
    copper: {
      color: "var(--color-copper-700)",
      background:
        "var(--color-copper-50)",
    },
  };


  const style =
    styles[tone] || styles.copper;


  return (

    <span
      className="inline-flex items-center px-2 py-1 text-[10.5px] font-medium"
      style={{
        color: style.color,
        backgroundColor: style.background,
      }}
    >
      {status || "—"}
    </span>

  );
}


function FooterMetric({
  label,
  value,
  icon: Icon,
  danger = false,
}) {

  return (

    <div className="flex items-center gap-3 border border-stone-200 bg-white px-4 py-3.5">

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center"
        style={{
          backgroundColor:
            danger
              ? "var(--color-status-danger-bg)"
              : "var(--color-copper-50)",
        }}
      >

        <Icon
          className="h-4 w-4"
          style={{
            color:
              danger
                ? "var(--color-status-danger)"
                : "var(--color-copper-600)",
          }}
          strokeWidth={1.7}
        />

      </div>


      <div className="min-w-0">

        <p className="text-[10.5px] text-ink-500">
          {label}
        </p>

        <p
          dir="ltr"
          className="mt-0.5 text-[15px] font-bold text-ink-900"
        >

          <Figures>
            {value ?? 0}
          </Figures>

        </p>

      </div>

    </div>

  );
}


function EmptyState() {

  return (

    <div className="flex flex-col items-center justify-center py-10 text-center">

      <PackageOpen
        className="h-7 w-7 text-ink-400/60"
        strokeWidth={1.4}
      />

      <p className="mt-2 text-[12.5px] text-ink-500">
        لا توجد بيانات متاحة للفترة المحددة.
      </p>

    </div>

  );
}


function DashboardSkeleton() {

  return (

    <div className="mt-4 space-y-4">

      {/* KPI */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

        {Array.from({ length: 4 }).map(
          (_, index) => (

            <div
              key={index}
              className="border border-stone-200 bg-white p-4"
            >

              <div className="mb-4 h-8 w-8 animate-pulse bg-stone-150" />

              <div className="mb-2 h-3 w-24 animate-pulse bg-stone-150" />

              <div className="h-6 w-20 animate-pulse bg-stone-150" />

            </div>

          )
        )}

      </div>


      {/* MAIN */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">

        {Array.from({ length: 2 }).map(
          (_, index) => (

            <div
              key={index}
              className="border border-stone-200 bg-white p-5"
            >

              <div className="mb-5 h-4 w-32 animate-pulse bg-stone-150" />

              <div className="grid grid-cols-3 gap-4">

                {Array.from({ length: 3 }).map(
                  (_, item) => (

                    <div key={item}>

                      <div className="mb-3 h-8 w-8 animate-pulse bg-stone-150" />

                      <div className="h-6 w-20 animate-pulse bg-stone-150" />

                    </div>

                  )
                )}

              </div>

            </div>

          )
        )}

      </div>


      {/* STAGES */}

      <div className="border border-stone-200 bg-white">

        <div className="border-b border-stone-200 p-5">

          <div className="h-4 w-32 animate-pulse bg-stone-150" />

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3">

          {Array.from({ length: 3 }).map(
            (_, index) => (

              <div
                key={index}
                className="p-5"
              >

                <div className="mb-5 h-8 w-8 animate-pulse bg-stone-150" />

                <div className="mb-3 h-2 w-full animate-pulse bg-stone-150" />

                <div className="h-4 w-24 animate-pulse bg-stone-150" />

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );
}