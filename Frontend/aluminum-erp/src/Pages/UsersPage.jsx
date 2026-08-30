import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Inbox,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

import { usersEntity } from "../entities/UsersEntity";
import useUsersStore from "../stores/UsersStore";
import { createEntityStore } from "../stores/createEntityStore";
import { getCurrentUser } from "../api/httpClient";

import { rolesEntity } from "../entities/RolesEntity";
import { permissionsEntity } from "../entities/PermissionsEntity";

const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

const config = usersEntity;
const operations = config.operations || {};

const columns =
  operations.getAll?.columns ||
  operations.search?.columns ||
  [];

const hasSearch = Boolean(operations.search);
const hasAdd = Boolean(operations.add);

const title = config.title || config.entity;
const description = config.description || "";
const addLabel = config.addLabel || `إضافة ${title}`;

const searchFilters = operations.search?.filters || [];

// حقول عملية تحديث كلمة السر (نفس تعريفها بالـ Entity)
const updateFields = operations.update?.fields || [];


/*
|--------------------------------------------------------------------------
| Entities المستخدمة في الحقول المرتبطة
|--------------------------------------------------------------------------
*/

const sourceEntities = {
  Roles: rolesEntity,
  Permissions: permissionsEntity,
};


/*
|--------------------------------------------------------------------------
| Toast
|--------------------------------------------------------------------------
*/

function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = ({ type, title, description }) => {
    setToast({
      type,
      title,
      description,
    });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return {
    toast,
    showToast,
    closeToast: () => setToast(null),
  };
}


/*
|--------------------------------------------------------------------------
| تنسيق الحقول الصغيرة
|--------------------------------------------------------------------------
*/

function isNarrowColumn(field) {
  const f = field.toLowerCase();

  if (f === "id") {
    return "w-20 text-center";
  }

  if (f === "isactive") {
    return "w-28";
  }

  return "w-auto";
}


/*
|--------------------------------------------------------------------------
| Avatar
|--------------------------------------------------------------------------
*/

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
];

function avatarColor(name) {
  const str = name || "";

  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash =
      str.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  return AVATAR_COLORS[
    Math.abs(hash) % AVATAR_COLORS.length
  ];
}


/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

function StatusPill({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      نشط
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      غير نشط
    </span>
  );
}


/*
|--------------------------------------------------------------------------
| تحويل نوع الحقل إلى HTML input type
|--------------------------------------------------------------------------
*/

function nativeInputType(type) {
  if (type === "number" || type === "int") {
    return "number";
  }

  if (type === "email") {
    return "email";
  }

  if (type === "date") {
    return "date";
  }

  if (type === "password") {
    return "password";
  }

  return "text";
}


/*
|--------------------------------------------------------------------------
| تحميل خيارات select من Entity آخر
|--------------------------------------------------------------------------
*/

function useSourceOptions(source) {
  const [options, setOptions] = useState([]);

  const store = useMemo(() => {
    const entityConfig = source
      ? sourceEntities[source.entity]
      : null;

    return entityConfig
      ? createEntityStore(entityConfig)
      : null;
  }, [source]);

  useEffect(() => {
    if (!store || !source) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      const operation =
        source.operation || "getAll";

      const state = store.getState();

      if (
        operation === "search" &&
        state.search
      ) {
        await state.search({});
      } else if (state.fetchAll) {
        await state.fetchAll();
      }

      if (cancelled) {
        return;
      }

      const fresh = store.getState();

      const rows =
        operation === "search"
          ? fresh.searchState?.data
          : fresh.getAllState?.data;

      const result = (rows || []).map((row) => ({
        value: row[source.valueField],
        label: row[source.displayField],
      }));

      setOptions(result);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    store,
    source?.valueField,
    source?.displayField,
    source?.operation,
  ]);

  return options;
}


/*
|--------------------------------------------------------------------------
| خيارات الصلاحيات المجمعة حسب moduleName
|--------------------------------------------------------------------------
*/

