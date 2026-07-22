import type { ReactNode } from "react";

interface AlertProps {
  variant: "error" | "success";
  children: ReactNode;
}

const VARIANTS: Record<AlertProps["variant"], string> = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
};

const Alert = ({ variant, children }: AlertProps) => {
  return (
    <div className={`rounded-md border px-3 py-2 text-sm ${VARIANTS[variant]}`}>
      {children}
    </div>
  );
};

export default Alert;
