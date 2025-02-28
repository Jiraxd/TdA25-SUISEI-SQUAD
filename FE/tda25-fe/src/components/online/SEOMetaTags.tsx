"use client";

import { useLanguage } from "@/components/languageContext";
import { TranslateText } from "@/lib/utils";
import { UserProfile } from "@/models/UserProfile";

type MetaTagsType = "onlineGame" | "online" | "profile";

interface SEOMetaTagsProps {
  type: MetaTagsType;

  baseUrl?: string;

  opponent?: UserProfile | null;
  gameId?: string;
  isPrivateGame?: boolean;
  ranked?: boolean;

  profileOwner?: UserProfile | null;
  profileId?: string;
}

export default function SEOMetaTags({
  type,
  baseUrl = "https://1f1362ea.app.deploy.tourde.app",
  opponent = null,
  gameId = "",
  isPrivateGame = false,
  ranked = false,
  profileOwner = null,
  profileId = "",
}: SEOMetaTagsProps) {
  const { language } = useLanguage();

  const imageUrl = `${baseUrl}${
    type === "onlineGame"
      ? "/icons/zarivka_playing_modre.svg"
      : type === "online"
      ? "/logos/Think-different-Academy_LOGO_erb.svg"
      : "/images/placeholder-avatar.png"
  }`;

  const canonicalUrl = `${baseUrl}${
    type === "onlineGame"
      ? `/onlineGame/${gameId}`
      : type === "profile"
      ? `/profile/${profileId}`
      : "/online"
  }`;

  const title = `${TranslateText(
    `${type.toUpperCase()}_PAGE_TITLE`,
    language
  )}${
    type === "onlineGame" && opponent?.username
      ? ` | vs ${opponent.username}`
      : type === "profile" && profileOwner?.username
      ? ` | ${profileOwner.username}`
      : ""
  }`;

  const description =
    type === "onlineGame"
      ? `${TranslateText("ONLINE_GAME_META_DESCRIPTION", language)}${
          opponent?.username ? ` vs ${opponent.username}` : ""
        }`
      : type === "profile" && profileOwner
      ? `${TranslateText("PROFILE_META_DESCRIPTION_PREFIX", language)} ${
          profileOwner.username
        }. ${TranslateText("PROFILE_META_DESCRIPTION_STATS", language)}.`
      : TranslateText(`${type.toUpperCase()}_LOBBY_META_DESCRIPTION`, language);

  const keywords = TranslateText(
    `${type.toUpperCase()}_META_KEYWORDS`,
    language
  );

  const gameTypeText = isPrivateGame
    ? TranslateText("PRIVATE_GAME", language)
    : ranked
    ? TranslateText("RANKED_MATCH", language)
    : TranslateText("FRIENDLY_MATCH", language);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:type"
        content={type === "profile" ? "profile" : "website"}
      />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Gomoku Online" />

      {type === "onlineGame" && (
        <>
          <meta property="og:game:type" content={gameTypeText} />
          {opponent && (
            <>
              <meta property="og:game:opponent" content={opponent.username} />
              {opponent.elo && (
                <meta
                  property="og:game:opponent:elo"
                  content={opponent.elo.toString()}
                />
              )}
            </>
          )}
        </>
      )}

      {type === "profile" && profileOwner && (
        <>
          <meta
            property="og:profile:username"
            content={profileOwner.username}
          />
          {profileOwner.elo && (
            <meta
              property="og:profile:elo"
              content={profileOwner.elo.toString()}
            />
          )}
          <meta
            property="og:profile:stats"
            content={`${TranslateText("ELO", language)}: ${
              profileOwner.elo || 0
            }, ${TranslateText("WINS", language)}: ${
              profileOwner.wins || 0
            }, ${TranslateText("LOSSES", language)}: ${
              profileOwner.losses || 0
            }`}
          />
        </>
      )}

      <meta name="theme-color" content="#4B7BEC" />

      <link rel="canonical" href={canonicalUrl} />
    </>
  );
}
