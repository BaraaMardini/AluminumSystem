import {
  PanelRightClose,
  PanelRightOpen,
  X,
  ChevronLeft,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { NAV_GROUPS } from "../utils/navigation";
import BrandMark from "../components/BrandMark";
import ProductionOrderStagesPage from "../Pages/ProductionOrderStagesPage";

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={onCloseMobile}
          className="
            fixed
            inset-0
            z-40
            bg-black/45
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          fixed
          inset-y-0
          right-0
          z-50
          flex
          flex-col
          overflow-hidden
          bg-[var(--color-graphite-950)]
          shadow-[-10px_0_40px_rgba(0,0,0,0.08)]
          transition-[transform,width]
          duration-300
          ease-out

          lg:sticky
          lg:top-0
          lg:h-screen
          lg:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          }
        `}
        style={{
          width: collapsed ? "76px" : "272px",
        }}
        aria-label="التنقّل الرئيسي"
      >
        {/* ──────────────────────────────────────────────────────
            Brand
        ────────────────────────────────────────────────────── */}

        <div
          className="
            relative
            flex
            h-[72px]
            shrink-0
            items-center
            border-b
            border-white/[0.07]
            px-4
          "
        >
          {/* subtle grid */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.035]
            "
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div
            className={`
              relative
              z-10
              flex
              w-full
              items-center
              ${
                collapsed
                  ? "justify-center"
                  : "justify-between"
              }
            `}
          >
            <div className="flex min-w-0 items-center gap-3">
              {/* Logo */}
              <div
                className="
                  relative
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  shadow-[0_4px_14px_rgba(0,0,0,0.18)]
                "
                style={{
                  backgroundColor:
                    "var(--color-copper-600)",
                }}
              >
                <BrandMark size={21} />

                <span
                  className="
                    absolute
                    -bottom-0.5
                    -left-0.5
                    h-2
                    w-2
                    rounded-full
                    border-2
                    border-[var(--color-graphite-950)]
                    bg-[var(--color-copper-300)]
                  "
                />
              </div>

              {!collapsed && (
                <div className="min-w-0 leading-tight">
                  <p className="font-display truncate text-[15px] font-bold tracking-tight text-white">
                    AluminumProductionSystem
                  </p>

                  <p className="mt-1 truncate text-[10px] text-graphite-400">
                    نظام إدارة الإنتاج
                  </p>
                </div>
              )}
            </div>

            {/* Mobile close */}
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="إغلاق القائمة"
              className="
                rounded-md
                p-1.5
                text-graphite-400
                transition
                hover:bg-white/[0.06]
                hover:text-white
                lg:hidden
              "
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────
            Navigation
        ────────────────────────────────────────────────────── */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-2.5
            py-5
          "
        >
          {NAV_GROUPS.map((group, groupIndex) => (
            <div
              key={group.id}
              className={`
                ${groupIndex > 0 ? "mt-6" : ""}
              `}
            >
              {/* Group title */}
              {!collapsed ? (
                <div className="mb-2 flex items-center gap-2 px-2.5">
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-graphite-500">
                    {group.label}
                  </span>

                  <span className="h-px flex-1 bg-white/[0.05]" />
                </div>
              ) : (
                groupIndex > 0 && (
                  <div
                    className="
                      mx-3
                      mb-3
                      h-px
                      bg-white/[0.07]
                    "
                  />
                )
              )}

              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `
                        group/nav
                        relative
                        flex
                        h-10
                        items-center
                        gap-3
                        rounded-md
                        px-3
                        text-[13px]
                        transition-all
                        duration-150

                        ${
                          collapsed
                            ? "justify-center px-0"
                            : ""
                        }

                        ${
                          isActive
                            ? "bg-white/[0.095] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)]"
                            : "text-graphite-400 hover:bg-white/[0.045] hover:text-stone-100"
                        }
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active indicator */}
                          {isActive && (
                            <span
                              className="
                                absolute
                                inset-y-2
                                right-0
                                w-[3px]
                                rounded-l-full
                              "
                              style={{
                                backgroundColor:
                                  "var(--color-copper-500)",
                                boxShadow:
                                  "0 0 12px rgba(190, 117, 55, .35)",
                              }}
                            />
                          )}

                          {/* Icon container */}
                          <span
                            className={`
                              relative
                              flex
                              h-7
                              w-7
                              shrink-0
                              items-center
                              justify-center
                              rounded-md
                              transition-colors
                              ${
                                isActive
                                  ? "bg-[var(--color-copper-500)]/10 text-[var(--color-copper-300)]"
                                  : "text-graphite-500 group-hover/nav:text-graphite-200"
                              }
                            `}
                          >
                            <item.icon
                              className="h-[17px] w-[17px]"
                              strokeWidth={1.6}
                            />
                          </span>

                          {!collapsed && (
                            <>
                              <span className="min-w-0 flex-1 truncate">
                                {item.label}
                              </span>

                              {isActive && (
                                <ChevronLeft
                                  className="
                                    h-3
                                    w-3
                                    shrink-0
                                    text-graphite-500
                                  "
                                  strokeWidth={1.8}
                                />
                              )}
                            </>
                          )}

                          {/* Tooltip collapsed */}
                          {collapsed && (
                            <span
                              role="tooltip"
                              className="
                                pointer-events-none
                                absolute
                                right-full
                                top-1/2
                                z-[100]
                                me-3
                                -translate-y-1/2
                                whitespace-nowrap
                                rounded-md
                                border
                                border-white/[0.08]
                                bg-graphite-900
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-white
                                opacity-0
                                shadow-[0_8px_30px_rgba(0,0,0,.25)]
                                transition-opacity
                                duration-150
                                group-hover/nav:opacity-100
                              "
                            >
                              {item.label}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* ──────────────────────────────────────────────────────
            Bottom
        ────────────────────────────────────────────────────── */}

        <div
          className="
            shrink-0
            border-t
            border-white/[0.07]
            p-2.5
          "
        >
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={
              collapsed
                ? "توسيع القائمة"
                : "طي القائمة"
            }
            className={`
              group/collapse
              flex
              h-10
              w-full
              items-center
              gap-3
              rounded-md
              px-3
              text-graphite-500
              transition
              hover:bg-white/[0.045]
              hover:text-white

              ${
                collapsed
                  ? "justify-center px-0"
                  : ""
              }
            `}
          >
            {collapsed ? (
              <PanelRightOpen
                className="h-[18px] w-[18px]"
                strokeWidth={1.5}
              />
            ) : (
              <>
                <PanelRightClose
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.5}
                />

                <span className="text-[11px]">
                  طي القائمة
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

