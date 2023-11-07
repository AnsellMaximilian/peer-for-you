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
import { useUser } from "../context/UserContext";
import Modal from "./Modal";
import Invite from "./Invite";

export type Message = {
  id: string;
  content: string;
};

const fireVariants: Variants = {
  animate: {
    opacity: [0.1, 0, 0.1],
    transition: {
      repeat: Infinity,
      duration: 1.5,
    },
  },
};

export default function Campfire({ connection }: { connection: string }) {
  const { space } = useSpace(() => {
    // console.log(update);
  });

  const { members } = useMembers();

  const { campName } = useCamp();
  const { id: userId } = useUser();

  const ablyClient = useAbly();

  const [messageContent, setMessageContent] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const [currentDisplayedMessage, setCurrentDisplayedMessage] =
    useState<null | Message>(null);

  const chatChannel = useMemo(() => {
    return ablyClient.channels.get(`${connection}`);
  }, [connection, ablyClient.channels]);

  useEffect(() => {
    const listener = (ablyMessage: Types.Message) => {
      const message = ablyMessage.data as Message;
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
      space.enter({ id: userId });
    }
  }, [space, userId]);

  useEffect(() => {
    if (currentDisplayedMessage) {
      setTimeout(() => {
        setCurrentDisplayedMessage(null);
      }, Math.max(3000, currentDisplayedMessage.content.split(" ").length * 500));
    }
  }, [currentDisplayedMessage]);

  return (
    <div className="relative grow flex flex-col items-center justify-center">
      <div className="top-4 right-4 absolute">
        <h1 className="text-4xl">{campName}</h1>
        <div className="text-right text-lg">
          {members.filter((m) => m.isConnected).length} present
        </div>
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
                {currentDisplayedMessage.content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-x-4 bottom-4 border border-white rounded-md p-4">
        <div className="flex-col gap-2 hidden">
          {messages.map((m) => (
            <div key={m.id}>{m.content}</div>
          ))}
        </div>
        <div className="flex justify-between">
          <form
            className="flex gap-1"
            onSubmit={(e) => {
              e.preventDefault();

              if (!currentDisplayedMessage && messageContent) {
                const msg: Message = {
                  id: uuidv4(),
                  content: messageContent,
                };
                setMessageContent("");
                chatChannel.publish("add", msg);
              }
            }}
          >
            <Input
              autoFocus
              placeholder="Chat message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <button
              type="submit"
              className="bg-white text-black rounded-md px-4 py-2 font-bold hover:bg-slate-200"
            >
              Chat
            </button>
          </form>
          <div>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="border-white border-2 rounded-md px-4 py-2 font-bold hover:opacity-60"
            >
              Invite
            </button>
          </div>
        </div>
      </div>
      <Modal open={inviteModalOpen} handleOpen={setInviteModalOpen}>
        <Invite connection={connection} />
      </Modal>
    </div>
  );
}
