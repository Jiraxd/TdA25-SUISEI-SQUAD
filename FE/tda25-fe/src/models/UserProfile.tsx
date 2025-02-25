export type UserProfile = {
  uuid: string;
  createdAt: Date;
  username: string;
  email: string;
  elo: number;
  wins: number;
  draws: number;
  losses: number;
  nameColor?: string; // HEX
  banned: boolean;
  admin: boolean;
};

export const DEFAULT_PROFILE_PICTURE = "/images/placeholder-avatar.png";

export function getNameColor(user: UserProfile | null): string {
  return user?.nameColor || "#AB2E58";
}
