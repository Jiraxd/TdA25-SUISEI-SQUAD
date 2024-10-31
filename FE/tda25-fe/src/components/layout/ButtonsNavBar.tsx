import Image from "next/image";

export const ButtonsNavBar = () => {
  return (
    <>
      <button className="flex flex-row mr-20 p-6 items-center">
        <Image
          src="/icons/zarivka_idea_bile.svg"
          alt="puzzle_logo"
          className="w-12 h-12"
        />
        <div className="text_bold ml-2">{"Úlohy"}</div>
      </button>
      <button className="flex flex-row mr-20 p-6 items-center">
        <Image
          src="/icons/zarivka_playing_bile.svg"
          alt="Play_logo"
          className="w-12 h-12"
        />
        <div className="text_bold ml-2">{"Hrát"}</div>
      </button>
    </>
  );
};
