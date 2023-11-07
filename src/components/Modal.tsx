import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type Props = {
  open: boolean;
  handleOpen: (value: boolean) => void;
  children: React.ReactNode;
};

export default function Modal({ open, handleOpen, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={() => handleOpen(false)}
          className="fixed inset-0 flex items-center justify-center z-20 bg-[rgba(0,0,0,0.5)] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
