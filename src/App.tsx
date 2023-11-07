import { Realtime } from "ably";
import { AblyProvider } from "ably/react";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Campfire from "./components/Campfire";
import Input from "./components/Input";
import { useCamp } from "./context/CampContext";
import { motion, AnimatePresence } from "framer-motion";
import Spaces from "@ably/spaces";
import { useState, useEffect } from "react";
import { getConnectionFromURL, isConnectionValid } from "./utils/helpers";
import { useUser } from "./context/UserContext";

const client = new Realtime.Promise({
  key: import.meta.env.VITE_ABLY_API_KEY,
  clientId: "peer-for-you",
});

const spaces = new Spaces(client);

function App() {
  const {
    setCampfireMode,
    setCampName,
    campName,
    campfireMode,
    setId,
    getConnection,
  } = useCamp();

  const { id: userId } = useUser();

  const [connection, setConnection] = useState(getConnection());

  useEffect(() => {
    const connectionFromURL = getConnectionFromURL();

    if (connectionFromURL) {
      const [, , campName] = connectionFromURL.split(":");
      setConnection(connectionFromURL);
      setCampfireMode(true);
      setCampName(campName);
    }
  }, [setCampName, setCampfireMode]);

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {campfireMode && isConnectionValid(connection) ? (
          <motion.div
            className="grow flex flex-col w-full"
            key="campfire"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AblyProvider client={client}>
              <SpacesProvider client={spaces}>
                <SpaceProvider name={connection}>
                  <Campfire connection={connection} />
                </SpaceProvider>
              </SpacesProvider>
            </AblyProvider>
          </motion.div>
        ) : (
          <motion.div key="intro" exit={{ opacity: 0 }}>
            <motion.h1
              className="text-6xl relative hidden md:block"
              initial={{ scale: 2, y: "-50%", top: "50%" }}
              animate={{
                scale: 1,
                y: 0,
                top: 0,
              }}
              transition={{ delay: 3 }}
            >
              Peer for You
            </motion.h1>
            <motion.h1
              className="text-6xl relative block md:hidden"
              initial={{ scale: 1.25, y: "-50%", top: "50%" }}
              animate={{
                scale: 1,
                y: 0,
                top: 0,
              }}
              transition={{ delay: 3 }}
            >
              Peer for You
            </motion.h1>
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
              className="text-2xl mt-8 text-center space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (campName) {
                  setCampfireMode(true);
                  const id = uuidv4();
                  setId(id);
                  setConnection(`${id}:${userId}:${campName}`);
                }
              }}
            >
              <h2>Create A Campfire?</h2>
              <Input
                autoFocus
                placeholder="Ex: Mental Support"
                value={campName}
                onChange={(e) => setCampName(e.target.value)}
              />
              <button
                type="submit"
                className="block bg-white text-black rounded-md px-4 py-2 font-bold hover:bg-slate-200 mx-auto"
              >
                Camp
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
