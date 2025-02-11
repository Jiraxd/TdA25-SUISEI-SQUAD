export type User = {
  uuid: string;
  createdAt: Date;
  username: string;
  email: string;
  elo: number;
  wins: number;
  draws: number;
  losses: number;
  profilePicture?: string; // URL to profile picture, optional with default
};

export const DEFAULT_PROFILE_PICTURE = "/images/placeholder-avatar.png";

export function getProfilePicture(user: User): string {
  return user.profilePicture || DEFAULT_PROFILE_PICTURE;
}
