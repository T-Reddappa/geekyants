import { useCallback } from "react";
import {
  toast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
} from "../components/ui/toast";

export const useToast = () => {
  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info",
      duration?: number
    ) => {
      toast({ message, type, duration });
    },
    []
  );

  const showSuccess = useCallback((message: string, duration?: number) => {
    toastSuccess(message, duration);
  }, []);

  const showError = useCallback((message: string, duration?: number) => {
    toastError(message, duration);
  }, []);

  const showWarning = useCallback((message: string, duration?: number) => {
    toastWarning(message, duration);
  }, []);

  const showInfo = useCallback((message: string, duration?: number) => {
    toastInfo(message, duration);
  }, []);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
