import { Users, Swords, Lock, Timer, X } from "lucide-react";
import { useLanguage } from "../languageContext";
import { GetLoginCookie, TranslateText } from "@/lib/utils";
import { UserProfile } from "@/models/UserProfile";
import { useAlertContext } from "../alertContext";
import { useEffect, useState } from "react";
//import { GameFound } from "./game-found";
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import { PrivateGameModal } from "./private-game-modal";

type GameOptionsProps = {
  user: UserProfile | null;
};
export default function GameOptions({ user }: GameOptionsProps) {
  const { language } = useLanguage();
  const { updateErrorMessage, updateSuccessMessage } = useAlertContext();
  const [inQueue, setInQueue] = useState(false);
  const [queueType, setQueueType] = useState<"ranked" | "unranked" | null>(
    null
  );
  const [showPrivateGameModal, setShowPrivateGameModal] = useState(false);
  const [queueTime, setQueueTime] = useState(0);
  // const [foundGame, setShowFound] = useState(false);
  // const [opponent, setOpponent] = useState<UserProfile | null>(null);

  const router = useRouter();

  const directCancelQueue = async () => {
    const loginToken = GetLoginCookie();
    if (!loginToken) return;

    await fetch(`/api/v1/matchmaking/cancel`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${loginToken}`,
      },
    });
  };

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const client = new Client({
      brokerURL: `${protocol}//${window.location.host}/app/handshake`,
     /* debug: (str) => {
        console.log("STOMP debug:", str);
      },
      */
      onConnect: () => {
        client.subscribe("/user/queue/matchmaking", (message) => {
       //   console.log(message);
          const response = JSON.parse(message.body);
          if (response.body.type === "MatchFound") {
            router.push(`/onlineGame/${response.body.message}`);
          }
        });
      },
      onDisconnect: () => {
        setInQueue(false);
        setQueueType(null);
        setQueueTime(0);
      },
      onStompError: (error) => {
        updateErrorMessage(
          TranslateText("MATCHMAKING_CONNECTION_ERROR", language)
        );
      },
    });

    client.activate();
    window.addEventListener("beforeunload", directCancelQueue);
    return () => {
      window.removeEventListener("beforeunload", directCancelQueue);
      if (client.active) {
        client.deactivate();
      }
      handleCancelQueue();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inQueue) {
      interval = setInterval(() => {
        setQueueTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inQueue]);

  async function handleCancelQueue() {
    if (user?.banned) {
      updateErrorMessage(TranslateText("BANNED_USER", language));
      return;
    }
    const loginToken = GetLoginCookie();
    const data = await fetch(`/api/v1/matchmaking/cancel`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${loginToken}`,
      },
      credentials: "include",
    });
    if (data.ok) {
      setInQueue(false);
      setQueueType(null);
      setQueueTime(0);
      //     setOpponent(null);
      updateSuccessMessage(TranslateText("MATCHMAKING_CANCELLED", language));
    }
  }
  async function handleClickMatchmaking(ranked: "unranked" | "ranked") {
    if (user === null) {
      updateErrorMessage(TranslateText("USER_NOT_LOGGED_IN", language));
      return;
    }
    if (user.banned) {
      updateErrorMessage(TranslateText("BANNED_USER", language));
      return;
    }
    updateSuccessMessage(TranslateText("MATCHMAKING_REQUEST_SENT", language));
    const loginToken = GetLoginCookie();
    const data = await fetch(
      `/api/v1/matchmaking/start?matchmaking=${ranked}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${loginToken}`,
        },
        credentials: "include",
      }
    );
    if (data.ok) {
      setInQueue(true);
      setQueueType(ranked);
      setQueueTime(0);
    } else {
      setInQueue(false);
      setQueueType(null);
      setQueueTime(0);
      updateErrorMessage(TranslateText("MATCHMAKING_REQUEST_ERROR", language));
    }
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/*UNRANKED BUTTON */}
        {inQueue && queueType === "unranked" && (
          <div
            className={`p-6 max-h-[140px] rounded-lg transition-colors flex flex-col items-center justify-center space-y-2 bg-purple`}
          >
            <div className="flex-row flex items-center space-x-6 w-full justify-center">
              <div className="flex-row flex items-center">
                <Timer size={36} className="text-white animate-pulse" />
                <span className="text-xl font-dosis-bold text-white">
                  {Math.floor(queueTime / 60)}:
                  {(queueTime % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div
                onClick={(e) => {
                  handleCancelQueue();
                }}
                className="px-1 ml-4 cursor-pointer py-1 bg-whitelessbright rounded-lg hover: text-defaultred border border-defaultred"
              >
                <X size={24} />
              </div>
            </div>
            <span className="text-2xl font-dosis-bold text-white">
              {TranslateText("SEARCHING_GAME", language)}
            </span>
          </div>
        )}
        {queueType !== "unranked" && (
          <button
            onClick={() => handleClickMatchmaking("unranked")}
            disabled={inQueue}
            className={`p-6 max-h-[140px] rounded-lg transition-colors flex flex-col items-center justify-center space-y-2 bg-defaultblue hover:bg-darkerblue`}
          >
            <Users size={48} className="text-white" />
            <span className="text-2xl font-dosis-bold">
              {TranslateText("RANDOM_GAME", language)}
            </span>
          </button>
        )}
        {/*END OF UNRANKED BUTTON */}
        {/*RANKED BUTTON */}
        {inQueue && queueType === "ranked" && (
          <div
            className={`p-6 max-h-[140px] rounded-lg transition-colors flex flex-col items-center justify-center space-y-2 bg-purple`}
          >
            <div className="flex-row flex items-center space-x-6 w-full justify-center">
              <div className="flex-row flex items-center">
                <Timer size={36} className="text-white animate-pulse" />
                <span className="text-xl font-dosis-bold text-white">
                  {Math.floor(queueTime / 60)}:
                  {(queueTime % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div
                onClick={(e) => {
                  handleCancelQueue();
                }}
                className="px-1 ml-4 cursor-pointer py-1 bg-whitelessbright rounded-lg hover: text-defaultred border border-defaultred"
              >
                <X size={24} />
              </div>
            </div>
            <span className="text-2xl font-dosis-bold text-white">
              {TranslateText("SEARCHING_GAME", language)}
            </span>
          </div>
        )}
        {queueType !== "ranked" && (
          <button
            onClick={() => handleClickMatchmaking("ranked")}
            disabled={inQueue}
            className={`p-6 max-h-[140px] rounded-lg transition-colors flex flex-col items-center justify-center space-y-2 bg-defaultblue hover:bg-darkerblue`}
          >
            <Swords size={48} className="text-white" />
            <span className="text-2xl font-dosis-bold">
              {TranslateText("RANKED_RANDOM_GAME", language)}
            </span>
          </button>
        )}
        {/*END OF RANKED BUTTON */}
        <button
          disabled={inQueue}
          onClick={() => setShowPrivateGameModal(true)}
          className="p-4 bg-defaultblue rounded-lg hover:bg-darkerblue transition-colors flex flex-col items-center justify-center space-y-4"
        >
          <Lock size={48} className="text-white" />
          <span className="text-2xl font-dosis-bold">
            {TranslateText("PRIVATE_GAME", language)}
          </span>
        </button>
      </div>
      {/*  <GameFound
        isOpen={foundGame}
        opponent={{
          username: opponent?.username || "Opponent",
          elo: opponent?.elo || 0,
          avatar: opponent?.profilePicture || "/images/placeholder-avatar.png",
          nameColor: opponent?.nameColor || "black",
        }}
        onAccept={async () => {
          setShowFound(false);
          // TODO BE REQUEST TO START GAME
        }}
        onDecline={async () => {
          setShowFound(false);
          // TODO BE REQUEST TO DECLINE GAME
        }}
        timeoutSeconds={30}
      />
   */}
      <PrivateGameModal
        isOpen={showPrivateGameModal}
        onClose={() => setShowPrivateGameModal(false)}
        language={language}
      />
    </>
  );
}
