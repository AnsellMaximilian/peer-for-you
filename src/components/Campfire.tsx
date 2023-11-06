import campFire from "../assets/campfire.svg";
import { motion, Variants } from "framer-motion";
import { useCamp } from "../context/CampContext";
import PeerMember from "./PeerMember";

const fireVariants: Variants = {
  animate: {
    opacity: [0.1, 0, 0.1],
    transition: {
      repeat: Infinity,
      duration: 1.5,
    },
  },
};

export default function Campfire() {
  const { campName } = useCamp();
  return (
    <div className="relative grow flex flex-col items-center justify-center">
      <div className="top-4 right-4 absolute">
        <h1 className="text-4xl">{campName}</h1>
        <div className="text-right text-lg">33 present</div>
      </div>
      <div className="relative w-full flex justify-center">
        <div className="absolute bottom-0 flex gap-6 justify-center">
          <PeerMember orientation="RIGHT" />
          <PeerMember orientation="RIGHT" />
          <PeerMember orientation="RIGHT" />
          <PeerMember />
          <PeerMember />
          <PeerMember />
        </div>
        <motion.div
          variants={fireVariants}
          animate="animate"
          className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] bg-yellow-200 w-[500px] h-[500px] rounded-full"
        ></motion.div>
        <motion.div
          variants={fireVariants}
          animate="animate"
          className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] bg-yellow-400 w-[300px] h-[300px] rounded-full"
        ></motion.div>
        <motion.div
          variants={fireVariants}
          animate="animate"
          className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] bg-yellow-600 w-[150px] h-[150px] rounded-full"
        ></motion.div>
        <img src={campFire} className="w-24 relative" />
      </div>
    </div>
  );
}
