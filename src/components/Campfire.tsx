import campFire from "../assets/campfire.svg";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useCamp } from "../context/CampContext";
import PeerMember from "./PeerMember";
import { useSpace, useMembers } from "@ably/spaces/react";
import { useAbly } from "ably/react";
import { Types } from "ably";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Input from "./Input";

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

  const ablyClient = useAbly();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<string[]>([]);

  const [currentDisplayedMessage, setCurrentDisplayedMessage] = useState<
    null | string
  >(null);

  const chatChannel = useMemo(() => {
    return ablyClient.channels.get(`${campName}`);
  }, [ablyClient, campName]);

  useEffect(() => {
    const listener = (ablyMessage: Types.Message) => {
      const message = ablyMessage.data as string;
      setMessages((prev) => [...prev, message]);
      setCurrentDisplayedMessage(message);
    };
    chatChannel.subscribe(listener);

    return () => {
      chatChannel.unsubscribe(listener);
    };
  }, [chatChannel]);

  useEffect(() => {
    if (space) {
      space.enter({ id: uuidv4() });
    }
  }, [space]);

  useEffect(() => {
    if (currentDisplayedMessage) {
      setTimeout(() => {
        setCurrentDisplayedMessage(null);
      }, Math.max(3000, currentDisplayedMessage.split(" ").length * 500));
    }
  }, [currentDisplayedMessage]);

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
        <AnimatePresence>
          {currentDisplayedMessage && (
            <motion.div
              className="absolute bg-white text-black text-xl rounded-md bottom-32 left-[50%] translate-x-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute bg-white h-3 w-3 top-[calc(100%+3px)] right-[calc(100%+3px)]"></div>
              <div className="absolute bg-white h-2 w-2 top-[calc(100%+18px)] right-[calc(100%+18px)]"></div>
              <div className="w-64 max-h-64 p-4 overflow-y-auto">
                {currentDisplayedMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute w-1/2 left-4 bottom-4 border border-white rounded-md p-4">
        <div className="flex-col gap-2 hidden">
          {messages.map((m) => (
            <div key={m}>{m}</div>
          ))}
        </div>
        <div className="flex gap-1">
          <Input
            placeholder="Chat message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() => {
              setMessage("");
              chatChannel.publish("add", message);
            }}
            className="bg-white text-black rounded-md px-4 py-2 font-bold hover:bg-slate-200"
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}
