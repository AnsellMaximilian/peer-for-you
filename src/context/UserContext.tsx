import React, { createContext, ReactNode, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface UserContextData {
  username: string;
  setUsername: (name: string) => void;
  id: string;
  setId: (name: string) => void;
}

export const UserContext = createContext<UserContextData>({
  username: "",
  setUsername: () => {},
  id: "",
  setId: () => {},
});

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState("");
  const [id, setId] = useState(uuidv4());

  return (
    <UserContext.Provider
      value={{
        id,
        setId,
        username,
        setUsername,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextData => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
