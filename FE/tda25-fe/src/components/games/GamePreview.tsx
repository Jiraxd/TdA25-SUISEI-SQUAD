interface GamePreviewProps {
  board: string[][];
}

export function GamePreview({ board }: GamePreviewProps) {
  return (
    <div
      className="grid grid-cols-15 aspect-square border-2 max-w-[240px] max-h-[240px] w-full"
      style={{
        backgroundColor: "var(--whitelessbright)",
        borderColor: "var(--darkshade)",
      }}
    >
      {board.flat().map((cell, index) => (
        <div
          key={index}
          className="flex items-center border-1 justify-center aspect-square w-[14px] h-[14px] overflow-hidden"
          style={{
            backgroundColor: "var(--whitelessbright)",
            borderColor: "var(--darkshade)"
          }}
        >
          {cell && (
            <span
              className="text-sm font-[family-name:var(--font-dosis-bold)]"
              style={{
                color:
                  cell.toUpperCase() === "X"
                    ? "var(--defaultred)"
                    : "var(--defaultblue)",
                backgroundColor: "var(--whitelessbright)",
              }}
            >
              {cell.toUpperCase()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
