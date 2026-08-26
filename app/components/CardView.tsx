// app/components/CardView.tsx

type Suit = "s" | "h" | "d" | "c";

type Card = {
  suit: Suit;
  value: string;
  code: string;
};

// SUITSの定義をここに持ってくることで '../types' のインポートが不要になります
export const SUITS: { suit: Suit; symbol: string; color: string; label: string }[] = [
  { suit: "s", symbol: "♠", color: "text-gray-900", label: "スペード" },
  { suit: "h", symbol: "♥", color: "text-red-600", label: "ハート" },
  { suit: "d", symbol: "♦", color: "text-cyan-500", label: "ダイヤ" },
  { suit: "c", symbol: "♣", color: "text-emerald-600", label: "クローバー" },
];

export function CardView({ card, small = false }: { card: Card; small?: boolean }) {
  const suitObj = SUITS.find((s) => s.suit === card.suit);

  const sizeClass = small ? "w-14 h-20" : "w-[76px] h-32";
  const suitSize = small ? "text-[2.6rem]" : "text-[3.8rem]";
  const valueSize = small ? "text-[2rem]" : "text-[2.8rem]";

  return (
    <div className={`bg-white rounded-lg shadow-md flex flex-col items-center justify-evenly font-extrabold ${suitObj?.color} ${sizeClass} select-none py-1`}>
      <div className={`w-full text-center ${suitSize} leading-none flex items-center justify-center`}>{suitObj?.symbol}</div>
      <div className={`w-full text-center ${valueSize} leading-none tracking-tighter flex items-center justify-center`}>{card.value}</div>
    </div>
  );
}
