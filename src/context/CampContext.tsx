import React, { createContext, ReactNode, useContext, useState } from "react";
import { useUser } from "./UserContext";

export interface CampContextData {
  campName: string;
  setCampName: (name: string) => void;
  campfireMode: boolean;
  setCampfireMode: (value: boolean) => void;
  id: string;
  setId: (name: string) => void;
  getConnection: () => string;
}

export const CampContext = createContext<CampContextData>({
  campName: "",
  setCampName: () => {},
  campfireMode: false,
  setCampfireMode: () => {},
  id: "",
  setId: () => {},
  getConnection: () => "",
});

export const CampContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [campName, setCampName] = useState("");
  const [campfireMode, setCampfireMode] = useState(false);
  const [id, setId] = useState("");
  const { id: userId } = useUser();

  const getConnection = () => {
    return `${id}:${userId}`;
  };

  return (
    <CampContext.Provider
      value={{
        id,
        setId,
        campName,
        setCampName,
        campfireMode,
        setCampfireMode,
        getConnection,
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
