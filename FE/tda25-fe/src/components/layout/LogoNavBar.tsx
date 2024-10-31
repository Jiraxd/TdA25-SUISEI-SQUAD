import Image from "next/image";

export const LogoNavBar = () => {
  return (
    <>
      <button className="flex flex-row p-6 items-center">
        <div>
          <Image
            src="/logos/Think-different-Academy_LOGO_oficialni-bile.svg"
            alt="Logo"
            className="w-60 h-30 p-6"
          />
        </div>
        <div className="text-3xl font-bold">{"| Piškvorky"}</div>
      </button>
    </>
  );
};
