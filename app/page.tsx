"use client";

import { useState } from "react";
// @ts-ignore
import { Hand } from "pokersolver";
import { CardView } from "./components/CardView";
import { PlayerSeat } from "./components/PlayerSeat";

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
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-start pt-2 p-4">
      <h1 className="text-2xl font-bold mb-4 tracking-wider">TEXAS HOLD'EM SIMULATOR</h1>

      {/* 紺色のポーカーテーブル */}
      <div className="relative w-full max-w-5xl h-[680px] bg-blue-950 border-[12px] border-amber-800 rounded-[200px] shadow-2xl flex flex-col justify-between p-8">
        {/* 上部プレイヤー */}
        <div className="flex justify-between px-[180px] z-10">
          <div className="translate-x-12">{hasStarted && <PlayerSeat player={players[4]} isWinner={winnerIds.includes(players[4].id)} />}</div>
          <div className="-translate-x-12">{hasStarted && <PlayerSeat player={players[5]} isWinner={winnerIds.includes(players[5].id)} />}</div>
        </div>

        {/* 中間エリア */}
        <div className="flex w-full items-center justify-between z-10 px-4">
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

          <div className="flex flex-col gap-5">{hasStarted && [6, 7].map((idx) => <PlayerSeat key={players[idx].id} player={players[idx]} isWinner={winnerIds.includes(players[idx].id)} />)}</div>
        </div>

        {/* 下部プレイヤー */}
        <div className="flex justify-between px-[180px] z-10">
          <div className="flex items-center translate-x-12">{hasStarted && <PlayerSeat player={getPlayer(0)} isSelf={true} isWinner={winnerIds.includes(getPlayer(0).id)} />}</div>
          <div className="flex items-center -translate-x-12">{hasStarted && <PlayerSeat player={getPlayer(1)} isWinner={winnerIds.includes(getPlayer(1).id)} />}</div>
        </div>
      </div>
    </main>
  );
}
