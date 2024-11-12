import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type language = "EN" | "CZ";

export function TranslateText(text: string, lang: language): string {
  if (lang === "EN") {
    return translationsEN[text] || `Translation not found for '${text}'`;
  } else if (lang === "CZ") {
    return translationsCZ[text] || `Translation not found for '${text}'`;
  } else {
    return `Unsupported language: '${lang}'`;
  }
}

const translationsCZ: Record<string, string> = {
  easy: "Jednoduché",
  CZ: "Čeština | Czech",
  EN: "Angličtina | English",
  PUZZLES: "Úlohy",
  PLAY: "Hrát",
  HOME: "Piškvorky",
  PAGE: "Stránka",
  OF: "z",
  PUZZLES_TO_SOLVE: "Úlohy k vyřešení",
  SCROLL_LEARN: "↓ Scrollni dolů pro více infomací ↓",
  WELCOME: "Vítej na Píškvorkách!",
  HOW_TO_PLAY:
    "Piškvorky jsou jednoduchá hra, ve které se dva hráči střídají v označování X a O na mřížce 15x15 (standartně 3x3). První hráč, který získá pět (standartně tři) svých označení v řadě (horizontálně, vertikálně nebo diagonálně), vyhrává hru.",
  HOW_TO_PLAY_TITLE: "Jak hrát?",
  WHY_PLAY: "Proč hrát piškvorky?",
  WHY_PLAY_LIST:
    "Zlepšuje strategické myšlení;Zvyšuje schopnosti řešit problémy;Perfektní pro rychlé hry s přáteli;Snadné se naučit, zábavné zvládnout",
};

const translationsEN: Record<string, string> = {
  easy: "Easy",
  CZ: "Czech | Čeština",
  EN: "English | Angličtina",
  PUZZLES: "Puzzles",
  PLAY: "Play",
  HOME: "TIC-TAC-TOE",
  PAGE: "Page",
  OF: "of",
  PUZZLES_TO_SOLVE: "Puzzles to solve",
  SCROLL_LEARN: "↓ Scroll to learn more ↓",
  WELCOME: "Welcome to Tic Tac Toe!",
  HOW_TO_PLAY:
    " Tic Tac Toe is a simple game where two players take turns marking X and O on a 15x15 (standard 3x3) grid. The first player to get five (standard three) of their marks in a row (horizontally, vertically, or diagonally) wins the game.",
  HOW_TO_PLAY_TITLE: "How to play?",
  WHY_PLAY: "Why Play Tic Tac Toe?",
  WHY_PLAY_LIST:
    "Improves strategic thinking;Enhances problem-solving skills;Perfect for quick games with friends;Easy to learn, fun to master",
};
