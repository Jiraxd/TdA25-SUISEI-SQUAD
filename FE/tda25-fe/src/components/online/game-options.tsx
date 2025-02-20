import { Users, Swords, Lock, Timer, X } from "lucide-react";
import { useLanguage } from "../languageContext";
import { GetLoginCookie, TranslateText } from "@/lib/utils";
import { UserProfile } from "@/models/UserProfile";
import { useAlertContext } from "../alertContext";
import { useEffect, useState } from "react";
//import { GameFound } from "./game-found";
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";

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
  const [queueTime, setQueueTime] = useState(0);
  // const [foundGame, setShowFound] = useState(false);
  // const [opponent, setOpponent] = useState<UserProfile | null>(null);

  const router = useRouter();

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const client = new Client({
      brokerURL: `${protocol}//${window.location.host}/app/handshake`,
      debug: (str) => {
        console.log("STOMP debug:", str);
      },
      onConnect: () => {
        console.log("Connected to matchmaking");
        client.subscribe("/user/matchmaking", (message) => {
          const response = JSON.parse(message.body);
          if (response.body.type === "MatchFound") {
            router.push(`/onlineGame/${response.body.message}`);
          }
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from matchmaking");
        setInQueue(false);
        setQueueType(null);
        setQueueTime(0);
      },
      onStompError: (error) => {
        console.error("STOMP error:", error);
        updateErrorMessage(
          TranslateText("MATCHMAKING_CONNECTION_ERROR", language)
        );
      },
    });

    client.activate();

    return () => {
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
        <button
          onClick={() => handleClickMatchmaking("unranked")}
          disabled={inQueue}
          className={`p-6 max-h-[140px] rounded-lg transition-colors flex flex-col items-center justify-center space-y-2 ${
            inQueue && queueType === "unranked"
              ? "bg-purple"
              : "bg-defaultblue hover:bg-darkerblue"
          }`}
        >
          {inQueue && queueType === "unranked" ? (
            <>
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
                    e.stopPropagation();
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
            </>
          ) : (
            <>
              <Users size={48} className="text-white" />
              <span className="text-xl font-dosis-bold">
                {TranslateText("RANDOM_GAME", language)}
              </span>
            </>
          )}
        </button>
        <button
          onClick={() => handleClickMatchmaking("ranked")}
          disabled={inQueue}
          className={`p-6 rounded-lg max-h-[140px] transition-colors flex flex-col items-center justify-center space-y-4 ${
            inQueue && queueType === "ranked"
              ? "bg-purple"
              : "bg-defaultblue hover:bg-darkerblue"
          }`}
        >
          {inQueue && queueType === "ranked" ? (
            <>
              <div className="flex-row flex items-center space-x-6 w-full justify-center">
                <div>
                  <Timer size={36} className="text-white animate-pulse" />
                  <span className="text-xl font-dosis-bold text-white">
                    {Math.floor(queueTime / 60)}:
                    {(queueTime % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelQueue();
                  }}
                  className="px-4 ml-4 cursor-pointer py-2 bg-defaultred rounded-lg hover:bg-red-700 text-white"
                >
                  <X size={24} />
                </div>
              </div>
              <span className="text-2xl font-dosis-bold text-white">
                {TranslateText("SEARCHING_GAME", language)}
              </span>
            </>
          ) : (
            <>
              <Swords size={48} className="text-white" />
              <span className="text-2xl font-dosis-bold">
                {TranslateText("RANKED_RANDOM_GAME", language)}
              </span>
            </>
          )}
        </button>
        <button
          disabled={inQueue}
          className="p-6 bg-defaultblue rounded-lg hover:bg-darkerblue  transition-colors flex flex-col items-center justify-center space-y-4"
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
    </>
  );
}