function useGroupedSourceOptions(source) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const store = useMemo(() => {
    const entityConfig = source
      ? sourceEntities[source.entity]
      : null;

    return entityConfig
      ? createEntityStore(entityConfig)
      : null;
  }, [source]);

  useEffect(() => {
    if (!store || !source) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const operation =
        source.operation || "getAll";

      const state = store.getState();

      if (
        operation === "search" &&
        state.search
      ) {
        await state.search({});
      } else if (state.fetchAll) {
        await state.fetchAll();
      }

      if (cancelled) {
        return;
      }

      const fresh = store.getState();

      const rows =
        operation === "search"
          ? fresh.searchState?.data
          : fresh.getAllState?.data;

      const groupField = source.groupBy;

      const grouped = new Map();

      (rows || []).forEach((row) => {
        const groupName =
          groupField
            ? row[groupField] ?? "أخرى"
            : "الكل";

        const option = {
          value: row[source.valueField],
          label: row[source.displayField],
        };

        if (!grouped.has(groupName)) {
          grouped.set(groupName, []);
        }

        grouped
          .get(groupName)
          .push(option);
      });

      const nextGroups = Array.from(
        grouped.entries(),
      )
        .map(([name, options]) => ({
          name,
          options,
        }))
        .sort((a, b) =>
          String(a.name).localeCompare(
            String(b.name),
          ),
        );

      setGroups(nextGroups);
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    store,
    source?.valueField,
    source?.displayField,
    source?.groupBy,
    source?.operation,
  ]);

  return {
    groups,
    loading,
  };
}


/*
|--------------------------------------------------------------------------
| Multi Select للصلاحيات
|--------------------------------------------------------------------------
*/

