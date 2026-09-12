import {
  LayoutGrid,
  Package,
  ClipboardList,
  Scissors,
  PaintBucket,
  PackageCheck,
  FileBarChart,
  Users,
  ShieldCheck,
  CircleDot,
  Trash2,
  List,
  FileWarning,
  BarChart3,
  Boxes,
  Gauge,
  XCircle,
  KeyRound,
} from "lucide-react";


/**
 * ================================================================
 * مصدر واحد لبنية التنقّل
 * ================================================================
 *
 * ترتيب الأقسام:
 *
 * 1. نظرة عامة
 * 2. التقارير والتحليلات
 * 3. البيانات الأساسية
 * 4. الإنتاج والطلبيات
 * 5. الهدر والمخلفات
 * 6. الإدارة
 *
 */


export const NAV_GROUPS = [

  // =============================================================
  // 1. نظرة عامة
  // =============================================================

  {
    id: "overview",
    label: "نظرة عامة",

    items: [
      {
        path: "/",
        label: "لوحة الإنتاج",
        description:
          "متابعة أداء الإنتاج والطلبيات",
        icon: LayoutGrid,
      },
    ],
  },


  // =============================================================
  // 2. التقارير والتحليلات
  // =============================================================

  {
    id: "analytics",
    label: "التقارير والتحليلات",

    items: [

      {
        path: "/reports/production-summary",
        label: "ملخّص الإنتاج",
        description:
          "نظرة إجمالية على أداء الإنتاج خلال فترة محدّدة",
        icon: Gauge,
      },

      {
        path: "/reports/orders",
        label: "تقرير الطلبيات",
        description:
          "تتبّع كل طلبية عبر مراحل الإنتاج",
        icon: FileBarChart,
      },

      {
        path: "/reports/cancelled-orders",
        label: "الطلبيات الملغاة",
        description:
          "تحليل الطلبيات الملغاة وكميات الإنتاج والهدر المرتبطة بها",
        icon: XCircle,
      },

      {
        path: "/reports/product-production",
        label: "تقرير إنتاج المنتجات",
        description:
          "تتبّع إنتاج كل منتج عبر مراحل الإنتاج",
        icon: Boxes,
      },

      {
        path: "/reports/product-comparison",
        label: "مقارنة المنتجات",
        description:
          "مقارنة إجمالي الإنتاج والهدر بين المنتجات",
        icon: BarChart3,
      },

    ],
  },


  // =============================================================
  // 3. البيانات الأساسية
  // =============================================================

  {
    id: "core-data",
    label: "البيانات الأساسية",

    items: [

      {
        path: "/products",
        label: "المنتجات",
        description:
          "إدارة كتالوج المنتجات",
        icon: Package,
      },

    ],
  },


  // =============================================================
  // 4. الإنتاج والطلبيات
  // =============================================================

  {
    id: "production",
    label: "الإنتاج والطلبيات",

    items: [

      {
        path: "/orders",
        label: "إدارة الطلبيات",
        description:
          "إنشاء ومتابعة طلبيات الإنتاج",
        icon: ClipboardList,
      },

      {
        path: "/order-stages",
        label: "مراحل الطلبيات",
        description:
          "متابعة تقدم كل طلبية عبر مراحل الإنتاج",
        icon: List,
      },

      {
        path: "/cutting",
        label: "إدارة القص",
        description:
          "مرحلة القص والتجهيز",
        icon: Scissors,
      },

      {
        path: "/painting",
        label: "إدارة التلوين",
        description:
          "مرحلة الطلاء والتلوين",
        icon: PaintBucket,
      },

      {
        path: "/packaging",
        label: "التعبئة والتغليف",
        description:
          "مرحلة التعبئة النهائية",
        icon: PackageCheck,
      },

      {
        path: "/ProductionStages",
        label: "مراحل الإنتاج",
        description:
          "إدارة مراحل الإنتاج",
        icon: List,
      },

    ],
  },


  // =============================================================
  // 5. الهدر والمخلفات
  // =============================================================

  {
    id: "waste-management",
    label: "الهدر والمخلفات",

    items: [

      {
        path: "/production-stage-wastes",
        label: "هدر الإنتاج",
        description:
          "تسجيل ومتابعة الهدر في مراحل الإنتاج",
        icon: Trash2,
      },

      {
        path: "/waste-types",
        label: "أنواع الهدر",
        description:
          "إدارة أنواع الهدر والمخلفات",
        icon: List,
      },

      {
        path: "/waste-reasons",
        label: "أسباب الهدر",
        description:
          "إدارة أسباب الهدر والمخلفات",
        icon: FileWarning,
      },

    ],
  },


  // =============================================================
  // 6. الإدارة
  // =============================================================

  {
    id: "administration",
    label: "الإدارة",

    items: [

      {
        path: "/users",
        label: "المستخدمون",
        description:
          "إدارة حسابات المستخدمين",
        icon: Users,
      },

      {
        path: "/roles",
        label: "الأدوار والصلاحيات",
        description:
          "ضبط صلاحيات الوصول",
        icon: ShieldCheck,
      },

      {
        path: "/permissions",
        label: "الصلاحيات",
        description:
          "إدارة صلاحيات النظام والوحدات والإجراءات",
        icon: KeyRound,
      },

      {
        path: "/statuses",
        label: "حالات النظام",
        description:
          "إدارة حالات الطلبيات ومراحل الإنتاج",
        icon: CircleDot,
      },

    ],
  },

];



/**
 * ================================================================
 * إرجاع بيانات العنصر النشط ومجموعته
 * بناءً على المسار الحالي
 * ================================================================
 */

export function findActiveNavItem(pathname) {

  for (const group of NAV_GROUPS) {

    const match = group.items.find(
      (item) =>
        item.path === pathname
    );

    if (match) {

      return {
        ...match,
        groupLabel:
          group.label,
      };

    }

  }

  return null;
}