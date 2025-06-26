import { toast as hotToast, type ToastOptions } from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const iconStyles = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

export const toast = ({
  message,
  type = "info",
  duration = 4000,
}: ToastProps) => {
  const Icon = toastIcons[type];

  const toastOptions: ToastOptions = {
    duration,
    style: {
      background: "transparent",
      padding: 0,
      margin: 0,
      boxShadow: "none",
    },
  };

  return hotToast.custom(
    (t) => (
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-sm transition-all duration-300",
          toastStyles[type],
          t.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
      >
        <Icon className={cn("w-5 h-5 flex-shrink-0", iconStyles[type])} />
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ),
    toastOptions
  );
};

// Convenience methods
export const toastSuccess = (message: string, duration?: number) =>
  toast({ message, type: "success", duration });

export const toastError = (message: string, duration?: number) =>
  toast({ message, type: "error", duration });

export const toastWarning = (message: string, duration?: number) =>
  toast({ message, type: "warning", duration });

export const toastInfo = (message: string, duration?: number) =>
  toast({ message, type: "info", duration });

export { hotToast };