function GroupedMultiSelect({
  groups,
  loading,
  selected,
  onChange,
  placeholder,
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({});

  const selectedSet = new Set(
    (selected || []).map(String),
  );

  const q = query
    .trim()
    .toLowerCase();

  const filteredGroups = groups
    .map((group) => {
      if (!q) {
        return group;
      }

      const groupMatches =
        String(group.name)
          .toLowerCase()
          .includes(q);

      const options = groupMatches
        ? group.options
        : group.options.filter((option) =>
            String(option.label)
              .toLowerCase()
              .includes(q),
          );

      return {
        ...group,
        options,
      };
    })
    .filter(
      (group) =>
        group.options.length > 0,
    );

  const toggleGroup = (name) => {
    setExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const toggleOption = (value) => {
    const key = String(value);

    const next = selectedSet.has(key)
      ? (selected || []).filter(
          (value) =>
            String(value) !== key,
        )
      : [
          ...(selected || []),
          value,
        ];

    onChange(next);
  };

  const toggleGroupAll = (group) => {
    const groupValues =
      group.options.map(
        (option) => option.value,
      );

    const allSelected =
      groupValues.length > 0 &&
      groupValues.every((value) =>
        selectedSet.has(String(value)),
      );

    if (allSelected) {
      onChange(
        (selected || []).filter(
          (value) =>
            !groupValues.some(
              (groupValue) =>
                String(groupValue) ===
                String(value),
            ),
        ),
      );

      return;
    }

    const merged = new Set([
      ...(selected || []).map(String),
      ...groupValues.map(String),
    ]);

    const allOptions =
      groups.flatMap(
        (groupItem) =>
          groupItem.options,
      );

    onChange(
      allOptions
        .filter((option) =>
          merged.has(
            String(option.value),
          ),
        )
        .map(
          (option) => option.value,
        ),
    );
  };

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">

      {/* البحث */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-3 py-2">

        <input
          type="text"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder={
            placeholder ||
            "البحث في الوحدات أو الصلاحيات..."
          }
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />

        <span className="whitespace-nowrap rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          {(selected || []).length} محددة
        </span>

      </div>

      {/* القائمة */}
      <div className="max-h-56 overflow-y-auto">

        {loading && (
          <div className="px-3 py-4 text-center text-xs text-slate-400">
            جاري تحميل الصلاحيات...
          </div>
        )}

        {!loading &&
          filteredGroups.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-slate-400">
              لم يتم العثور على صلاحيات.
            </div>
          )}

        {!loading &&
          filteredGroups.map((group) => {
            const groupValues =
              group.options.map(
                (option) =>
                  option.value,
              );

            const selectedInGroup =
              groupValues.filter(
                (value) =>
                  selectedSet.has(
                    String(value),
                  ),
              ).length;

            const allSelected =
              selectedInGroup ===
                groupValues.length &&
              groupValues.length > 0;

            const isOpen =
              expanded[group.name] ??
              Boolean(q);

            return (
              <div
                key={group.name}
                className="border-b border-slate-50 last:border-0"
              >

                <button
                  type="button"
                  onClick={() =>
                    toggleGroup(
                      group.name,
                    )
                  }
                  className="flex w-full items-center justify-between px-3 py-2 text-right hover:bg-slate-50"
                >

                  <span className="flex items-center gap-2">

                    <input
                      type="checkbox"
                      checked={allSelected}
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      onChange={() =>
                        toggleGroupAll(
                          group,
                        )
                      }
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                    />

                    <span className="text-sm font-medium text-slate-800">
                      {group.name}
                    </span>

                    <span className="text-xs text-slate-400">
                      {selectedInGroup}/
                      {groupValues.length}
                    </span>

                  </span>

                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {isOpen && (
                  <div className="space-y-0.5 px-3 pb-2 pr-9">

                    {group.options.map(
                      (option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 rounded px-1.5 py-1 text-sm text-slate-600 hover:bg-slate-50"
                        >

                          <input
                            type="checkbox"
                            checked={selectedSet.has(
                              String(
                                option.value,
                              ),
                            )}
                            onChange={() =>
                              toggleOption(
                                option.value,
                              )
                            }
                            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                          />

                          {option.label}

                        </label>
                      ),
                    )}

                  </div>
                )}

              </div>
            );
          })}

      </div>
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validateFields(
  fields,
  values,
  sourceOptionsByField,
) {
  const errors = {};

  for (const field of fields) {

    if (field.multiple) {
      continue;
    }

    const value =
      values[field.name];

    const isEmpty =
      value === undefined ||
      value === null ||
      String(value).trim() === "";

    if (
      field.required &&
      isEmpty
    ) {
      errors[field.name] =
        `حقل ${field.label} مطلوب.`;

      continue;
    }

    if (isEmpty) {
      continue;
    }

    if (
      field.type === "select" &&
      field.source
    ) {
      const options =
        sourceOptionsByField?.[
          field.name
        ] || [];

      const valid =
        options.some(
          (option) =>
            String(option.value) ===
            String(value),
        );

      if (!valid) {
        errors[field.name] =
          `القيمة المحددة في ${field.label} غير صحيحة.`;
      }
    }
  }

  return errors;
}


/*
|--------------------------------------------------------------------------
| Modal إضافة مستخدم
|--------------------------------------------------------------------------
*/

function EntityFormModal({
  fields,
  initialValues,
  sourceOptionsByField,
  groupedSourceOptionsByField,
  onClose,
  onSubmit,
  loading,
}) {
  const [values, setValues] =
    useState(() => {
      const init = {
        ...(initialValues || {}),
      };

      fields.forEach((field) => {

        if (
          field.multiple &&
          init[field.name] ===
            undefined
        ) {
          init[field.name] = [];
        }

        if (
          field.type === "password"
        ) {
          init[field.name] = "";
        }
      });

      return init;
    });

  const [errors, setErrors] =
    useState({});

  const handleChange = (
    name,
    value,
  ) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors =
      validateFields(
        fields,
        values,
        sourceOptionsByField,
      );

    if (
      Object.keys(
        validationErrors,
      ).length > 0
    ) {
      setErrors(
        validationErrors,
      );
      return;
    }

    onSubmit(values);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 px-4"
      dir="rtl"
    >

      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-xl">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-base font-semibold text-slate-900">
            {addLabel}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >

          {fields.map((field) => {

            const isGrouped =
              field.multiple &&
              field.source?.groupBy;

            const options =
              field.source
                ? sourceOptionsByField?.[
                    field.name
                  ] || []
                : field.options || [];

            return (
              <div
                key={field.name}
              >

                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">

                  {isGrouped && (
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                  )}

                  {field.label}

                  {field.required && (
                    <span className="text-red-500">
                      *
                    </span>
                  )}

                </label>

                {isGrouped ? (
                  <GroupedMultiSelect
                    groups={
                      groupedSourceOptionsByField?.[
                        field.name
                      ]?.groups || []
                    }
                    loading={
                      groupedSourceOptionsByField?.[
                        field.name
                      ]?.loading
                    }
                    selected={
                      values[
                        field.name
                      ] || []
                    }
                    onChange={(next) =>
                      handleChange(
                        field.name,
                        next,
                      )
                    }
                  />
                ) : field.type ===
                  "select" ? (

                  <select
                    className={
                      inputClass
                    }
                    value={
                      values[
                        field.name
                      ] ?? ""
                    }
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        e.target.value,
                      )
                    }
                  >

                    <option value="">
                      اختر...
                    </option>

                    {options.map(
                      (
                        option,
                        index,
                      ) => (
                        <option
                          key={
                            option.value ??
                            index
                          }
                          value={
                            option.value ??
                            ""
                          }
                        >
                          {option.label ??
                            option.value ??
                            ""}
                        </option>
                      ),
                    )}

                  </select>

                ) : (

                  <input
                    className={
                      inputClass
                    }
                    type={nativeInputType(
                      field.type,
                    )}
                    placeholder={
                      field.placeholder
                    }
                    value={
                      values[
                        field.name
                      ] ?? ""
                    }
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        e.target.value,
                      )
                    }
                    autoComplete={
                      field.type ===
                      "password"
                        ? "new-password"
                        : "off"
                    }
                  />

                )}

                {errors[
                  field.name
                ] && (
                  <p className="mt-1 text-xs text-red-600">
                    {
                      errors[
                        field.name
                      ]
                    }
                  </p>
                )}

              </div>
            );
          })}

          {/* Buttons */}
          <div className="mt-5 flex justify-start gap-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "جاري الحفظ..."
                : "حفظ المستخدم"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Modal تحديث كلمة السر (email + oldPassword + newPassword فقط)
