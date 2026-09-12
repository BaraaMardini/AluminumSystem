/**
 * علامة العلامة التجارية — مقتبسة من مقطع عرضي لبروفايل ألومنيوم مبثوق (extrusion)،
 * بدلاً من أيقونة عامة. عنصر التوقيع البصري الوحيد للنظام.
 */
export default function BrandMark({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M3 21V9.5L12 3l9 6.5V21" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7.5 21V12.7L12 9.5l4.5 3.2V21" stroke="white" strokeWidth="1.6" strokeLinejoin="round" strokeOpacity="0.55" />
      <line x1="3" y1="21" x2="21" y2="21" stroke="white" strokeWidth="1.6" />
      <circle cx="12" cy="9.3" r="1.15" fill="white" />
    </svg>
  );
}
