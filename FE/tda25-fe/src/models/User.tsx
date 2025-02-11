export type User = {
  uuid: string;
  createdAt: Date;
  username: string;
  email: string;
  elo: number;
  wins: number;
  draws: number;
  losses: number;
  nameColor?: string; // HEX
  profilePicture?: string; // URL to profile picture, optional with default
};

export const DEFAULT_PROFILE_PICTURE = "/images/placeholder-avatar.png";

export function getNameColor(user: User | null): string {
  return user?.nameColor || "#AB2E58";
}

export function getProfilePicture(user: User): string {
  return user.profilePicture || DEFAULT_PROFILE_PICTURE;
}
