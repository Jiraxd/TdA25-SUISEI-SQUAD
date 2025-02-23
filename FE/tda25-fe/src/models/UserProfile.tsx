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
  profilePicture?: string; // URL to profile picture, optional with default
  banned: boolean;
  admin: boolean;
};

export const DEFAULT_PROFILE_PICTURE = "/images/placeholder-avatar.png";

export function getNameColor(user: UserProfile | null): string {
  return user?.nameColor || "#AB2E58";
}

export function getProfilePicture(user: UserProfile): string {
  return user.profilePicture || DEFAULT_PROFILE_PICTURE;
}
