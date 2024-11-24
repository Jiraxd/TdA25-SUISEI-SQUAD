"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AlertContextType = {
  alertMessage: string;
  alertType: "error" | "success";
  updateErrorMessage: (msg: string) => void;
  updateSuccessMessage: (msg: string) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

type AlertProviderProps = {
  children: ReactNode;
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const updateErrorMessage = (msg: string) => {
    setAlertMessage(msg);
    setAlertType("error");
  };

  const updateSuccessMessage = (msg: string) => {
    setAlertMessage(msg);
    setAlertType("success");
  };

  return (
    <AlertContext.Provider
      value={{
        alertMessage,
        alertType,
        updateErrorMessage,
        updateSuccessMessage,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within a ErrorProvider");
  }
  return context;
};
