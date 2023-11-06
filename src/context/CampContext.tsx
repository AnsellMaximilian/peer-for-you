import React, { createContext, ReactNode, useContext, useState } from "react";

export interface CampContextData {
  campName: string;
  setCampName: (name: string) => void;
  campfireMode: boolean;
  setCampfireMode: (value: boolean) => void;
}

export const CampContext = createContext<CampContextData>({
  campName: "",
  setCampName: () => {},
  campfireMode: false,
  setCampfireMode: () => {},
});

export const CampContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [campName, setCampName] = useState("");
  const [campfireMode, setCampfireMode] = useState(false);

  return (
    <CampContext.Provider
      value={{
        campName,
        setCampName,
        campfireMode,
        setCampfireMode,
      }}
    >
      {children}
    </CampContext.Provider>
  );
};

export const useCamp = (): CampContextData => {
  const context = useContext(CampContext);
  if (!context) {
    throw new Error("useCamp must be used within a CampContextProvider");
  }
  return context;
};
