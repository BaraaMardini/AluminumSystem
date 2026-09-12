import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken, getCurrentUser } from "../api/httpClient";
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Calendar,
  ChevronLeft,
} from "lucide-react";

const TODAY = new Date().toLocaleDateString(
  "ar-EG-u-nu-latn",
  {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }
);

export default function Header({
  pageTitle,
  pageGroup,
  pageDescription,
  onOpenMobileSidebar,
  onToggleSidebar,
}) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const currentUser = getCurrentUser();
  const displayName = currentUser?.email
    ? currentUser.email.split("@")[0]
    : "مستخدم";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  function handleLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[var(--color-stone-50)]/90 backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        {/* Right */}
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="فتح القائمة"
            className="rounded-lg p-2 text-ink-500 transition hover:bg-stone-200 hover:text-ink-900 lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.7} />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="طي / فتح القائمة"
            className="hidden rounded-lg p-2 text-ink-500 transition hover:bg-stone-200 hover:text-ink-900 lg:flex"
          >
            <Menu className="h-5 w-5" strokeWidth={1.7} />
          </button>

          <div
            className="mx-2 hidden h-8 w-px bg-stone-200 sm:block"
            aria-hidden="true"
          />

          <div className="min-w-0">
            {pageGroup && (
              <nav
                aria-label="مسار التنقّل"
                className="mb-0.5 flex items-center gap-1 text-[10.5px] text-ink-500"
              >
                <span>{pageGroup}</span>

                <ChevronLeft
                  className="h-3 w-3"
                  strokeWidth={2}
                />

                <span className="font-medium text-ink-700">
                  {pageTitle}
                </span>
              </nav>
            )}

            <h2 className="font-display truncate text-[17px] font-bold tracking-tight text-ink-900">
              {pageTitle}
            </h2>

            {pageDescription && (
              <p className="mt-0.5 hidden max-w-xl truncate text-[11px] text-ink-500 md:block">
                {pageDescription}
              </p>
            )}
          </div>
        </div>

        {/* Left */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-[11px] text-ink-500 shadow-sm md:flex">
            <Calendar
              className="h-3.5 w-3.5 text-ink-400"
              strokeWidth={1.7}
            />

            <span>{TODAY}</span>
          </div>

          <button
            type="button"
            aria-label="الإشعارات، إشعار واحد غير مقروء"
            className="relative rounded-lg p-2.5 text-ink-500 transition hover:bg-stone-200 hover:text-ink-900"
          >
            <Bell
              className="h-[18px] w-[18px]"
              strokeWidth={1.7}
            />

            <span
              className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full ring-2 ring-stone-50"
              style={{
                backgroundColor:
                  "var(--color-copper-500)",
              }}
            />
          </button>

          <div
            className="mx-1 hidden h-8 w-px bg-stone-200 sm:block"
            aria-hidden="true"
          />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() =>
                setMenuOpen((open) => !open)
              }
              aria-haspopup="true"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-stone-200"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold text-white shadow-sm"
                style={{
                  backgroundColor:
                    "var(--color-graphite-900)",
                }}
              >
                {avatarLetter}
              </div>

              <div className="hidden text-right leading-tight sm:block">
                <p className="font-display text-[12.5px] font-semibold text-ink-900">
                  {displayName}
                </p>
              </div>

              <ChevronDown
                className={`h-3.5 w-3.5 text-ink-500 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
                strokeWidth={2}
              />
            </button>

            {menuOpen && (
              <div className="animate-fade-in absolute left-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-lg border border-stone-200 bg-white py-1.5 shadow-[0_16px_40px_rgba(30,26,21,0.12)]">
                <div className="border-b border-stone-100 px-4 py-3">
                  <p className="text-xs font-semibold text-ink-900">
                    {displayName}
                  </p>
                </div>

                <div className="p-1.5">
                  <MenuItem
                    icon={LogOut}
                    label="تسجيل الخروج"
                    danger
                    onClick={handleLogout}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({
  icon: Icon,
  label,
  danger,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[12.5px] transition-colors ${
        danger
          ? "text-[var(--color-status-danger)] hover:bg-[var(--color-status-danger-bg)]"
          : "text-ink-700 hover:bg-stone-100"
      }`}
    >
      <Icon
        className="h-4 w-4"
        strokeWidth={1.7}
      />

      <span>{label}</span>
    </button>
  );
}