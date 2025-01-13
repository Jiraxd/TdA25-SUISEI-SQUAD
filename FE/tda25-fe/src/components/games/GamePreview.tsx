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
        fontFamily: "var(--font-dosis-bold)",
      }}
    >
      {board.flat().map((cell, index) => (
        <div
          key={index}
          className="flex items-center justify-center text-center aspect-square w-[16px] h-[16px] overflow-hidden"
          style={{
            backgroundColor: "var(--whitelessbright)",
            borderColor: "var(--darkshade)",
            borderWidth: "1px",
          }}
        >
          {cell && (
            <span
              className="text-sm"
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
