"use client";

import { useLanguage } from "@/components/languageContext";
import { LoadingCircle } from "@/components/loadingCircle";
import {
  byteArrayToImageUrl,
  checkWinner,
  formatTime,
  GetLoginCookie,
  TranslateText,
} from "@/lib/utils";
import { UserProfile } from "@/models/UserProfile";
import { motion, useAnimation } from "framer-motion";
import {
  SwordsIcon,
  FlagIcon,
  AlarmClockIcon,
  HandshakeIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAlertContext } from "@/components/alertContext";
import { Client } from "@stomp/stompjs";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { LiveGame } from "@/models/LiveGame";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OnlineGamePage() {
  const pathName = usePathname();
  const { language } = useLanguage();
  const gameId = pathName.split("/").pop();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [board, setBoard] = useState<Array<Array<"X" | "O" | "">>>(
    Array.from({ length: 15 }, () => Array(15).fill(""))
  );
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [gameResult, setGameResult] = useState<{
    winner: "X" | "O" | "draw" | null;
    playerEloChange: number;
    opponentEloChange: number;
    playerTimeRemaining: number;
    opponentTimeRemaining: number;
  } | null>({
    winner: "draw",
    playerEloChange: 0,
    opponentEloChange: 0,
    playerTimeRemaining: 0,
    opponentTimeRemaining: 0,
  });
  const [showDrawDialog, setShowDrawDialog] = useState<boolean>(false);
  const [xPlayer, setXPlayer] = useState<string>("");
  const [oPlayer, setOPlayer] = useState<string>("");
  const [opponent, setOpponent] = useState<UserProfile | null>(null);
  const [ranked, setRanked] = useState<boolean>(false);
  const [winner, setWinner] = useState<"X" | "O" | "Draw" | null>(null);
  const [winLane, setWinLane] = useState<number[][]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(480);
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const controls = useAnimation();
  const { updateSuccessMessage, updateErrorMessage } = useAlertContext();
  const [client, setClient] = useState<Client | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (
      timeRemaining > 0 &&
      currentPlayer !== null &&
      currentPlayer === playerSymbol
    ) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, currentPlayer, playerSymbol]);

  useEffect(() => {
    async function fetchData() {
      const loginToken = GetLoginCookie();
      if (!loginToken) {
        return;
      }
      const data = await fetch(`/api/v1/auth/verify`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${loginToken}`,
        },
        credentials: "include",
      });

      const userTemp: UserProfile = await data.json();
      setUser(userTemp);

      const res = await fetch(`/api/v1/liveGameById/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${loginToken}`,
        },
      });
      if (!res.ok) {
        router.push("/online");
        return;
      }
      const livegame: LiveGame = await res.json();
      if (livegame.finished) {
        router.push("/online");
        return;
      }
      setBoard(livegame.board);
      setRanked(livegame.matchmakingType === "ranked");
      setCurrentPlayer(
        livegame.board.flat().filter((cell) => cell === "X").length ===
          livegame.board.flat().filter((cell) => cell === "O").length
          ? "X"
          : "O"
      );
      if (livegame.playerX.uuid === userTemp.uuid) {
        setPlayerSymbol("X");
        setXPlayer(livegame.playerX.uuid);
        setOPlayer(livegame.playerO.uuid);
        setOpponent(livegame.playerO);
        setTimeRemaining(livegame.playerXTime);
      } else {
        setPlayerSymbol("O");
        setXPlayer(livegame.playerX.uuid);
        setOPlayer(livegame.playerO.uuid);
        setOpponent(livegame.playerX);
        setTimeRemaining(livegame.playerOTime);
      }
    }
    fetchData();
  }, [gameId]);

  useEffect(() => {
    const token = GetLoginCookie() || "";
    const stompClient = new Client({
      webSocketFactory: () =>
        new WebSocket("wss://1f1362ea.app.deploy.tourde.app/app/handshake"),
      connectHeaders: {
        Authorization: token,
      },
      debug: (msg) => console.log("STOMP:", msg),
      onConnect: () => {
        stompClient.subscribe("/user/queue/game-updates", async (message) => {
          console.log(message);
          const data = JSON.parse(message.body);
          const response = data.body;

          if (response.type === "End") {
            setWinner(response.message as "X" | "O" | "Draw");

            const res = await fetch(`/api/v1/liveGameById/${gameId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            });
            if (res.ok) {
              const livegame: LiveGame = await res.json();
              const { winner, winningLine } = checkWinner(livegame.board);
              setWinLane(winningLine);
              setGameResult({
                winner: response.message,
                playerEloChange:
                  playerSymbol === "X"
                    ? livegame.playerXEloAfter - livegame.playerXEloBefore
                    : livegame.playerOEloAfter - livegame.playerOEloBefore,

                opponentEloChange:
                  playerSymbol === "O"
                    ? livegame.playerXEloAfter - livegame.playerXEloBefore
                    : livegame.playerOEloAfter - livegame.playerOEloBefore,

                playerTimeRemaining:
                  playerSymbol === "X"
                    ? livegame.playerXTime
                    : livegame.playerOTime,
                opponentTimeRemaining:
                  playerSymbol === "O"
                    ? livegame.playerXTime
                    : livegame.playerOTime,
              });
              setShowWinDialog(true);
            }
          } else if (response.type === "Update") {
            const res = await fetch(`/api/v1/liveGameById/${gameId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            });
            if (res.ok) {
              const livegame: LiveGame = await res.json();
              setBoard(livegame.board);
              setTimeRemaining(
                playerSymbol === "X"
                  ? livegame.playerXTime
                  : livegame.playerOTime
              );
              setCurrentPlayer(
                livegame.board.flat().filter((cell) => cell === "X").length ===
                  livegame.board.flat().filter((cell) => cell === "O").length
                  ? "X"
                  : "O"
              );
            }
          } else if (response.type === "Draw") {
            setShowDrawDialog(true);
          }
        });
      },
      onStompError: (error) => {
        console.log(error);
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
    if (!client) {
      return;
    }
    if (board[rowIndex][colIndex] !== "" || winner || !client.active) {
      return;
    }

    if (currentPlayer !== playerSymbol) {
      return;
    }

    try {
      client.publish({
        destination: "/app/ws/makeMove",
        body: JSON.stringify({
          x: colIndex,
          y: rowIndex,
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log(error);
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
                  className="text-2xl md:text-xl py-4 flex items-center text-center text-darkshade"
                  style={{
                    width: boardRef.current?.offsetWidth,
                    minWidth: boardRef.current?.offsetWidth,
                  }}
                >
                  <span className="text-left w-[42%] flex-row flex items-center text-xl md:text-lg align-middle gap-2">
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
                  <span className="text-right w-[42%] flex-row flex text-xl md:text-lg items-center justify-end align-middle gap-2">
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
                          {TranslateText("GAME_TYPE", language)}
                        </span>
                        {ranked ? (
                          <span>{TranslateText("RANKED", language)}</span>
                        ) : (
                          <span>{TranslateText("UNRANKED", language)}</span>
                        )}
                      </div>
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
                        {currentPlayer === "X" ? (
                          <img
                            className="w-[10%] h-[10%]"
                            src="/icons/X_cervene.svg"
                          />
                        ) : currentPlayer === "O" ? (
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
                              timeRemaining < 60
                                ? "text-defaultred"
                                : "text-darkshade"
                            }`}
                          >
                            {Math.floor(timeRemaining / 60 / 1000)}:
                            {((timeRemaining / 1000) % 60)
                              .toString()
                              .padStart(2, "0")}
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
                      width: "min(95vw, 70vh)",
                      height: "min(95vw, 70vh)",
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
                        src={byteArrayToImageUrl(opponent?.profilePicture)}
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
                    <div className="flex flex-col items-center space-y-1">
                      <Button
                        className="w-full mt-4 bg-defaultblue hover:bg-darkerblue"
                        onClick={async () => {
                          const data = await fetch("/api/v1/draw", {
                            headers: {
                              Authorization: GetLoginCookie() || "",
                            },
                          });
                          if (!data.ok) {
                            updateErrorMessage(
                              TranslateText("DRAW_ERROR", language)
                            );
                          }
                        }}
                      >
                        <HandshakeIcon className="mr-2 h-4 w-4" />
                        {TranslateText("OFFER_DRAW", language)}
                      </Button>
                      <Button
                        className="w-full mt-4 bg-defaultred hover:bg-red-700"
                        onClick={async () => {
                          const data = await fetch("/api/v1/surrender", {
                            headers: {
                              Authorization: GetLoginCookie() || "",
                            },
                          });
                          if (!data.ok) {
                            updateErrorMessage(
                              TranslateText("SURRENDER_ERROR", language)
                            );
                          }
                        }}
                      >
                        <FlagIcon className="mr-2 h-4 w-4" />
                        {TranslateText("SURRENDER", language)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        {showDrawDialog && (
          <Dialog open={showDrawDialog} onOpenChange={setShowDrawDialog}>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="bg-white border-2 border-darkshade shadow-darkshade shadow-md [&>button]:hidden text-black font-dosis-bold"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-dosis-bold text-center">
                  {TranslateText("DRAW_REQUEST", language)}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4 text-center text-lg">
                <p>
                  {opponent?.username}{" "}
                  {TranslateText("IS_REQUESTING_DRAW", language)}
                </p>
              </div>
              <DialogFooter>
                <Button
                  className="w-full bg-defaultblue hover:bg-darkerblue text-lg"
                  onClick={async () => {
                    const data = await fetch("/api/v1/draw", {
                      headers: {
                        Authorization: GetLoginCookie() || "",
                      },
                    });
                    if (!data.ok) {
                      updateErrorMessage(TranslateText("DRAW_ERROR", language));
                    }
                    setShowDrawDialog(false);
                  }}
                >
                  {TranslateText("ACCEPT", language)}
                </Button>
                <Button
                  className="w-full bg-defaultred hover:bg-red-700 text-lg"
                  onClick={async () => {
                    const data = await fetch("/api/v1/decline", {
                      headers: {
                        Authorization: GetLoginCookie() || "",
                      },
                    });
                    if (!data.ok) {
                      updateErrorMessage(TranslateText("DRAW_ERROR", language));
                    }
                    setShowDrawDialog(false);
                  }}
                >
                  {TranslateText("DECLINE", language)}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {showWinDialog && gameResult && (
          <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="bg-white border-2 border-darkshade shadow-darkshade shadow-md [&>button]:hidden text-black font-dosis-bold"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-dosis-bold text-center">
                  {gameResult.winner === "draw"
                    ? TranslateText("GAME_DRAW", language)
                    : gameResult.winner === playerSymbol
                    ? TranslateText("YOU_WON", language)
                    : TranslateText("YOU_LOST", language)}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="text-center">
                  <div className="font-dosis-bold text-lg">
                    {user?.username}
                  </div>
                  <div className="flex justify-center my-2">
                    {playerSymbol === "X" ? (
                      <img className="w-8 h-8" src="/icons/X_cervene.svg" />
                    ) : (
                      <img className="w-8 h-8" src="/icons/O_modre.svg" />
                    )}
                  </div>
                  <div
                    className={`text-lg ${
                      gameResult.playerEloChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {gameResult.playerEloChange >= 0 ? "+" : ""}
                    {gameResult.playerEloChange} ELO
                  </div>
                  <div className="text-darkshade mt-2">
                    {formatTime(gameResult.playerTimeRemaining)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-dosis-bold text-lg">
                    {opponent?.username}
                  </div>
                  <div className="flex justify-center my-2">
                    {playerSymbol === "X" ? (
                      <img className="w-8 h-8" src="/icons/O_modre.svg" />
                    ) : (
                      <img className="w-8 h-8" src="/icons/X_cervene.svg" />
                    )}
                  </div>
                  <div
                    className={`text-lg ${
                      gameResult.opponentEloChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {gameResult.opponentEloChange >= 0 ? "+" : ""}
                    {gameResult.opponentEloChange} ELO
                  </div>
                  <div className="text-darkshade mt-2">
                    {Math.floor(gameResult.opponentTimeRemaining / 1000)}:
                    {Math.round(gameResult.opponentTimeRemaining % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="w-full bg-defaultblue hover:bg-darkerblue text-lg"
                  onClick={() => {
                    router.push("/online");
                  }}
                >
                  {TranslateText("BACK_TO_ONLINE", language)}
                </Button>
                <Button
                  className="w-full bg-defaultred hover:bg-red-700 text-lg"
                  onClick={() => {
                    setShowWinDialog(false);
                  }}
                >
                  {TranslateText("CLOSE", language)}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </>
  );
}
