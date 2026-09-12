import { useEffect } from "react";
import { User, Mail, ShieldCheck, Calendar, BadgeCheck } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Figures from "../components/Figures";
import useAuthStore from "../stores/authStore";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-4 last:border-0">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center border"
        style={{ backgroundColor: "var(--color-copper-50)", borderColor: "var(--color-copper-100)" }}
      >
        <Icon className="h-[18px] w-[18px]" style={{ color: "var(--color-copper-600)" }} strokeWidth={1.7} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] text-ink-500">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-ink-900">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = (user?.fullName || user?.userName || "؟").trim().slice(0, 2);

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <PageHeader title="الملف الشخصي" description="بياناتك الأساسية بالنظام كما هي مسجّلة حاليًا." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* بطاقة الهوية */}
        <div className="flex flex-col items-center gap-3 border border-stone-200 bg-white px-6 py-8 text-center">
          <div
            className="font-display flex h-20 w-20 items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: "var(--color-graphite-900)" }}
          >
            <Figures>{initials}</Figures>
          </div>
          <div>
            <p className="font-display text-[16px] font-bold text-ink-900">{user?.fullName || user?.userName}</p>
            <p className="mt-0.5 text-xs text-ink-500">{user?.role}</p>
          </div>
          <StatusBadge status={user?.isActive ? "نشط" : "غير نشط"} />
        </div>

        {/* تفاصيل الحساب */}
        <div className="border border-stone-200 bg-white">
          <div className="border-b border-stone-200 px-5 py-4">
            <h2 className="font-display text-[15px] font-bold text-ink-900">تفاصيل الحساب</h2>
          </div>
          <InfoRow icon={User} label="اسم المستخدم" value={user?.userName} />
          <InfoRow icon={Mail} label="البريد الإلكتروني" value={user?.email} />
          <InfoRow icon={ShieldCheck} label="الدور" value={user?.role} />
          <InfoRow icon={BadgeCheck} label="معرّف المستخدم" value={user?.id != null ? <Figures>{user.id}</Figures> : "—"} />
        </div>
      </div>
    </div>
  );
}