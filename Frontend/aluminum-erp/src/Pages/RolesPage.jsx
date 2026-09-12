import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  X,
  ShieldCheck,
  Search,
} from "lucide-react";
import useRolesStore from "../stores/RolesStore";
import { rolesEntity as config } from "../entities/RolesEntity";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Figures from "../components/Figures";

const operations = config.operations;
const columns = operations.getAll.columns;
const keyField =
  operations.update?.by || config.idField || "id";

const hasAdd = Boolean(operations.add);
const hasUpdate = Boolean(operations.update);
const hasDelete = Boolean(operations.delete);
const hasActionsColumn = hasUpdate || hasDelete;
const hasSearch = Boolean(operations.search);

function formatDate(value) {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

function useLocalToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(null),
      4000
    );

    return () => clearTimeout(timer);
  }, [toast]);

  return {
    toast,
    success: (message) =>
      setToast({
        type: "success",
        message,
      }),
    error: (message) =>
      setToast({
        type: "error",
        message,
      }),
  };
}

export default function RolesPage() {
  const {
    getAllState,
    addState,
    updateState,
    fetchAll,
    add,
    update,
  } = useRolesStore();

  const toast = useLocalToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] =
    useState("add");
  const [activeRole, setActiveRole] =
    useState(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const roles = getAllState.data || [];
  const loading = getAllState.loading;

  function openAdd() {
    setModalMode("add");
    setActiveRole(null);
    setModalOpen(true);
  }

  function openEdit(role) {
    setModalMode("edit");
    setActiveRole(role);
    setModalOpen(true);
  }

  async function handleSubmit(formData) {
    if (modalMode === "add") {
      const result = await add(formData);

      if (result?.data ?? addState.data) {
        toast.success("تمت إضافة الدور بنجاح");
        setModalOpen(false);
        fetchAll();
      } else {
        toast.error(
          addState.message ||
            "تعذّرت إضافة الدور"
        );
      }

      return;
    }

    const result = await update(
      activeRole[keyField],
      formData
    );

    if (result?.data ?? updateState.data) {
      toast.success("تم تعديل الدور بنجاح");
      setModalOpen(false);
      fetchAll();
    } else {
      toast.error(
        updateState.message ||
          "تعذّر تعديل الدور"
      );
    }
  }

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          hasAdd && (
            <button
              onClick={openAdd}
              className="group inline-flex items-center gap-2 rounded-md bg-[var(--color-graphite-950)] px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-[var(--color-copper-700)] hover:shadow-md"
            >
              <Plus
                className="h-4 w-4 transition-transform group-hover:rotate-90"
                strokeWidth={2}
              />

              {config.addLabel}
            </button>
          )
        }
      />

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_2px_12px_rgba(30,26,21,0.035)]">
        <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-copper-50)] text-[var(--color-copper-700)]">
              <ShieldCheck
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-ink-900">
                قائمة الأدوار
              </p>

              <p className="mt-0.5 text-[10px] text-ink-500">
                إدارة صلاحيات وأدوار النظام
              </p>
            </div>
          </div>

          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-medium text-ink-500">
            <Figures>{roles.length}</Figures> دور
          </span>
        </div>

        {hasSearch && (
          <div className="border-b border-stone-100 p-4">
            <div className="relative max-w-sm">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

              <input
                type="search"
                placeholder="البحث..."
                className="w-full rounded-md border border-stone-200 bg-stone-50 py-2.5 pe-9 ps-3 text-xs text-ink-900 outline-none transition focus:border-[var(--color-copper-400)] focus:bg-white focus:ring-2 focus:ring-[var(--color-copper-100)]"
              />
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80">
                {columns.map((col) => (
                  <th
                    key={col.field}
                    className="whitespace-nowrap px-4 py-3 text-right text-[10.5px] font-semibold text-ink-500"
                  >
                    {col.header}
                  </th>
                ))}

                {hasActionsColumn && (
                  <th className="px-4 py-3 text-right text-[10.5px] font-semibold text-ink-500">
                    إجراءات
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: 5 }).map(
                  (_, i) => (
                    <tr
                      key={i}
                      className="border-b border-stone-100"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.field}
                          className="px-4 py-4"
                        >
                          <div className="h-3 w-24 animate-pulse rounded bg-stone-100" />
                        </td>
                      ))}

                      {hasActionsColumn && (
                        <td className="px-4 py-4">
                          <div className="h-8 w-8 animate-pulse rounded-md bg-stone-100" />
                        </td>
                      )}
                    </tr>
                  )
                )}

              {!loading &&
                roles.length === 0 && (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        (hasActionsColumn ? 1 : 0)
                      }
                      className="px-4 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-ink-400">
                          <ShieldCheck className="h-5 w-5" />
                        </div>

                        <p className="text-sm font-semibold text-ink-800">
                          لا توجد أدوار
                        </p>

                        <p className="mt-1 text-xs text-ink-500">
                          ابدأ بإضافة أول دور للنظام.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              {!loading &&
                roles.map((role) => (
                  <tr
                    key={role[keyField]}
                    className="group border-b border-stone-100 last:border-0 hover:bg-stone-50/70"
                  >
                    <td className="px-4 py-3.5">
                      <Figures>{role.id}</Figures>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-ink-900">
                      {role.roleName}
                    </td>

                    <td className="max-w-[360px] px-4 py-3.5 text-ink-600">
                      <span className="line-clamp-2">
                        {role.description || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge
                        status={
                          role.isActive
                            ? "نشط"
                            : "غير نشط"
                        }
                      />
                    </td>

                    <td className="px-4 py-3.5 text-ink-600">
                      <span dir="ltr">
                        <Figures>
                          {formatDate(
                            role.createdAt
                          )}
                        </Figures>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-ink-600">
                      <span dir="ltr">
                        <Figures>
                          {formatDate(
                            role.updatedAt
                          )}
                        </Figures>
                      </span>
                    </td>

                    {hasActionsColumn && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {hasUpdate && (
                            <button
                              onClick={() =>
                                openEdit(role)
                              }
                              className="rounded-md p-2 text-ink-400 transition hover:bg-[var(--color-copper-50)] hover:text-[var(--color-copper-700)]"
                              aria-label="تعديل"
                              title="تعديل"
                            >
                              <Pencil
                                className="h-4 w-4"
                                strokeWidth={1.8}
                              />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <RoleFormModal
          mode={modalMode}
          role={activeRole}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          submitting={
            modalMode === "add"
              ? addState.loading
              : updateState.loading
          }
        />
      )}

      {toast.toast && (
        <Toast toast={toast.toast} />
      )}
    </div>
  );
}

function Toast({ toast }) {
  const success = toast.type === "success";

  return (
    <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-fade-in">
      <div
        className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 text-sm text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] ${
          success
            ? "border-[var(--color-status-success)] bg-[var(--color-status-success)]"
            : "border-[var(--color-status-danger)] bg-[var(--color-status-danger)]"
        }`}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-white/80" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function RoleFormModal({
  mode,
  role,
  onSubmit,
  onClose,
  submitting,
}) {
  const fields =
    mode === "add"
      ? operations.add.fields
      : operations.update.fields;

  const [values, setValues] = useState(() => {
    const initial = {};

    fields.forEach((f) => {
      if (f.type === "checkbox") {
        initial[f.name] =
          mode === "edit"
            ? Boolean(role?.[f.name])
            : true;
      } else {
        initial[f.name] =
          mode === "edit"
            ? role?.[f.name] ?? ""
            : "";
      }
    });

    return initial;
  });

  const [errors, setErrors] = useState({});

  function setValue(name, value) {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }

  function validate() {
    const next = {};

    fields.forEach((f) => {
      if (
        f.type === "text" &&
        !String(values[f.name] || "").trim()
      ) {
        next[f.name] = "هذا الحقل مطلوب";
      }
    });

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-copper-600)]">
              {mode === "add"
                ? "إضافة جديدة"
                : "تعديل البيانات"}
            </p>

            <h2 className="font-display mt-1 text-base font-bold text-ink-900">
              {mode === "add"
                ? config.addLabel
                : "تعديل الدور"}
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="rounded-md p-2 text-ink-400 transition hover:bg-stone-100 hover:text-ink-900"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
        >
          {fields.map((f) => (
            <div key={f.name}>
              {f.type === "checkbox" ? (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3.5 transition hover:border-stone-300">
                  <input
                    type="checkbox"
                    checked={Boolean(
                      values[f.name]
                    )}
                    onChange={(e) =>
                      setValue(
                        f.name,
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-stone-300 accent-[var(--color-copper-600)]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-ink-800">
                      {f.label}
                    </p>

                    <p className="mt-0.5 text-[10px] text-ink-500">
                      تفعيل هذا الخيار للدور
                    </p>
                  </div>
                </label>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-ink-700">
                    {f.label}
                  </label>

                  <input
                    type="text"
                    value={values[f.name]}
                    onChange={(e) =>
                      setValue(
                        f.name,
                        e.target.value
                      )
                    }
                    className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 ${
                      errors[f.name]
                        ? "border-[var(--color-status-danger)] focus:ring-2 focus:ring-red-100"
                        : "border-stone-200 focus:border-[var(--color-copper-400)] focus:ring-2 focus:ring-[var(--color-copper-100)]"
                    }`}
                  />

                  {errors[f.name] && (
                    <p className="text-[10.5px] text-[var(--color-status-danger)]">
                      {errors[f.name]}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </form>

        <div className="flex items-center justify-end gap-2 border-t border-stone-100 bg-stone-50/50 px-5 py-4">
          <button
            onClick={onClose}
            type="button"
            className="rounded-md px-4 py-2.5 text-xs font-medium text-ink-600 transition hover:bg-stone-100"
          >
            إلغاء
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            type="button"
            className="rounded-md bg-[var(--color-graphite-950)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-copper-700)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "جارٍ الحفظ..."
              : "حفظ التغييرات"}
          </button>
        </div>
      </div>
    </div>
  );
}