import { UserProfile } from "./UserProfile";

export type LiveGame = {
  uuid: string;
  board: Array<Array<"X" | "O" | "">>;
  matchmakingTyps: "ranked" | "unranked";
  playerX: UserProfile;
  playerO: UserProfile;
  playerXTime: number;
  playerOTime: number;
  playerOEloBefore: number;
  playerOEloAfter: number;
  playerXEloBefore: number;
  playerXEloAfter: number;
  finished: boolean;
  createdAt: Date;
};
