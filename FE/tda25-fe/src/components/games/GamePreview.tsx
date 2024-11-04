interface GamePreviewProps {
  board: string[][];
}

export function GamePreview({ board }: GamePreviewProps) {
  return (
    <div className="grid grid-cols-15 gap-px bg-gray-400 w-full aspect-square max-w-[240px]">
      {board.flat().map((cell, index) => (
        <div
          key={index}
          className="bg-gray-500 flex items-center justify-center aspect-square max-w-[14px] min-w-[14px]  max-h-[14px] min-h-[14px]"
        >
          {cell && (
            <span
              className={`text-[0.5rem] sm:text-xs font-bold `}
              style={{
                color:
                  cell === "X" ? "var(--defaultred)" : "var(--defaultblue)",
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
