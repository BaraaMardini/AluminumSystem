import { useEffect, useMemo } from "react";
import { createEntityStore } from "../stores/createEntityStore";
import { ENTITY_REGISTRY } from "../entities/registry";
// كاش على مستوى التطبيق: كل Entity بياخد Zustand store واحد بس، بيتشارك بين كل الصفحات
const storeCache = {};
function getStoreForEntity(entityName) {
  const entityConfig = ENTITY_REGISTRY[entityName];
  if (!entityConfig) {
    // ما منرمي Error هون قصدًا - عشان فلتر واحد ناقص Entity ما يكسر الصفحة كاملها
    console.warn(
      `useSourceOptions: الـ Entity "${entityName}" مش مسجّلة بـ src/entities/registry.js — رح ترجع خيارات فاضية مؤقتًا`
    );
    return null;
  }
  if (!storeCache[entityName]) {
    storeCache[entityName] = createEntityStore(entityConfig);
  }
  return storeCache[entityName];
}
// -------------------- Dropdown عادي --------------------
export function useSourceOptions(source, filters) {
  const useStore = useMemo(() => getStoreForEntity(source.entity), [source.entity]);
  // لو الـ Entity مش مسجّلة، منرجع خيارات فاضية بهدوء بدل ما نكسر الصفحة
  if (!useStore) {
    return { options: [], loading: false };
  }
  return useSourceOptionsInner(useStore, source, filters);
}
function useSourceOptionsInner(useStore, source, filters) {
  const state = useStore();
  const hasFilters = filters && Object.keys(filters).length > 0;
  const filtersKey = hasFilters ? JSON.stringify(filters) : "";
  useEffect(() => {
    if (hasFilters) {
      state.search?.(filters);
    } else {
      state.fetchAll?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.entity, filtersKey]);
  const rawData = hasFilters ? state.searchState.data : state.getAllState.data;
  const data = Array.isArray(rawData) ? rawData : [];
  const loading = hasFilters ? state.searchState.loading : state.getAllState.loading;
  const options = data.map((item) => ({
    value: item[source.valueField],
    label: item[source.displayField],
    raw: item,
  }));
  return { options, loading };
}
// -------------------- Grouped multi-select (متل الصلاحيات) --------------------
export function useGroupedSourceOptions(source) {
  const { options, loading } = useSourceOptions(source);
  const groups = options.reduce((acc, opt) => {
    const groupKey = opt.raw?.[source.groupBy] ?? "عام";
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(opt);
    return acc;
  }, {});
  return { groups, loading };
} 