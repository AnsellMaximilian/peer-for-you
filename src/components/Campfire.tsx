import campFire from "../assets/campfire.svg";
import { motion, Variants } from "framer-motion";
import { useCamp } from "../context/CampContext";
import PeerMember from "./PeerMember";
import { useSpace, useMembers } from "@ably/spaces/react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

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
  const { space } = useSpace(() => {
    // console.log(update);
  });

  const { members } = useMembers();

  const { campName } = useCamp();

  useEffect(() => {
    if (space) {
      space.subscribe("update", (state) => {
        console.log(state);
      });
      space.enter({ id: uuidv4() });
    }
  }, [space]);

  return (
    <div className="relative grow flex flex-col items-center justify-center">
      <div className="top-4 right-4 absolute">
        <h1 className="text-4xl">{campName}</h1>
        <div className="text-right text-lg">33 present</div>
      </div>
      <div className="relative w-full flex justify-center">
        <div className="absolute bottom-0 flex gap-6 justify-center">
          {members
            .slice(0, 6)
            .filter((m) => m.isConnected)
            .map((member, index) => {
              return (
                <PeerMember
                  key={member.connectionId + index}
                  orientation={
                    index + 1 > Math.ceil(members.length / 2) ? "LEFT" : "RIGHT"
                  }
                />
              );
            })}
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
