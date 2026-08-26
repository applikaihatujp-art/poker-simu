// app/components/PlayerSeat.tsx
import { CardView } from "./CardView";

type Card = {
  suit: "s" | "h" | "d" | "c";
  value: string;
  code: string;
};

type PlayerResult = {
  id: number;
  name: string;
  hand: Card[];
  solvedHand: any;
  bestHandName: string;
};

export function PlayerSeat({ player, isSelf = false, isWinner = false }: { player: PlayerResult; isSelf?: boolean; isWinner?: boolean }) {
  return (
    <div className={`bg-slate-900/90 border ${isSelf ? "border-amber-500 ring-2 ring-amber-500/30" : "border-blue-800"} p-2.5 rounded-xl flex flex-col items-center shadow-md min-w-[190px]`}>
      <div className="flex justify-between w-full text-sm mb-1 font-bold px-1">
        <span className={isSelf ? "text-amber-400" : "text-slate-200"}>{player.name}</span>
        {isWinner && <span className="text-red-500 font-extrabold text-xs">👑 WINNER</span>}
      </div>
      <div className="flex gap-2 my-1">
        {player.hand.map((card, idx) => (
          <CardView key={idx} card={card} small />
        ))}
      </div>
      <div className={`text-lg font-extrabold mt-1 text-center truncate max-w-[180px] bg-blue-950/80 px-2 py-1 rounded w-full shadow-inner ${isWinner ? "text-red-500 ring-2 ring-red-500/50" : "text-cyan-300"}`}>{player.bestHandName}</div>
    </div>
  );
}
