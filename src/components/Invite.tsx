import { useState, useEffect } from "react";
import { copyTextToClipboard } from "../utils/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { useCamp } from "../context/CampContext";

export default function Invite({ connection }: { connection: string }) {
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const { campName } = useCamp();

  useEffect(() => {
    if (showCopyTooltip) {
      setTimeout(() => {
        setShowCopyTooltip(false);
      }, 1500);
    }
  }, [showCopyTooltip]);
  return (
    <div className="space-y-4 w-96 text-xl">
      <div className="p-4 bg-black rounded-md border border-white">
        <div className="relative">
          <div>Give people this link so they can join</div>
          <button
            className="relative"
            onClick={() => {
              setShowCopyTooltip(true);
              copyTextToClipboard(
                `http://localhost:5173?connection=${connection}`
              );
            }}
          >
            <AnimatePresence>
              {showCopyTooltip && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-4 text-sm left-0 px-2 bg-white rounded-md text-black"
                >
                  Copied
                </motion.span>
              )}
            </AnimatePresence>
            <span className="overflow-x-hidden w-72 block text-ellipsis whitespace-nowrap hover:font-bold">
              http://localhost:5173?connection={connection}
            </span>
          </button>
        </div>
      </div>
      <div className="text-center">Or give them your card</div>
      <div className="p-4 bg-black rounded-md border border-white ">
        <div>Join {campName}!</div>
        <div className="text-base -mt-2">Peer support group</div>
      </div>
    </div>
  );
}
