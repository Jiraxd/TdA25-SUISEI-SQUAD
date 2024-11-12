interface GamePreviewProps {
  board: string[][];
}

export function GamePreview({ board }: GamePreviewProps) {
  return (
    <div
      className="grid grid-cols-15 gap-px  w-full aspect-square max-w-[240px]"
      style={{
        backgroundColor: "var(--whitelessbright)",
      }}
    >
      {board.flat().map((cell, index) => (
        <div
          key={index}
          className=" flex items-center justify-center aspect-square max-w-[15px] min-w-[15px]  max-h-[145x] min-h-[15px]"
          style={{
            backgroundColor: "var(--darkshade)",
          }}
        >
          {cell && (
            <span
              className={`text-[0.6rem] font-bold `}
              style={{
                color:
                  cell === "X" ? "var(--defaultred)" : "var(--defaultblue)",
                backgroundColor: "var(--darkshade)",
              }}
            >
              {cell}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
