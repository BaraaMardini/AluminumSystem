/**
 * يعرض أي محتوى رقمي (كميات، نسب، فواصل "/"، فواصل الآلاف) بترتيب ثابت
 * من اليسار لليمين داخل صفحة RTL — يمنع خوارزمية bidi من قلب الأرقام
 * والرموز المرافقة لها (مثل "380 / 1,000" أو "+12.5%").
 */
export default function Figures({ children, className = "", ...rest }) {
  return (
    <span className={`figures ${className}`} dir="ltr" {...rest}>
      {children}
    </span>
  );
}
