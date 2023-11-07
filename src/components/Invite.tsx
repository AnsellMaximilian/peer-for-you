import { useState, useEffect, useRef } from "react";
import { copyElementToClipboard, copyTextToClipboard } from "../utils/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { useCamp } from "../context/CampContext";
import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
  width: 160,
  height: 160,
  margin: 0,
  type: "svg",
  image: "/icon-white.png",
  dotsOptions: {
    color: "white",
    type: "rounded",
  },
  backgroundOptions: {
    color: "black",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 8,
  },
});

export default function Invite({ connection }: { connection: string }) {
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showCopyCardTooltip, setShowCopyCardTooltip] = useState(false);
  const [isCopyingCard, setIsCopyingCard] = useState(false);
  const { campName } = useCamp();

  useEffect(() => {
    if (showCopyTooltip) {
      setTimeout(() => {
        setShowCopyTooltip(false);
      }, 1500);
    }
  }, [showCopyTooltip]);

  // QR Stuff
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    qrCode.append(ref.current ? ref.current : undefined);
    qrCode.update({
      data: `http://localhost:3000?connection=${connection}`,
    });
  }, [connection]);

  const handleCopyCard = async () => {
    if (cardRef.current) {
      setIsCopyingCard(true);
      await copyElementToClipboard(cardRef.current);
      setIsCopyingCard(false);
      setShowCopyCardTooltip(true);
      setTimeout(() => {
        setShowCopyCardTooltip(false);
      }, 1500);
    }
  };

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
      <div className="">
        <div
          className="p-4 bg-black rounded-md border border-white flex justify-between"
          ref={cardRef}
        >
          <div className="flex flex-col">
            <div>
              <div>Join {campName}!</div>
              <div className="text-base -mt-2">Peer support group</div>
            </div>
            <div className="mt-auto">Scan this QR code.</div>
          </div>
          <div ref={ref} />
        </div>
        <div className="text-right mt-4">
          <button
            onClick={() => handleCopyCard()}
            disabled={isCopyingCard}
            className="bg-white text-black rounded-md px-4 py-2 font-bold hover:bg-slate-200 relative disabled:opacity-50"
          >
            <AnimatePresence>
              {(showCopyCardTooltip || isCopyingCard) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-6 text-sm left-0 px-2 bg-white rounded-md text-black"
                >
                  {isCopyingCard ? "Copying" : "Copied"}
                </motion.span>
              )}
            </AnimatePresence>
            Copy Card
          </button>
        </div>
      </div>
    </div>
  );
}
