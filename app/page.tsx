"use client";

import { useState } from "react";
// @ts-ignore
import { Hand } from "pokersolver";

type Suit = "s" | "h" | "d" | "c";
type Card = {
  suit: Suit;
  value: string;
  code: string;
};

const SUITS: { suit: Suit; symbol: string; color: string; label: string }[] = [
  { suit: "s", symbol: "♠", color: "text-gray-900", label: "スペード" },
  { suit: "h", symbol: "♥", color: "text-red-600", label: "ハート" },
  { suit: "d", symbol: "♦", color: "text-cyan-500", label: "ダイヤ" },
  { suit: "c", symbol: "♣", color: "text-emerald-600", label: "クローバー" },
];

const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const createAndShuffleDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const s of SUITS) {
    for (const v of VALUES) {
      const solverValue = v === "10" ? "T" : v;
      deck.push({
        suit: s.suit,
        value: v,
        code: `${solverValue}${s.suit}`,
      });
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

type PlayerResult = {
  id: number;
  name: string;
  hand: Card[];
  solvedHand: any;
  bestHandName: string;
};

export default function PokerApp() {
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [players, setPlayers] = useState<PlayerResult[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [winnerIds, setWinnerIds] = useState<number[]>([]);

  const dealCards = () => {
    const deck = createAndShuffleDeck();
    const comms = deck.slice(0, 5);
    let currentIndex = 5;

    const playerNames = ["あなた", "プレイヤー2", "プレイヤー3", "プレイヤー4", "プレイヤー5", "プレイヤー6", "プレイヤー7", "プレイヤー8"];

    const newPlayers: PlayerResult[] = [];
    const solvedHandsList: any[] = [];

    for (let i = 0; i < 8; i++) {
      const playerCards = [deck[currentIndex], deck[currentIndex + 1]];
      currentIndex += 2;

      const allCardsCodes = [...playerCards.map((c) => c.code), ...comms.map((c) => c.code)];
      const solvedHand = Hand.solve(allCardsCodes);
      solvedHandsList.push(solvedHand);

      newPlayers.push({
        id: i + 1,
        name: playerNames[i],
        hand: playerCards,
        solvedHand: solvedHand,
        bestHandName: solvedHand.descr,
      });
    }

    const winners = Hand.winners(solvedHandsList);
    const winningIds = newPlayers.filter((p) => winners.includes(p.solvedHand)).map((p) => p.id);

    setCommunityCards(comms);
    setPlayers(newPlayers);
    setWinnerIds(winningIds);
    setHasStarted(true);
  };

  const getPlayer = (index: number) => players[index] || { id: 0, name: "", hand: [], solvedHand: null, bestHandName: "" };

  return (
    // justify-start と pt-4 に変更して画面全体を上に持ち上げ

    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-start pt-2 p-4">
      <h1 className="text-2xl font-bold mb-4 tracking-wider">TEXAS HOLD'EM POKER</h1>

      {/* 紺色のポーカーテーブル */}
      <div className="relative w-full max-w-5xl h-[680px] bg-blue-950 border-[12px] border-amber-800 rounded-[200px] shadow-2xl flex flex-col justify-between p-8">
        {/* 上部プレイヤー (プレイヤー5を右に、プレイヤー6を左にずらす調整) */}
        <div className="flex justify-between px-[180px] z-10">
          <div className="translate-x-12">{hasStarted && <PlayerSeat player={players[4]} isWinner={winnerIds.includes(players[4].id)} />}</div>
          <div className="-translate-x-12">{hasStarted && <PlayerSeat player={players[5]} isWinner={winnerIds.includes(players[5].id)} />}</div>
        </div>

        {/* 中間エリア (左2人、中央場札、右2人) */}
        <div className="flex w-full items-center justify-between z-10 px-4">
          {/* 左側プレイヤー (プレイヤー3, 4) */}
          <div className="flex flex-col gap-5">{hasStarted && [2, 3].map((idx) => <PlayerSeat key={players[idx].id} player={players[idx]} isWinner={winnerIds.includes(players[idx].id)} />)}</div>

          {/* 中央：場札 ＆ シャッフルボタン */}
          <div className="flex flex-col items-center bg-blue-900/60 p-6 rounded-2xl border border-blue-700/50 shadow-inner">
            <h2 className="text-sm font-semibold mb-3 text-blue-200 tracking-wide">コミュニティカード (場札 5枚)</h2>
            <div className="flex gap-2.5 mb-6">
              {hasStarted
                ? communityCards.map((card, idx) => <CardView key={idx} card={card} />)
                : Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="w-[72px] h-28 bg-blue-900/40 border-2 border-dashed border-blue-700 rounded-lg flex items-center justify-center text-blue-400 text-sm">
                      ?
                    </div>
                  ))}
            </div>

            <button onClick={dealCards} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-8 rounded-full shadow-lg transition duration-200 text-base tracking-wider cursor-pointer active:scale-95">
              {hasStarted ? "シャッフルして再配布" : "カードを配る"}
            </button>
          </div>

          {/* 右側プレイヤー (プレイヤー7, 8) */}
          <div className="flex flex-col gap-5">{hasStarted && [6, 7].map((idx) => <PlayerSeat key={players[idx].id} player={players[idx]} isWinner={winnerIds.includes(players[idx].id)} />)}</div>
        </div>

        {/* 下部プレイヤー (あなたを右に、プレイヤー2を左にずらす調整) */}
        <div className="flex justify-between px-[180px] z-10">
          <div className="flex items-center translate-x-12">{hasStarted && <PlayerSeat player={getPlayer(0)} isSelf={true} isWinner={winnerIds.includes(getPlayer(0).id)} />}</div>
          <div className="flex items-center -translate-x-12">{hasStarted && <PlayerSeat player={getPlayer(1)} isWinner={winnerIds.includes(getPlayer(1).id)} />}</div>
        </div>
      </div>
    </main>
  );
}

function PlayerSeat({ player, isSelf = false, isWinner = false }: { player: PlayerResult; isSelf?: boolean; isWinner?: boolean }) {
  return (
    <div className={`bg-slate-900/90 border ${isSelf ? "border-amber-500 ring-2 ring-amber-500/30" : "border-blue-800"} p-2.5 rounded-xl flex flex-col items-center shadow-md min-w-[190px]`}>
      <div className="flex justify-between w-full text-sm mb-1 font-bold px-1">
        <span className={isSelf ? "text-amber-400" : "text-slate-200"}>{player.name}</span>
        {/* point: animate-pulse を削除して点灯表示に */}
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

function CardView({ card, small = false }: { card: Card; small?: boolean }) {
  const suitObj = SUITS.find((s) => s.suit === card.suit);

  const sizeClass = small ? "w-14 h-20" : "w-[76px] h-32";
  const suitSize = small ? "text-[2.6rem]" : "text-[3.8rem]";
  const valueSize = small ? "text-[2rem]" : "text-[2.8rem]";

  return (
    // justify-center を justify-evenly に変更し、上下の余白を均等にする
    <div className={`bg-white rounded-lg shadow-md flex flex-col items-center justify-evenly font-extrabold ${suitObj?.color} ${sizeClass} select-none py-1`}>
      <div className={`w-full text-center ${suitSize} leading-none flex items-center justify-center`}>{suitObj?.symbol}</div>
      <div className={`w-full text-center ${valueSize} leading-none tracking-tighter flex items-center justify-center`}>{card.value}</div>
    </div>
  );
}
