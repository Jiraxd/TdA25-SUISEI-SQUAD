"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ErrorContextType = {
  errorMessage: string;
  updateErrorMessage: (err: string) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

type ErrorProviderProps = {
  children: ReactNode;
};

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errorMessage, setError] = useState<string>("");

  const updateErrorMessage = (err: string) => {
    setError(err);
  };

  return (
    <ErrorContext.Provider value={{ errorMessage, updateErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorMessage = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorMessage must be used within a ErrorProvider");
  }
  return context;
};
