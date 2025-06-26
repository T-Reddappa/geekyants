import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "transparent",
          padding: 0,
          margin: 0,
          boxShadow: "none",
        },
      }}
    />
  );
}
