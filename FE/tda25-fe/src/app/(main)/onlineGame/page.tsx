"use client";

import { useLanguage } from "@/components/languageContext";
import { LoadingCircle } from "@/components/loadingCircle";
import { checkWinner, GetLoginCookie, TranslateText } from "@/lib/utils";
import { UserProfile } from "@/models/UserProfile";
import { motion, useAnimation } from "framer-motion";
import { SwordsIcon, FlagIcon, AlarmClockIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAlertContext } from "@/components/alertContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { useRef } from "react";

type WSMessage = {
  type: "Win" | "Board" | "Error";
  message: string | Array<Array<"X" | "O" | "">>;
};

export default function OnlineGamePage() {
  const pathName = usePathname();
  const { language } = useLanguage();
  const gameId = pathName.split("/").pop();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [board, setBoard] = useState<Array<Array<"X" | "O" | "">>>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const [xPlayer, setXPlayer] = useState<string>("");
  const [oPlayer, setOPlayer] = useState<string>("");
  const [opponent, setOpponent] = useState<UserProfile | null>(null);
  const [ranked, setRanked] = useState<boolean>(false);
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);
  const [winLane, setWinLane] = useState<number[][]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | null>(null);
  const controls = useAnimation();
  const { updateSuccessMessage, updateErrorMessage } = useAlertContext();
  const [client, setClient] = useState<Client | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  useEffect(() => {
    // TESTING
    setUser({
      uuid: "testuuid",
      createdAt: new Date(),
      username: "J1R4",
      email: "test",
      elo: 1251,
      wins: 34,
      draws: 5,
      losses: 22,
      nameColor: "#AB2E58",
    });
    setXPlayer("testuuid");
    setOpponent({
      uuid: "testuuid2",
      createdAt: new Date(),
      username: "OpponentTest",
      email: "test",
      elo: 1251,
      wins: 34,
      draws: 5,
      losses: 22,
      nameColor: "#AB2E58",
    });
    setOPlayer("testuuid2");
    async function fetchData() {
      const loginToken = GetLoginCookie();
      const res = await fetch(`/api/v1/liveGame/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${loginToken}`,
        },
      });
      const data = await res.json();
      console.log(data);
    }
    fetchData();
  }, [gameId]);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("/app/handshake"),
      connectHeaders: {
        Authorization: GetLoginCookie() || "",
      },
      onConnect: () => {
        console.log("Connected to game websocket");
        stompClient.subscribe("/user/game-updates", (message) => {
          const data = JSON.parse(message.body);
          const response = data.body;

          if (response.type === "Win") {
            setWinner(response.message as "X" | "O" | "draw");
            const { winner, winningLine } = checkWinner(board);
            setWinLane(winningLine);
          } else if (response.type === "Board") {
            setBoard(response.message as Array<Array<"X" | "O" | "">>);
          } else if (response.type === "Error") {
            updateErrorMessage(
              TranslateText(response.message as string, language)
            );
          }
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from game websocket");
      },
      onStompError: (error) => {
        console.error("STOMP error:", error);
        updateErrorMessage(TranslateText("GAME_CONNECTION_ERROR", language));
      },
    });
    setClient(stompClient);
    stompClient.activate();

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, []);

  async function handleClick(rowIndex: number, colIndex: number) {
    if (!client) return;
    if (board[rowIndex][colIndex] !== "" || winner || !client.active) return;

    try {
      client.publish({
        destination: `/app/ws/makeMove/${gameId}`,
        body: JSON.stringify({
          X: rowIndex,
          Y: colIndex,
        }),
        headers: {
          Authorization: GetLoginCookie() || "",
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Move error:", error);
      updateErrorMessage(TranslateText("MOVE_ERROR", language));
    }
  }

  return (
    <>
      <title>{TranslateText("ONLINE_GAME_PAGE_TITLE", language)}</title>
      <motion.div
        className="font-dosis-bold bg-whitelessbright"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {!user ? (
          <div className="flex justify-center items-center mt-20">
            <LoadingCircle />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="container px-4 py-8 flex w-full flex-col items-center justify-center">
              <div className="flex items-center w-full justify-center">
                <h1
                  className="text-2xl md:text-4xl py-4 flex items-center text-center text-darkshade"
                  style={{
                    width: boardRef.current?.offsetWidth,
                    minWidth: boardRef.current?.offsetWidth,
                  }}
                >
                  <span className="text-left w-[42%] flex-row flex items-center align-middle gap-2">
                    {xPlayer === user?.uuid ? (
                      <img
                        className="w-[8%] h-[8%]"
                        src="/icons/X_cervene.svg"
                      />
                    ) : (
                      <img
                        className="w-[10%] h-[10%]"
                        src="/icons/O_modre.svg"
                      />
                    )}

                    {user?.username || "Unknown"}
                  </span>
                  <SwordsIcon className="w-[16%]" size={32} />
                  <span className="text-right w-[42%] flex-row flex  items-center justify-end align-middle gap-2">
                    {opponent?.username || "Unknown"}
                    {oPlayer === opponent?.uuid ? (
                      <img
                        className="w-[10%] h-[10%]"
                        src="/icons/O_modre.svg"
                      />
                    ) : (
                      <img
                        className="w-[8%] h-[8%]"
                        src="/icons/X_cervene.svg"
                      />
                    )}
                  </span>
                </h1>
              </div>
              {/*
            <h1 className="text-2xl md:text-4xl py-4 text-center flex items-center justify-center gap-4 text-darkshade">
              <span className="w-[40%] text-right">
                {user?.username || "Unknown"}
              </span>
              <SwordsIcon size={32} />
              <span className="w-[40%] text-left">
                {opponent?.username || "Unknown"}
              </span>
            </h1>
            */}

              <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start gap-4 lg:gap-8">
                <Card className="w-full lg:w-80 order-2 xl:order-1 border-2 border-darkshade">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-defaultred">
                      {TranslateText("GAME_INFO", language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="w-full space-y-4 text-darkshade">
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-lg">
                          {TranslateText("YOUR_SYMBOL", language)}
                        </span>
                        {playerSymbol === "X" ? (
                          <img
                            className="w-[10%] h-[10%]"
                            src="/icons/X_cervene.svg"
                          />
                        ) : playerSymbol === "O" ? (
                          <img
                            className="w-[10%] h-[10%]"
                            src="/icons/O_modre.svg"
                          />
                        ) : (
                          <QuestionMarkIcon className="w-[10%] h-[10%]" />
                        )}
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-lg">
                          {TranslateText("ON_TURN", language)}
                        </span>
                        {playerSymbol === "X" ? (
                          <img
                            className="w-[10%] h-[10%]"
                            src="/icons/X_cervene.svg"
                          />
                        ) : playerSymbol === "O" ? (
                          <img
                            className="w-[10%] h-[10%]"
                            src="/icons/O_modre.svg"
                          />
                        ) : (
                          <QuestionMarkIcon className="w-[10%] h-[10%]" />
                        )}
                      </div>

                      <div className="flex justify-center items-center">
                        <div className="text-center">
                          <div className="text-lg text-darkshade">
                            {TranslateText("ROUNDS_PLAYED", language)}
                          </div>
                          <div className="font-bold text-2xl">
                            {board.flat().filter((f) => f === "O").length}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-lg">
                          {TranslateText("TIME_REMAINING", language)}
                        </span>
                        <div className="flex items-center gap-2">
                          <AlarmClockIcon className="h-6 w-6" />
                          <span
                            className={`text-2xl font-bold ${
                              timeRemaining < 10
                                ? "text-defaultred"
                                : "text-darkshade"
                            }`}
                          >
                            {timeRemaining}s
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex-1 order-1 xl:order-2 w-full flex justify-center">
                  <motion.div
                    ref={boardRef}
                    className="grid grid-cols-15 border-4"
                    style={{
                      backgroundColor: "var(--darkshade)",
                      borderColor: "var(--darkshade)",
                      width: "min(90vw, 60vh)",
                      height: "min(90vw, 60vh)",
                    }}
                    initial="hidden"
                    animate={controls}
                    variants={{
                      visible: {
                        transition: { staggerChildren: 0.01 },
                      },
                    }}
                  >
                    {board.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <motion.button
                          key={`${rowIndex}-${colIndex}`}
                          className="aspect-square flex items-center justify-center text-base sm:text-xl md:text-2xl lg:text-3xl font-bold"
                          style={{
                            backgroundColor: winLane.some(
                              ([r, c]) => r === rowIndex && c === colIndex
                            )
                              ? "#22c55e"
                              : "var(--whitelessbright)",
                            color:
                              cell.toUpperCase() === "X"
                                ? "var(--defaultred)"
                                : "var(--defaultblue)",
                            borderColor: "var(--darkshade)",
                            borderWidth: "1px",
                          }}
                          onClick={() => handleClick(rowIndex, colIndex)}
                          whileHover={{ scale: 0.95 }}
                          whileTap={{ scale: 0.85 }}
                        >
                          {cell === "X" ? (
                            <img
                              className="w-[80%] h-[80%]"
                              src="/icons/X_cervene.svg"
                            />
                          ) : cell === "O" ? (
                            <img
                              className="w-[80%] h-[80%]"
                              src="/icons/O_modre.svg"
                            />
                          ) : (
                            <></>
                          )}
                        </motion.button>
                      ))
                    )}
                  </motion.div>
                </div>

                <Card className="w-full lg:w-80 order-3 border-2 border-darkshade">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-defaultred">
                      {TranslateText("OPPONENT", language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={
                          opponent?.profilePicture ||
                          "/images/placeholder-avatar.png"
                        }
                        alt={opponent?.username || "Unknown"}
                        className="object-cover"
                      />
                    </Avatar>

                    <div
                      className="text-xl font-bold"
                      style={{ color: opponent?.nameColor }}
                    >
                      {opponent?.username || "Unknown"}
                    </div>

                    <div className="w-full space-y-2 text-darkshade">
                      <div className="flex justify-between">
                        <span>
                          {TranslateText("ELO_RATING_OPPONENT", language)}:
                        </span>
                        <span className="font-bold">{opponent?.elo || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{TranslateText("WINS", language)}:</span>
                        <span className="font-bold text-black">
                          {opponent?.wins || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{TranslateText("DRAWS", language)}:</span>
                        <span className="font-bold text-black">
                          {opponent?.draws || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{TranslateText("LOSSES", language)}:</span>
                        <span className="font-bold text-black">
                          {opponent?.losses || 0}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 bg-defaultred hover:bg-red-700"
                      onClick={() => {
                        // TODO surrender
                      }}
                    >
                      <FlagIcon className="mr-2 h-4 w-4" />
                      {TranslateText("SURRENDER", language)}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
