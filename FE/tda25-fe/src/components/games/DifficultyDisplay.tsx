import Image from "next/image";

export default function DifficultyDisplay({
  difficulty,
}: {
  difficulty: string;
}) {
  switch (difficulty) {
    case "beginner":
      return (
        <Image
          src="/icons/zarivka_beginner_modre.svg"
          alt="beginner_difficulty"
          className="w-12 h-12"
          width={48}
          height={48}
        />
      );
    case "easy":
      return (
        <Image
          src="/icons/zarivka_easy_modre.svg"
          alt="easy_difficulty"
          className="w-12 h-12"
          width={48}
          height={48}
        />
      );
    case "medium":
      return (
        <Image
          src="/icons/zarivka_medium_modre.svg"
          alt="medium_difficulty"
          className="w-12 h-12"
          width={48}
          height={48}
        />
      );
    case "hard":
      return (
        <Image
          src="/icons/zarivka_hard_modra.svg"
          alt="hard_difficulty"
          className="w-12 h-12"
          width={48}
          height={48}
        />
      );
    case "extreme":
      return (
        <Image
          src="/icons/zarivka_extreme_modre.svg"
          alt="extreme_difficulty"
          className="w-12 h-12"
          width={48}
          height={48}
        />
      );
  }
  return <></>;
}
