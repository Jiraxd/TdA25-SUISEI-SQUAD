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

export const Difficulties = ["BEGINNER", "EASY", "MEDIUM", "HARD", "EXTREME"];

export const DateModifiedSearchOptions = ["NONE", "24h", "7d", "1mo", "3mo"];

const translationsCZ: Record<string, string> = {
  BEGINNER: "Začátečnická",
  MEDIUM: "Střední",
  HARD: "Těžká",
  EXTREME: "Extrémní",
  EASY: "Jednoduché",
  CZ: "Čeština | Czech",
  EN: "Angličtina | English",
  PUZZLES: "Úlohy",
  PLAY: "Hrát",
  HOME: "Piškvorky",
  PAGE: "Stránka",
  OF: "z",
  PUZZLES_TO_SOLVE: "Úlohy k vyřešení",
  SCROLL_LEARN: "↓ Scrollni dolů pro více infomací ↓",
  WELCOME: "Vítej na Piškvorkách!",
  HOW_TO_PLAY:
    "Piškvorky jsou jednoduchá hra, ve které se dva hráči střídají v označování X a O na mřížce 15x15 (standartně 3x3). První hráč, který získá pět (standartně tři) svých označení v řadě (horizontálně, vertikálně nebo diagonálně), vyhrává hru.",
  HOW_TO_PLAY_TITLE: "Jak hrát?",
  WHY_PLAY: "Proč hrát piškvorky?",
  WHY_PLAY_LIST:
    "Zlepšují strategické myšlení;Zvyšují schopnost řešit problémy;Perfektní pro rychlé hry s přáteli;Snadné se naučit, téžké plně ovládnout",
  WINNER: "Hru vyhrává hráč ",
  TURN: "Nyní hraje hráč: ",
  LAST_UPDATE: "Poslední aktualizace: ",
  CREATED: "Vytvořeno: ",
  STATE: "Stav hry: ",
  GAME_INFO: "Informace o hře",
  HISTORY: "Historie hry",
  SAVE_GAME: "Uložit hru",
  NEW_GAME: "Nová hra",
  NAME: "Jméno hry",
  DIFFICULTY: "Obtížnost",
  UNKNOWN: "Neznámý",
  OPENING: "Zahájení",
  MIDGAME: "Rozehráno",
  ENDGAME: "Koncovka",
  UPDATE_GAME: "Upravit hru",
  DELETE_GAME: "Smazat hru",
  SAVE_GAME_NEW: "Uložit jako novou hru",
  ERROR_FETCH: "Chyba při načítání her, zkuste to znovu",
  ERROR_SAVE: "Chyba při ukládání hry, zkontrolujte zadané hodnoty",
  ERROR_UPDATE: "Chyba při aktualizaci hry, zkontrolujte zadané hodnoty",
  ERROR_DELETE: "Chyba při mazání hry, zkuste to znovu",
  HOME_PAGE: "Domovská stránka",
  SUCCESS_UPDATE: "Hra byla úspěšně aktualizována",
  NEW_GAME_EXISTING: "Znovu hrát úlohu",
  CHANGE_PLAYER: "Změnit hráče",
  TURN_EDIT: "Vybraný hráč: ",
  EMPTY: "Prázdné",
  SEARCH: "Zadejte název hry...",
  SEARCH_BTN: "Vyhledej hru",
  SEARCH_OPTIONS_DIFFICULTY: "Vyhledej hru podle obtížnosti",
  SEARCH_OPTIONS_DATE: "Vyhledej hru podle data poslední úpravy",
  NONE: "Žádné",
  "24h": "Posledních 24 hodin",
  "7d": "Posledních 7 dní",
  "1mo": "Poslední měsíc",
  "3mo": "Poslední 3 měsíce",
};

const translationsEN: Record<string, string> = {
  BEGINNER: "Beginner",
  MEDIUM: "Medium",
  HARD: "Hard",
  EXTREME: "Extreme",
  EASY: "Easy",
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
  WINNER: "The winner is player ",
  TURN: "Current player: ",
  LAST_UPDATE: "Last update: ",
  CREATED: "Created: ",
  STATE: "Game State: ",
  GAME_INFO: "Game Information",
  HISTORY: "Game History",
  SAVE_GAME: "Save Game",
  NEW_GAME: "New Game",
  NAME: "Game Name",
  DIFFICULTY: "Difficulty",
  UNKNOWN: "Unknown",
  OPENING: "Opening",
  MIDGAME: "Mid-game",
  ENDGAME: "End-game",
  UPDATE_GAME: "Update Game",
  DELETE_GAME: "Delete Game",
  SAVE_GAME_NEW: "Save Game as New",
  ERROR_FETCH: "Error fetching games, please try again",
  ERROR_SAVE: "Error saving game, check the entered values and try again",
  ERROR_UPDATE: "Error updating game, check the entered values and try again",
  ERROR_DELETE: "Error deleting game, please try again",
  HOME_PAGE: "Home",
  SUCCESS_UPDATE: "Game was successfully updated",
  NEW_GAME_EXISTING: "Play puzzle again",
  CHANGE_PLAYER: "Change player",
  TURN_EDIT: "Selected player: ",
  EMPTY: "Empty",
  SEARCH: "Enter game name...",
  SEARCH_BTN: "Search for game",
  SEARCH_OPTIONS_DIFFICULTY: "Search by difficulty",
  SEARCH_OPTIONS_DATE: "Search by date modified",
  NONE: "None",
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "1mo": "Last month",
  "3mo": "Last 3 months",
};
