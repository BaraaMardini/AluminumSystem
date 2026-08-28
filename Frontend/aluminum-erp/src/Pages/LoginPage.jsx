import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { API_URL } from "../api/apiConfig";
import { apiFetch, setToken } from "../api/httpClient";
import BrandMark from "../components/BrandMark";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch(`${API_URL}/LoginRequest/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const message = await response.text();

        setError(
          message || "فشل تسجيل الدخول، تحقق من البيانات."
        );

        setLoading(false);
        return;
      }

      const data = await response.json();

      setToken(data.accessToken);

      navigate("/", {
        replace: true,
      });
    } catch {
      setError("تعذر الاتصال بالخادم. حاول مجددًا.");
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-[#101110]
        text-white
        selection:bg-white/20
      "
    >
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">

        {/* =====================================================
            LEFT / BRAND SIDE
        ====================================================== */}

        <section
          className="
            relative hidden
            overflow-hidden
            lg:flex
            min-h-screen
            flex-col
            justify-between
            border-l
            border-white/[0.07]
            bg-[#151715]
            p-10
            xl:p-14
          "
        >
          {/* Background architecture */}

          <div
            className="
              pointer-events-none
              absolute inset-0
              opacity-[0.12]
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(255,255,255,0.08) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.08) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "48px 48px",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              -right-40
              top-1/4
              h-[520px]
              w-[520px]
              rounded-full
              bg-[#b87333]/10
              blur-[120px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-40
              -left-40
              h-[500px]
              w-[500px]
              rounded-full
              bg-white/[0.025]
              blur-[100px]
            "
          />

          {/* Logo */}

          <div className="relative z-10 flex items-center gap-3">
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                border border-white/10
                bg-[#b87333]
                shadow-[0_10px_35px_rgba(184,115,51,0.18)]
              "
            >
              <BrandMark size={22} />
            </div>

            <div>
              <p className="text-[16px] font-bold tracking-tight">
                AluminumProductionSystem
              </p>

              <p className="mt-0.5 text-[10px] text-white/35">
                نظام إدارة الإنتاج الصناعي
              </p>
            </div>
          </div>

          {/* Main statement */}

          <div className="relative z-10 max-w-xl">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-px w-8 bg-[#b87333]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
                Production Management
              </span>
            </div>

            <h2
              className="
                max-w-lg
                text-4xl
                font-black
                leading-[1.12]
                tracking-[-0.04em]
                text-white
                xl:text-5xl
              "
            >
              كل عملية إنتاج،
              <br />
              <span className="text-white/35">
                في مكان واحد.
              </span>
            </h2>

            <p
              className="
                mt-6
                max-w-md
                text-[13px]
                leading-7
                text-white/40
              "
            >
              منصة تشغيل مركزية لإدارة الإنتاج،
              متابعة المراحل، مراقبة الأداء،
              وربط العمليات اليومية ضمن نظام واحد.
            </p>

            {/* System indicators */}

            <div className="mt-10 grid max-w-md grid-cols-3 border border-white/[0.07]">
              <SystemMetric
                value="24/7"
                label="متابعة"
              />

              <SystemMetric
                value="LIVE"
                label="بيانات مباشرة"
              />

              <SystemMetric
                value="01"
                label="نظام موحد"
              />
            </div>
          </div>

          {/* Footer */}

          <div className="relative z-10 flex items-center justify-between">
            <p className="text-[9px] text-white/20">
              © {new Date().getFullYear()} Alometric
            </p>

            <div className="flex items-center gap-2 text-[9px] text-white/25">
              <ShieldCheck size={12} />
              بيئة تشغيل آمنة
            </div>
          </div>
        </section>

        {/* =====================================================
            LOGIN SIDE
        ====================================================== */}

        <section
          className="
            relative
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#f4f3f0]
            px-5
            py-10
            text-[#171816]
            sm:px-8
          "
        >
          {/* subtle background */}

          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-80
              w-80
              rounded-full
              bg-[#b87333]/[0.055]
              blur-[100px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              h-64
              w-64
              rounded-full
              bg-black/[0.025]
              blur-[80px]
            "
          />

          {/* Login container */}

          <div className="relative w-full max-w-[420px]">

            {/* Mobile brand */}

            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  bg-[#b87333]
                  text-white
                "
              >
                <BrandMark size={20} />
              </div>

              <div>
                <p className="text-[15px] font-bold">
                  ألوميتريك
                </p>

                <p className="text-[9px] text-black/35">
                  نظام إدارة الإنتاج الصناعي
                </p>
              </div>
            </div>

            {/* Heading */}

            <div className="mb-8">
              <div
                className="
                  mb-5
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#171816]
                  text-white
                "
              >
                <LogIn size={15} strokeWidth={1.8} />
              </div>

              <h1
                className="
                  text-3xl
                  font-black
                  tracking-[-0.035em]
                  text-[#171816]
                "
              >
                تسجيل الدخول
              </h1>

              <p className="mt-2 text-[12px] leading-6 text-black/40">
                أدخل بيانات حسابك للوصول إلى النظام.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div
                className="
                  mb-5
                  flex
                  items-start
                  gap-3
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3.5
                  text-[11px]
                  leading-5
                  text-red-700
                "
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={1.8}
                />

                <span>{error}</span>
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="
                border
                border-black/[0.08]
                bg-white
                p-6
                shadow-[0_20px_70px_rgba(0,0,0,0.055)]
                sm:p-8
              "
            >
              {/* Email */}

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-[11px]
                    font-bold
                    text-black/60
                  "
                >
                  البريد الإلكتروني
                </label>

                <div
                  className="
                    group
                    flex
                    h-12
                    items-center
                    gap-3
                    border
                    border-black/[0.09]
                    bg-[#fafaf9]
                    px-3.5
                    transition
                    focus-within:border-[#171816]
                    focus-within:bg-white
                  "
                >
                  <Mail
                    size={16}
                    strokeWidth={1.7}
                    className="
                      shrink-0
                      text-black/35
                      transition
                      group-focus-within:text-[#b87333]
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="username"
                    className="
                      h-full
                      w-full
                      bg-transparent
                      text-[13px]
                      text-black
                      outline-none
                      placeholder:text-black/25
                    "
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Password */}

              <div className="mb-7">
                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-[11px]
                    font-bold
                    text-black/60
                  "
                >
                  كلمة المرور
                </label>

                <div
                  className="
                    group
                    flex
                    h-12
                    items-center
                    gap-3
                    border
                    border-black/[0.09]
                    bg-[#fafaf9]
                    px-3.5
                    transition
                    focus-within:border-[#171816]
                    focus-within:bg-white
                  "
                >
                  <Lock
                    size={16}
                    strokeWidth={1.7}
                    className="
                      shrink-0
                      text-black/35
                      transition
                      group-focus-within:text-[#b87333]
                    "
                  />

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="
                      h-full
                      w-full
                      bg-transparent
                      text-[13px]
                      text-black
                      outline-none
                      placeholder:text-black/20
                    "
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2.5
                  bg-[#171816]
                  text-[12px]
                  font-bold
                  text-white
                  transition
                  hover:bg-[#282a27]
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <span>
                  {loading
                    ? "جارٍ الدخول..."
                    : "الدخول إلى النظام"}
                </span>

                {!loading && (
                  <ArrowLeft
                    size={15}
                    strokeWidth={1.8}
                    className="
                      transition-transform
                      duration-300
                      group-hover:-translate-x-1
                    "
                  />
                )}

                {loading && (
                  <span
                    className="
                      h-3.5
                      w-3.5
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />
                )}
              </button>

              {/* Bottom information */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                  border-t
                  border-black/[0.06]
                  pt-5
                "
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[9px] text-black/35">
                    النظام متاح
                  </span>
                </div>

                <span className="text-[9px] text-black/25">
                  Alometric OS
                </span>
              </div>
            </form>

            <p className="mt-6 text-center text-[9px] text-black/25">
              الوصول مخصص للمستخدمين المصرح لهم فقط
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   Small reusable metric
============================================================ */

function SystemMetric({ value, label }) {
  return (
    <div className="border-l border-white/[0.07] px-4 py-4 last:border-l-0">
      <p className="text-[12px] font-bold text-white/80">
        {value}
      </p>

      <p className="mt-1 text-[8px] text-white/25">
        {label}
      </p>
    </div>
  );
}