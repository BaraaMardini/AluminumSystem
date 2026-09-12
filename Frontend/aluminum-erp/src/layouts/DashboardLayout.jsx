import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { findActiveNavItem } from "../utils/navigation";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const activeItem = findActiveNavItem(location.pathname);

  const pageTitle = activeItem?.label ?? "لوحة الإنتاج";
  const pageDescription = activeItem?.description;
  const pageGroup = activeItem?.groupLabel;

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-[var(--color-stone-100)] text-[var(--color-ink-900)]"
    >
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              transparent 49%,
              var(--color-ink-900) 50%,
              transparent 51%
            ),
            linear-gradient(
              0deg,
              transparent 49%,
              var(--color-ink-900) 50%,
              transparent 51%
            )
          `,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="flex min-h-screen w-full">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            pageTitle={pageTitle}
            pageGroup={pageGroup}
            pageDescription={pageDescription}
            onOpenMobileSidebar={() => setMobileOpen(true)}
            onToggleSidebar={() => setCollapsed((value) => !value)}
          />

          <main className="flex-1">
            <div className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 sm:py-6 xl:px-8">
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}