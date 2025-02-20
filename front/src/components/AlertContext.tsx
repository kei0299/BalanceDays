import { createContext, useContext, useState, useEffect } from "react";
import OpenAlert from "@/components/openAlert";

interface AlertContextProps {
  showAlert: (message: string, severity?: "success" | "info" | "warning" | "error") => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error">("success");

  useEffect(() => {
    // ページ読み込み時に `localStorage` からアラート情報を取得
    const savedAlert = localStorage.getItem("alert");
    if (savedAlert) {
      const { message, severity } = JSON.parse(savedAlert);
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
      localStorage.removeItem("alert");
    }
  }, []);

  const showAlert = (message: string, severity: "success" | "info" | "warning" | "error" = "success") => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);

    // ページ遷移後もアラートを維持するために `localStorage` に保存
    localStorage.setItem("alert", JSON.stringify({ message, severity }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <OpenAlert open={open} onClose={handleClose} message={message} severity={severity} />
    </AlertContext.Provider>
  );
};

// カスタムフックでアラートを簡単に使えるようにする
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
