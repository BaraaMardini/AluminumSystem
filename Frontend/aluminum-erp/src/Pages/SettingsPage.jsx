import { useState } from "react";
import { KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import useAuthStore from "../stores/authStore";
import useUsersStore from "../stores/UsersStore";

const inputClass =
  "w-full border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-[var(--color-copper-500)] focus:outline-none";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { update, updateState } = useUsersStore();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess(false);

    if (newPassword.length < 6) {
      setFormError("كلمة السر الجديدة يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("كلمة السر الجديدة وتأكيدها غير متطابقين.");
      return;
    }

    await update(user.id, { email: user.email, passwordHash: newPassword });
    const result = useUsersStore.getState().updateState;

    if (result.errorCode === 0) {
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setFormError(result.message || "تعذّر تحديث كلمة السر.");
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <PageHeader title="الإعدادات" description="تغيير كلمة السر الخاصة بحسابك." />

      {/* تنبيه: مشكلة معروفة بالباك اند حاليًا */}
      <div
        className="flex items-start gap-3 border px-4 py-3 text-xs"
        style={{ borderColor: "var(--color-status-pending)", backgroundColor: "var(--color-status-pending-bg)", color: "var(--color-status-pending)" }}
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
        <p>
          ملاحظة تقنية: عملية تحديث كلمة السر تعتمد حاليًا على تحقّق بالباك اند غير
          مكتمل (مطابقة الهاش بجملة SQL مباشرة بدل BCrypt.Verify) — قد لا تكتمل
          العملية بنجاح حتى يُصلَّح ذلك من طرف الباك اند.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md border border-stone-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-2">
          <KeyRound className="h-4 w-4" style={{ color: "var(--color-copper-600)" }} strokeWidth={1.8} />
          <h2 className="font-display text-[15px] font-bold text-ink-900">تغيير كلمة السر</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">كلمة السر الجديدة</label>
            <input
              type="password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">تأكيد كلمة السر الجديدة</label>
            <input
              type="password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        {formError && (
          <p
            className="mt-4 border px-3 py-2 text-xs"
            style={{ borderColor: "var(--color-status-danger)", backgroundColor: "var(--color-status-danger-bg)", color: "var(--color-status-danger)" }}
          >
            {formError}
          </p>
        )}

        {success && (
          <p
            className="mt-4 flex items-center gap-2 border px-3 py-2 text-xs"
            style={{ borderColor: "var(--color-status-success)", backgroundColor: "var(--color-status-success-bg)", color: "var(--color-status-success)" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
            تم تحديث كلمة السر بنجاح.
          </p>
        )}

        <button
          type="submit"
          disabled={updateState?.loading}
          className="mt-5 w-full py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60"
          style={{ backgroundColor: "var(--color-copper-600)" }}
        >
          {updateState?.loading ? "جارٍ الحفظ…" : "حفظ كلمة السر الجديدة"}
        </button>
      </form>
    </div>
  );
}