|--------------------------------------------------------------------------
*/

function UpdatePasswordModal({
  onClose,
  onSubmit,
  loading,
}) {
  const currentUser = getCurrentUser();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!oldPassword.trim()) {
      nextErrors.oldPassword = "كلمة السر الحالية مطلوبة.";
    }

    if (!newPassword.trim()) {
      nextErrors.newPassword = "كلمة السر الجديدة مطلوبة.";
    } else if (newPassword === oldPassword) {
      nextErrors.newPassword =
        "كلمة السر الجديدة يجب أن تختلف عن الحالية.";
    }

    if (!currentUser?.email) {
      nextErrors.email =
        "تعذر تحديد بريد المستخدم الحالي، يرجى تسجيل الدخول من جديد.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // نفس مبدأ عملية update بالـ Entity: نرسل فقط الحقول المطلوبة
    onSubmit({
      email: currentUser.email,
      oldPassword,
      newPassword,
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <KeyRound className="h-4 w-4" />
            </span>

            <h2 className="text-base font-semibold text-slate-900">
              تحديث كلمة السر
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* البريد (للعرض فقط، يُرسل تلقائيًا) */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              البريد الإلكتروني
            </label>

            <input
              className={`${inputClass} bg-slate-50 text-slate-500`}
              type="email"
              value={currentUser?.email || ""}
              readOnly
              disabled
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* كلمة السر الحالية */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              كلمة السر الحالية
            </label>

            <div className="relative">
              <input
                className={inputClass}
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    oldPassword: undefined,
                  }));
                }}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowOld((v) => !v)}
                tabIndex={-1}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showOld ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {errors.oldPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* كلمة السر الجديدة */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              كلمة السر الجديدة
            </label>

            <div className="relative">
              <input
                className={inputClass}
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    newPassword: undefined,
                  }));
                }}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                tabIndex={-1}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-5 flex justify-start gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading && (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              )}

              {loading ? "جاري التحديث..." : "Update"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Users Page
|--------------------------------------------------------------------------
*/

export default function UsersPage() {

  const {
    getAllState,
    fetchAll,
    searchState,
    search,
    addState,
    add,
    updateState,
    update,
  } = useUsersStore();

  const [filters, setFilters] =
    useState(() =>
      Object.fromEntries(
        searchFilters.map(
          (filter) => [
            filter.name,
            "",
          ],
        ),
      ),
    );

  const [addOpen, setAddOpen] =
    useState(false);

  const [updatePasswordOpen, setUpdatePasswordOpen] =
    useState(false);

  const {
    toast,
    showToast,
    closeToast,
  } = useToast();


  /*
  |--------------------------------------------------------------------------
  | Sources
  |--------------------------------------------------------------------------
  */

  const roleSource =
    operations.add?.fields.find(
      (field) =>
        field.name ===
        "roleID",
    )?.source;

  const permissionsSource =
    operations.add?.fields.find(
      (field) =>
        field.name ===
        "permissions",
    )?.source;


  const roleOptions =
    useSourceOptions(
      roleSource,
    );

  const permissionsGrouped =
    useGroupedSourceOptions(
      permissionsSource,
    );


  const formSourceOptions = {
    roleID: roleOptions,
  };

  const groupedFormSourceOptions = {
    permissions:
      permissionsGrouped,
  };


  /*
  |--------------------------------------------------------------------------
  | تحميل البيانات
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchAll?.();
  }, [fetchAll]);


  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const hasActiveFilter =
    Object.values(filters).some(
      (value) =>
        value !== "" &&
        value !== undefined &&
        value !== null,
    );


  const rows = hasActiveFilter
    ? searchState?.data || []
    : getAllState?.data || [];


  const loading = hasActiveFilter
    ? searchState?.loading
    : getAllState?.loading;


  const runSearchOrFetchAll = (
    nextFilters,
  ) => {

    const active =
      Object.values(
        nextFilters,
      ).some(
        (value) =>
          value !== "" &&
          value !== undefined &&
          value !== null,
      );

    if (
      active &&
      search
    ) {
      search(nextFilters);
    } else {
      fetchAll?.();
    }
  };


  const handleFilterChange = (
    name,
    value,
  ) => {

    const nextFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(nextFilters);

    runSearchOrFetchAll(
      nextFilters,
    );
  };


  const refresh = () => {

    if (
      hasActiveFilter &&
      search
    ) {
      search(filters);
    } else {
      fetchAll?.();
    }
  };


  /*
  |--------------------------------------------------------------------------
  | إضافة مستخدم
  |--------------------------------------------------------------------------
  */

  const toPermissionsPayload = (
    ids,
  ) => {
    return (ids || []).map(
      (id) => ({
        permissionID: id,
      }),
    );
  };


  const handleAdd = async (
    values,
  ) => {

    const payload = {
      ...values,

      permissions:
        toPermissionsPayload(
          values.permissions,
        ),
    };


    try {

      await add(payload);

      const result =
        useUsersStore
          .getState()
          .addState;


      if (
        result?.errorCode === 0
      ) {

        showToast({
          type: "success",
          title: "تم بنجاح",
          description:
            result.message ||
            "تم إنشاء المستخدم بنجاح.",
        });

        setAddOpen(false);

        refresh();

      } else {

        showToast({
          type: "error",
          title: "خطأ",
          description:
            result?.message ||
            "حدث خطأ أثناء إنشاء المستخدم.",
        });
      }

    } catch (error) {

      showToast({
        type: "error",
        title: "خطأ",
        description:
          error?.message ||
          "حدث خطأ غير متوقع.",
      });

    }
  };


  /*
  |--------------------------------------------------------------------------
  | تحديث كلمة السر (email + oldPassword + newPassword)
  |--------------------------------------------------------------------------
  */

  const handleUpdatePassword = async (payload) => {

    try {

      await update(null, payload);

      const result =
        useUsersStore
          .getState()
          .updateState;

      if (result?.errorCode === 0) {

        showToast({
          type: "success",
          title: "تم بنجاح",
          description:
            result.message ||
            "تم تحديث كلمة السر بنجاح.",
        });

        setUpdatePasswordOpen(false);

      } else {

        showToast({
          type: "error",
          title: "خطأ",
          description:
            result?.message ||
            "تعذّر تحديث كلمة السر.",
        });
      }

    } catch (error) {

      showToast({
        type: "error",
        title: "خطأ",
        description:
          error?.message ||
          "حدث خطأ غير متوقع.",
      });

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="space-y-5"
      dir="rtl"
    >

      {/* =========================================================
          Header
      ========================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <h1 className="text-xl font-semibold text-slate-900">
              {title}
            </h1>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {rows.length}
            </span>

          </div>

          {description && (
            <p className="mt-0.5 text-sm text-slate-500">
              {description}
            </p>
          )}

        </div>


        <div className="flex items-center gap-2">

          {/* زر تحديث كلمة السر */}
          {updateFields.length > 0 && (
            <button
              type="button"
              onClick={() =>
                setUpdatePasswordOpen(true)
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <KeyRound className="h-4 w-4" />
              Update
            </button>
          )}

          {hasAdd && (
            <button
              type="button"
              onClick={() =>
                setAddOpen(true)
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />

              {addLabel}
            </button>
          )}

        </div>

      </div>


      {/* =========================================================
          Search Filters
      ========================================================= */}

      {hasSearch && (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">

          {searchFilters.map(
            (filter) => (
              <div
                key={filter.name}
                className="w-full sm:w-48"
              >

                <label className="mb-1 block text-xs font-medium text-slate-500">
                  {filter.label}
                </label>


                {filter.options ? (

                  <select
                    className={
                      inputClass
                    }
                    value={
                      filters[
                        filter.name
                      ]
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        filter.name,
                        e.target.value,
                      )
                    }
                  >

                    <option value="">
                      الكل
                    </option>

                    {filter.options.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {
                            option.label
                          }
                        </option>
                      ),
                    )}

                  </select>

                ) : (

                  <input
                    className={
                      inputClass
                    }
                    type={
                      filter.type ===
                      "int"
                        ? "number"
                        : "text"
                    }
                    value={
                      filters[
                        filter.name
                      ]
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        filter.name,
                        e.target.value,
                      )
                    }
                    placeholder={
                      filter.label
                    }
                  />

                )}

              </div>
            ),
          )}

        </div>
      )}


      {/* =========================================================
          Table
      ========================================================= */}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs text-slate-500">

                {columns.map(
                  (column) => (
                    <th
                      key={
                        column.field
                      }
                      className={`px-4 py-2.5 font-medium ${
                        isNarrowColumn(
                          column.field,
                        )
                      }`}
                    >
                      {
                        column.header
                      }
                    </th>
                  ),
                )}

              </tr>

            </thead>


            <tbody>

              {/* Loading */}

              {loading &&
                Array.from({
                  length: 5,
                }).map(
                  (_, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-50 last:border-0"
                    >

                      {columns.map(
                        (column) => (
                          <td
                            key={
                              column.field
                            }
                            className="px-4 py-3"
                          >

                            <div
                              className={`h-4 w-3/4 animate-pulse rounded bg-slate-100 ${
                                isNarrowColumn(
                                  column.field,
                                ).includes(
                                  "text-center",
                                )
                                  ? "mx-auto"
                                  : ""
                              }`}
                            />

                          </td>
                        ),
                      )}

                    </tr>
                  ),
                )}


              {/* Empty */}

              {!loading &&
                rows.length ===
                  0 && (
                  <tr>

                    <td
                      colSpan={
                        columns.length
                      }
                      className="px-4 py-12"
                    >

                      <div className="flex flex-col items-center justify-center gap-2 text-center">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Inbox className="h-5 w-5" />
                        </div>

                        <p className="text-sm font-medium text-slate-700">

                          {hasActiveFilter
                            ? "لا توجد نتائج"
                            : "لا يوجد مستخدمون بعد"}

                        </p>

                        <p className="text-xs text-slate-500">

                          {hasActiveFilter
                            ? "جرّب تعديل معايير البحث."
                            : "لا توجد بيانات متاحة حالياً."}

                        </p>

                      </div>

                    </td>

                  </tr>
                )}


              {/* Rows */}

              {!loading &&
                rows.map(
                  (row, index) => (
                    <tr
                      key={
                        row.id ??
                        row.userName ??
                        index
                      }
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                    >

                      {columns.map(
                        (column) => {

                          const field =
                            column.field;

                          return (
                            <td
                              key={
                                field
                              }
                              className={`px-4 py-3 ${
                                isNarrowColumn(
                                  field,
                                )
                              }`}
                            >

                              {/* Username */}

                              {field ===
                              "userName" ? (

                                <div className="flex items-center gap-2">

                                  <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(
                                      row.userName,
                                    )}`}
                                  >
                                    {(
                                      row.userName ||
                                      "?"
                                    )
                                      .charAt(
                                        0,
                                      )
                                      .toUpperCase()}
                                  </span>

                                  <span className="font-medium text-slate-800">
                                    {
                                      row.userName
                                    }
                                  </span>

                                </div>

                              ) : field ===
                                "isActive" ? (

                                <StatusPill
                                  active={Boolean(
                                    row.isActive,
                                  )}
                                />

                              ) : field ===
                                "createdAt" ? (

                                <span className="text-slate-600">
                                  {row.createdAt
                                    ? new Date(
                                        row.createdAt,
                                      ).toLocaleDateString(
                                        "ar-SA",
                                      )
                                    : "-"}
                                </span>

                              ) : (

                                <span className="text-slate-600">
                                  {row[
                                    field
                                  ] ??
                                    "-"}
                                </span>

                              )}

                            </td>
                          );
                        },
                      )}

                    </tr>
                  ),
                )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =========================================================
          Add Modal
      ========================================================= */}

      {addOpen && (
        <EntityFormModal
          fields={
            operations.add
              .fields
          }
          initialValues={{}}
          sourceOptionsByField={
            formSourceOptions
          }
          groupedSourceOptionsByField={
            groupedFormSourceOptions
          }
          onClose={() =>
            setAddOpen(false)
          }
          onSubmit={handleAdd}
          loading={
            addState?.loading
          }
        />
      )}


      {/* =========================================================
          Update Password Modal
      ========================================================= */}

      {updatePasswordOpen && (
        <UpdatePasswordModal
          onClose={() =>
            setUpdatePasswordOpen(false)
          }
          onSubmit={handleUpdatePassword}
          loading={updateState?.loading}
        />
      )}


      {/* =========================================================
          Toast
      ========================================================= */}

      {toast && (
        <div
          className="fixed bottom-5 left-5 z-50 w-80 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-lg"
          dir="rtl"
        >

          <div className="flex items-start gap-2">

            {toast.type ===
            "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
            )}

            <div className="flex-1">

              <p className="text-sm font-medium text-slate-900">
                {toast.title}
              </p>

              <p className="text-xs text-slate-500">
                {
                  toast.description
                }
              </p>

            </div>

            <button
              type="button"
              onClick={
                closeToast
              }
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}