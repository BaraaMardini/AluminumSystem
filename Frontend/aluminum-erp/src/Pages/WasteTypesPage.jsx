import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  X,
  Search,
  RefreshCw,
} from "lucide-react";

import useWasteTypesStore from "../stores/WasteTypesStore";
import { wasteTypesEntity as config } from "../entities/WasteTypesEntity";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Figures from "../components/Figures";

// ────────────────────────────────────────────────────────────────
// Entity configuration
// ────────────────────────────────────────────────────────────────

const operations = config.operations;
const columns = operations.getAll.columns;
const keyField = operations.update?.by || config.idField || "id";

const hasAdd = Boolean(operations.add);
const hasUpdate = Boolean(operations.update);
const hasDelete = Boolean(operations.delete);
const hasActionsColumn = hasUpdate || hasDelete;
const hasSearch = Boolean(operations.search);

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

// ────────────────────────────────────────────────────────────────
// Local toast
// ────────────────────────────────────────────────────────────────

function useLocalToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast]);

  return {
    toast,
    success: (message) => setToast({ type: "success", message }),
    error: (message) => setToast({ type: "error", message }),
    dismiss: () => setToast(null),
  };
}

// ────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────

export default function WasteTypesPage() {
  const {
    getAllState,
    addState,
    updateState,
    fetchAll,
    add,
    update,
  } = useWasteTypesStore();

  const toast = useLocalToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [activeItem, setActiveItem] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const items = getAllState.data || [];
  const loading = getAllState.loading;

  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true;

    const query = search.trim().toLowerCase();

    return String(item.nameAr || "")
      .toLowerCase()
      .includes(query);
  });

  function openAdd() {
    setModalMode("add");
    setActiveItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setModalMode("edit");
    setActiveItem(item);
    setModalOpen(true);
  }

  async function handleSubmit(formData) {
    if (modalMode === "add") {
      const result = await add(formData);

      if (result?.data ?? addState.data) {
        toast.success("تمت إضافة نوع المخلفات بنجاح");
        setModalOpen(false);
        fetchAll();
      } else {
        toast.error(
          addState.message || "تعذّرت إضافة نوع المخلفات"
        );
      }
    } else {
      const result = await update(
        activeItem[keyField],
        formData
      );

      if (result?.data ?? updateState.data) {
        toast.success("تم تعديل نوع المخلفات بنجاح");
        setModalOpen(false);
        fetchAll();
      } else {
        toast.error(
          updateState.message || "تعذّر تعديل البيانات"
        );
      }
    }
  }

  return (
    <div className="animate-fade-in space-y-5">

      {/* Header */}

      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          hasAdd && (
            <button
              type="button"
              onClick={openAdd}
              className="
                group
                inline-flex
                h-10
                items-center
                gap-2
                rounded-md
                bg-[var(--color-graphite-950)]
                px-4
                text-sm
                font-medium
                text-white
                shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                transition-all
                hover:-translate-y-px
                hover:bg-[var(--color-copper-700)]
                hover:shadow-[0_5px_16px_rgba(0,0,0,0.12)]
                active:translate-y-0
              "
            >
              <Plus
                className="
                  h-4
                  w-4
                  transition-transform
                  group-hover:rotate-90
                "
                strokeWidth={2}
              />

              <span>{config.addLabel}</span>
            </button>
          )
        }
      />

      {/* Toolbar */}

      <section
        className="
          overflow-hidden
          rounded-xl
          border
          border-[var(--color-stone-200)]
          bg-white
          shadow-[0_1px_2px_rgba(30,26,21,0.025)]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-[var(--color-stone-200)]
            px-4
            py-3.5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-5
          "
        >
          {/* Left side */}

          <div className="flex items-center gap-3">
            <div>
              <p
                className="
                  text-[13px]
                  font-semibold
                  text-[var(--color-ink-900)]
                "
              >
                أنواع المخلفات
              </p>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-[var(--color-ink-500)]
                "
              >
                إدارة الأنواع المسجلة في النظام
              </p>
            </div>

            <div
              className="
                hidden
                h-6
                items-center
                rounded-full
                bg-[var(--color-stone-100)]
                px-2.5
                text-[11px]
                font-medium
                text-[var(--color-ink-600)]
                sm:flex
              "
            >
              <Figures>{items.length}</Figures>

              <span className="mx-1">
                سجل
              </span>
            </div>
          </div>

          {/* Right side */}

          <div className="flex items-center gap-2">
            {hasSearch && (
              <div className="relative w-full sm:w-64">
                <Search
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-[var(--color-ink-400)]
                  "
                  strokeWidth={1.7}
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="البحث..."
                  className="
                    h-9
                    w-full
                    rounded-md
                    border
                    border-[var(--color-stone-200)]
                    bg-[var(--color-stone-50)]
                    py-2
                    pe-9
                    ps-3
                    text-xs
                    text-[var(--color-ink-900)]
                    outline-none
                    transition
                    placeholder:text-[var(--color-ink-400)]
                    focus:border-[var(--color-copper-400)]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[var(--color-copper-500)]/10
                  "
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => fetchAll()}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-md
                border
                border-[var(--color-stone-200)]
                text-[var(--color-ink-500)]
                transition
                hover:bg-[var(--color-stone-50)]
                hover:text-[var(--color-ink-900)]
              "
              aria-label="تحديث البيانات"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  loading ? "animate-spin" : ""
                }`}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table
            className="
              w-full
              min-w-[620px]
              border-collapse
              text-sm
            "
          >
            <thead>
              <tr
                className="
                  border-b
                  border-[var(--color-stone-200)]
                  bg-[var(--color-stone-50)]
                "
              >
                {columns.map((col) => (
                  <th
                    key={col.field}
                    className="
                      whitespace-nowrap
                      px-5
                      py-3
                      text-right
                      text-[10.5px]
                      font-semibold
                      tracking-wide
                      text-[var(--color-ink-500)]
                    "
                  >
                    {col.header}
                  </th>
                ))}

                {hasActionsColumn && (
                  <th
                    className="
                      whitespace-nowrap
                      px-5
                      py-3
                      text-right
                      text-[10.5px]
                      font-semibold
                      tracking-wide
                      text-[var(--color-ink-500)]
                    "
                  >
                    إجراءات
                  </th>
                )}
              </tr>
            </thead>

            <tbody>

              {/* Loading */}

              {loading &&
                Array.from({ length: 6 }).map(
                  (_, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="
                        border-b
                        border-[var(--color-stone-100)]
                      "
                    >
                      {columns.map(
                        (col, columnIndex) => (
                          <td
                            key={col.field}
                            className="px-5 py-4"
                          >
                            <div
                              className={`
                                h-3
                                animate-pulse
                                rounded
                                bg-[var(--color-stone-100)]
                                ${
                                  columnIndex === 0
                                    ? "w-10"
                                    : columnIndex === 1
                                      ? "w-32"
                                      : "w-20"
                                }
                              `}
                            />
                          </td>
                        )
                      )}

                      {hasActionsColumn && (
                        <td className="px-5 py-4">
                          <div
                            className="
                              h-7
                              w-7
                              animate-pulse
                              rounded-md
                              bg-[var(--color-stone-100)]
                            "
                          />
                        </td>
                      )}
                    </tr>
                  )
                )}

              {/* Empty */}

              {!loading &&
                filteredItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        (hasActionsColumn ? 1 : 0)
                      }
                      className="px-5 py-16"
                    >
                      <div
                        className="
                          flex
                          flex-col
                          items-center
                          justify-center
                          text-center
                        "
                      >
                        <div
                          className="
                            mb-4
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-[var(--color-stone-100)]
                            text-[var(--color-ink-400)]
                          "
                        >
                          <Search
                            className="h-5 w-5"
                            strokeWidth={1.5}
                          />
                        </div>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-[var(--color-ink-800)]
                          "
                        >
                          {search
                            ? "لا توجد نتائج مطابقة"
                            : "لا توجد بيانات بعد"}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-[var(--color-ink-500)]
                          "
                        >
                          {search
                            ? "جرّب استخدام كلمة بحث مختلفة"
                            : "ابدأ بإضافة أول نوع مخلفات إلى النظام"}
                        </p>

                        {!search && hasAdd && (
                          <button
                            type="button"
                            onClick={openAdd}
                            className="
                              mt-4
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-md
                              bg-[var(--color-stone-100)]
                              px-3
                              py-2
                              text-xs
                              font-medium
                              text-[var(--color-ink-700)]
                              transition
                              hover:bg-[var(--color-stone-150)]
                              hover:text-[var(--color-copper-700)]
                            "
                          >
                            <Plus className="h-3.5 w-3.5" />

                            إضافة أول سجل
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

              {/* Data */}

              {!loading &&
                filteredItems.map((item) => (
                  <tr
                    key={item[keyField]}
                    className="
                      group
                      border-b
                      border-[var(--color-stone-100)]
                      transition-colors
                      last:border-b-0
                      hover:bg-[var(--color-stone-50)]/70
                    "
                  >
                    {/* ID */}

                    <td className="px-5 py-4">
                      <div
                        className="
                          inline-flex
                          min-w-8
                          items-center
                          justify-center
                          rounded-md
                          bg-[var(--color-stone-100)]
                          px-2
                          py-1
                          text-[11px]
                          font-medium
                          text-[var(--color-ink-600)]
                        "
                      >
                        <Figures>
                          {item.id}
                        </Figures>
                      </div>
                    </td>

                    {/* Name */}

                    <td className="px-5 py-4">
                      <div
                        className="
                          flex
                          items-center
                          gap-2.5
                        "
                      >
                        <div
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            bg-[var(--color-copper-500)]/10
                            text-[var(--color-copper-700)]
                          "
                        >
                          <span
                            className="
                              text-xs
                              font-bold
                            "
                          >
                            {String(
                              item.nameAr || "—"
                            ).charAt(0)}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              truncate
                              text-[13px]
                              font-semibold
                              text-[var(--color-ink-900)]
                            "
                          >
                            {item.nameAr}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[10px]
                              text-[var(--color-ink-400)]
                            "
                          >
                            سجل رقم{" "}
                            <Figures>
                              {item.id}
                            </Figures>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          item.isActive
                            ? "نشط"
                            : "غير نشط"
                        }
                      />
                    </td>

                    {/* Created */}

                    <td className="px-5 py-4">
                      <span
                        dir="ltr"
                        className="
                          inline-flex
                          rounded-md
                          bg-[var(--color-stone-50)]
                          px-2
                          py-1
                          text-[11px]
                          text-[var(--color-ink-600)]
                        "
                      >
                        <Figures>
                          {formatDate(
                            item.createdAt
                          )}
                        </Figures>
                      </span>
                    </td>

                    {/* Actions */}

                    {hasActionsColumn && (
                      <td className="px-5 py-4">
                        <div
                          className="
                            flex
                            items-center
                            gap-1
                          "
                        >
                          {hasUpdate && (
                            <button
                              type="button"
                              onClick={() =>
                                openEdit(item)
                              }
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-md
                                border
                                border-transparent
                                text-[var(--color-ink-400)]
                                opacity-70
                                transition-all
                                hover:border-[var(--color-stone-200)]
                                hover:bg-white
                                hover:text-[var(--color-copper-700)]
                                hover:opacity-100
                                group-hover:opacity-100
                              "
                              aria-label="تعديل"
                              title="تعديل"
                            >
                              <Pencil
                                className="h-3.5 w-3.5"
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

        {/* Footer */}

        {!loading &&
          filteredItems.length > 0 && (
            <div
              className="
                flex
                items-center
                justify-between
                border-t
                border-[var(--color-stone-100)]
                bg-[var(--color-stone-50)]/50
                px-5
                py-2.5
                text-[10.5px]
                text-[var(--color-ink-400)]
              "
            >
              <span>
                عرض{" "}
                <span
                  className="
                    font-semibold
                    text-[var(--color-ink-700)]
                  "
                >
                  <Figures>
                    {filteredItems.length}
                  </Figures>
                </span>{" "}
                سجل
              </span>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="
                    flex
                    items-center
                    gap-1
                    text-[var(--color-copper-700)]
                    hover:underline
                  "
                >
                  مسح البحث

                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
      </section>

      {/* Modal */}

      {modalOpen && (
        <WasteTypeFormModal
          mode={modalMode}
          item={activeItem}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          submitting={
            modalMode === "add"
              ? addState.loading
              : updateState.loading
          }
        />
      )}

      {/* Toast */}

      {toast.toast && (
        <div
          className="
            fixed
            bottom-5
            left-1/2
            z-[100]
            w-[calc(100%-2rem)]
            max-w-md
            -translate-x-1/2
          "
        >
          <div
            className={`
              flex
              items-center
              gap-3
              rounded-lg
              border
              px-4
              py-3
              text-sm
              text-white
              shadow-[0_12px_35px_rgba(0,0,0,0.16)]
              ${
                toast.toast.type === "success"
                  ? "border-[var(--color-status-success)] bg-[var(--color-status-success)]"
                  : "border-[var(--color-status-danger)] bg-[var(--color-status-danger)]"
              }
            `}
          >
            <div
              className="
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-white/80
              "
            />

            <span>
              {toast.toast.message}
            </span>

            <button
              type="button"
              onClick={toast.dismiss}
              className="
                mr-auto
                opacity-70
                hover:opacity-100
              "
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Form Modal
// ────────────────────────────────────────────────────────────────

function WasteTypeFormModal({
  mode,
  item,
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
            ? Boolean(item?.[f.name])
            : true;
      } else {
        initial[f.name] =
          mode === "edit"
            ? item?.[f.name] ?? ""
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
    <div
      className="
        fixed
        inset-0
        z-[90]
        flex
        items-center
        justify-center
        bg-black/40
        p-4
        backdrop-blur-[2px]
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-xl
          border
          border-[var(--color-stone-200)]
          bg-white
          shadow-[0_24px_80px_rgba(30,26,21,0.18)]
        "
      >
        {/* Modal header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--color-stone-200)]
            px-5
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-[var(--color-copper-500)]/10
                text-[var(--color-copper-700)]
              "
            >
              {mode === "add" ? (
                <Plus className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </div>

            <div>
              <h2
                className="
                  text-sm
                  font-bold
                  text-[var(--color-ink-900)]
                "
              >
                {mode === "add"
                  ? config.addLabel
                  : "تعديل نوع المخلفات"}
              </h2>

              <p
                className="
                  mt-0.5
                  text-[10.5px]
                  text-[var(--color-ink-400)]
                "
              >
                {mode === "add"
                  ? "أدخل البيانات المطلوبة لإنشاء سجل جديد"
                  : "قم بتعديل البيانات المطلوبة"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              text-[var(--color-ink-400)]
              transition
              hover:bg-[var(--color-stone-100)]
              hover:text-[var(--color-ink-900)]
            "
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-5 py-5"
        >
          {fields.map((f) => (
            <div key={f.name}>
              {f.type === "checkbox" ? (
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-[var(--color-stone-200)]
                    bg-[var(--color-stone-50)]
                    px-3.5
                    py-3
                    transition
                    hover:bg-white
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        font-medium
                        text-[var(--color-ink-800)]
                      "
                    >
                      {f.label}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        text-[var(--color-ink-400)]
                      "
                    >
                      تحديد ما إذا كان السجل فعالًا
                    </p>
                  </div>

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
                    className="
                      h-4
                      w-4
                      cursor-pointer
                      accent-[var(--color-copper-600)]
                    "
                  />
                </label>
              ) : (
                <div className="space-y-1.5">
                  <label
                    htmlFor={`field-${f.name}`}
                    className="
                      block
                      text-xs
                      font-medium
                      text-[var(--color-ink-700)]
                    "
                  >
                    {f.label}
                  </label>

                  <input
                    id={`field-${f.name}`}
                    type="text"
                    value={values[f.name]}
                    onChange={(e) =>
                      setValue(
                        f.name,
                        e.target.value
                      )
                    }
                    autoFocus={mode === "add"}
                    className={`
                      h-10
                      w-full
                      rounded-md
                      border
                      bg-white
                      px-3
                      text-sm
                      text-[var(--color-ink-900)]
                      outline-none
                      transition
                      placeholder:text-[var(--color-ink-400)]
                      focus:ring-2
                      ${
                        errors[f.name]
                          ? "border-[var(--color-status-danger)] focus:ring-[var(--color-status-danger)]/10"
                          : "border-[var(--color-stone-200)] focus:border-[var(--color-copper-400)] focus:ring-[var(--color-copper-500)]/10"
                      }
                    `}
                  />

                  {errors[f.name] && (
                    <p
                      className="
                        text-[10.5px]
                        text-[var(--color-status-danger)]
                      "
                    >
                      {errors[f.name]}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Actions */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-2
              border-t
              border-[var(--color-stone-100)]
              pt-4
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="
                rounded-md
                px-4
                py-2
                text-xs
                font-medium
                text-[var(--color-ink-600)]
                transition
                hover:bg-[var(--color-stone-100)]
                disabled:opacity-50
              "
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="
                inline-flex
                min-w-24
                items-center
                justify-center
                gap-2
                rounded-md
                bg-[var(--color-graphite-950)]
                px-4
                py-2
                text-xs
                font-medium
                text-white
                transition
                hover:bg-[var(--color-copper-700)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {submitting && (
                <RefreshCw
                  className="
                    h-3.5
                    w-3.5
                    animate-spin
                  "
                />
              )}

              {submitting
                ? "جارٍ الحفظ..."
                : "حفظ التغييرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}