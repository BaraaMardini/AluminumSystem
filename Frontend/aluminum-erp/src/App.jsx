import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./layouts/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./Pages/Dashboard";
import LoginPage from "./Pages/LoginPage";

import ProductsPage from "./Pages/ProductsPage";
import StatusesPage from "./Pages/StatusesPage";
import RolesPage from "./Pages/RolesPage";
import PermissionsPage from "./Pages/PermissionsPage";
import UsersPage from "./Pages/UsersPage";

import WasteTypesPage from "./Pages/WasteTypesPage";
import WasteReasonsPage from "./Pages/WasteReasonsPage";

import ProductionStagesPage from "./Pages/ProductionStagesPage";
import ProductionOrdersPage from "./Pages/ProductionOrdersPage";
import ProductionOrderStagesPage from "./Pages/ProductionOrderStagesPage";

import CuttingManagementPage from "./Pages/CuttingManagementPage";
import ColoringManagementPage from "./Pages/ColoringManagementPage";
import PackagingManagementPage from "./Pages/PackagingManagementPage";

import ProductionStageWastesPage from "./Pages/ProductionStageWastesPage";

// التقارير
import ReportOrdersPage from "./Pages/ReportOrdersPage";
import ReportProductComparisonsPage from "./Pages/ReportProductComparisonsPage";
import ReportProductionSummarysPage from "./Pages/ReportProductionSummarysPage";
import ReportProductProductionsPage from "./Pages/ReportProductProductionsPage";
import ReportCancelledOrdersPage from "./Pages/ReportCancelledOrdersPage";


// =============================================================
// App
// =============================================================

function App() {
  return (
    <Routes>

      {/* =====================================================
          تسجيل الدخول
      ===================================================== */}

      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />


      {/* =====================================================
          النظام المحمي
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        {/* ===================================================
            لوحة التحكم
        =================================================== */}

        <Route
          path="/"
          element={
            <Dashboard />
          }
        />


        {/* ===================================================
            التقارير والتحليلات
        =================================================== */}

        <Route
          path="/reports/production-summary"
          element={
            <ReportProductionSummarysPage />
          }
        />

        <Route
          path="/reports/orders"
          element={
            <ReportOrdersPage />
          }
        />

        <Route
          path="/reports/cancelled-orders"
          element={
            <ReportCancelledOrdersPage />
          }
        />

        <Route
          path="/reports/product-production"
          element={
            <ReportProductProductionsPage />
          }
        />

        <Route
          path="/reports/product-comparison"
          element={
            <ReportProductComparisonsPage />
          }
        />


        {/* ===================================================
            البيانات الأساسية
        =================================================== */}

        <Route
          path="/products"
          element={
            <ProductsPage />
          }
        />

        <Route
          path="/statuses"
          element={
            <StatusesPage />
          }
        />


        {/* ===================================================
            الإنتاج والطلبيات
        =================================================== */}

        <Route
          path="/orders"
          element={
            <ProductionOrdersPage />
          }
        />

        <Route
          path="/order-stages"
          element={
            <ProductionOrderStagesPage />
          }
        />

        <Route
          path="/cutting"
          element={
            <CuttingManagementPage />
          }
        />

        <Route
          path="/painting"
          element={
            <ColoringManagementPage />
          }
        />

        <Route
          path="/packaging"
          element={
            <PackagingManagementPage />
          }
        />

        <Route
          path="/ProductionStages"
          element={
            <ProductionStagesPage />
          }
        />


        {/* ===================================================
            الهدر والمخلفات
        =================================================== */}

        <Route
          path="/production-stage-wastes"
          element={
            <ProductionStageWastesPage />
          }
        />

        <Route
          path="/waste-types"
          element={
            <WasteTypesPage />
          }
        />

        <Route
          path="/waste-reasons"
          element={
            <WasteReasonsPage />
          }
        />


        {/* ===================================================
            الإدارة
        =================================================== */}

        <Route
          path="/users"
          element={
            <UsersPage />
          }
        />

        <Route
          path="/roles"
          element={
            <RolesPage />
          }
        />

        <Route
          path="/permissions"
          element={
            <PermissionsPage />
          }
        />

      </Route>

    </Routes>
  );
}

export default App;