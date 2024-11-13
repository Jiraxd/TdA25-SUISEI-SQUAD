interface GamePreviewProps {
  board: string[][];
}

export function GamePreview({ board }: GamePreviewProps) {
  return (
    <div
      className="grid grid-cols-15 gap-px aspect-square border-2 max-w-[240px] max-h-[240px] w-full"
      style={{
        backgroundColor: "var(--darkshade)",
        borderColor: "var(--darkshade)",
      }}
    >
      {board.flat().map((cell, index) => (
        <div
          key={index}
          className="flex items-center justify-center aspect-square w-[14px] h-[14px] overflow-hidden"
          style={{
            backgroundColor: "var(--whitelessbright)",
          }}
        >
          {cell && (
            <span
              className="text-[0.6rem] font-bold"
              style={{
                color:
                  cell === "X" ? "var(--defaultred)" : "var(--defaultblue)",
                backgroundColor: "var(--whitelessbright)",
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
