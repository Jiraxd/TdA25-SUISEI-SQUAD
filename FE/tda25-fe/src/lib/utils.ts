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
  WHO_ARE_WE:
    "Think different Academy je nezisková organizace zaměřená na rozvoj myšlení studentů i široké veřejnosti.\n\nV současnosti vyvíjíme piškvorkovou platformu, která má digitalizovat piškvorky a poskytnout uživatelům atraktivní herní zážitek. Platforma nabídne prostor pro hraní klasických piškvorek ve formátu lokálního multiplayeru a také piškvorkové úlohy pro trénink a zlepšení herních dovedností.\n\nDo budoucna se plánujeme rozšířit do dalších logických her.",
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
  ERROR_SEARCH: "Nepodařilo se najít žádné hry podle zadaných kritérií",
  ERROR_START_NEW_GAME: "Hra je vyhraná!",
  ONLINE_PLAY: "Hrát online",
  PAGE_NOT_FOUND: "Tato stránka neexistuje :(",
  BACK_HOME: "Zpět na domovskou stránku",
  HOME_PAGE_TITLE: "Piškvorky",
  PAGE_NOT_FOUND_TITLE: "Piškvorky | 404",
  GAMES_PAGE_TITLE: "Piškvorky | Úlohy",
  GAME_PAGE_TITLE: "Piškvorky | Hra",
  EDIT_PAGE_TITLE: "Piškvorky | Úprava hry",
  COPYRIGHT: "Copyright",
  CONTACT: "Kontakt",
  TERMS_OF_USE: "Podmínky použití",
  PRIVACY_POLICY: "Ochrana osobních údajů",
  COPYRIGHT_TEXT:
    "© 2024 Think different Academy. Všechna práva vyhrazena. Tato platforma pro hraní piškvorek je chráněna autorským právem. Jakékoliv kopírování nebo reprodukce bez předchozího písemného souhlasu je zakázána.",
  CONTACT_TEXT:
    "Pro jakékoliv dotazy nás můžete kontaktovat na emailové adrese: tda@scg.cz\n\nAdresa:\nThink different Academy\nKřenová 89/19\n612 00 Brno",
  TERMS_OF_USE_TEXT:
    "1. Souhlas s podmínkami\n" +
    "Používáním této aplikace souhlasíte s těmito podmínkami.\n\n" +
    "2. Pravidla použití\n" +
    "- Aplikaci používejte pouze k hraní piškvorek\n" +
    "- Nenarušujte bezpečnost aplikace\n" +
    "- Nepoužívejte automatizované systémy\n\n" +
    "3. Autorská práva\n" +
    "Obsah je chráněn autorským právem Think different Academy.\n\n" +
    "4. Odpovědnost\n" +
    "Aplikace je poskytována bez záruk.\n\n" +
    "5. Změny\n" +
    "Vyhrazujeme si právo na změny podmínek.",
  PRIVACY_POLICY_TEXT:
    "Ochrana vašich osobních údajů je pro nás prioritou. Shromažďujeme pouze nezbytné údaje pro fungování aplikace. Vaše data nejsou sdílena s třetími stranami a jsou zpracovávána v souladu s GDPR.",
  CREATE_ACCOUNT: "Vytvořit účet",
  PROFILE: "Profil",
  ACCOUNT_SETTINGS: "Nastavení účtu",
  GAME_HISTORY: "Historie her",
  LOG_OUT: "Odhlásit se",
  LOG_IN: "Přihlásit se",
  WELCOME_ONLINE: "Vítej v Online režimu!",
  ELO_RATING: "Tvé ELO hodnocení",
  NEXT_RANK: "Další úroveň",
  POINTS_NEEDED: "Potřebné ELO body do další úrovně",
  RANDOM_GAME: "Normální hra",
  RANKED_RANDOM_GAME: "Hodnocená hra",
  PRIVATE_GAME: "Soukromá hra",
  PROFILE_PLAYER: "Profil uživatele: ",
  SETTINGS: "Nastavení",
  LOGOUT: "Odhlásit se",
  ELO: "Aktuální hodnocení ELO",
  STATS: "Statistiky",
  JOINED: "Účet založen",
  GAMES_PLAYED: "Odehrané hry",
  WINRATE: "Poměr výher",
  CURRENT_RANK: "Aktuální úroveň",
  LOGIN_TITLE: "Přihlášení",
  REGISTER_TITLE: "Registrace",
  LOGIN: "Přihlásit se",
  EMAIL: "Email",
  PASSWORD: "Heslo",
  NO_ACCOUNT: "Nemáš ještě účet?",
  REGISTER: "Registrovat se",
  LOGIN_FAILED: "Přihlášení selhalo",
  GO_BACK: "Jít zpět",
  REGISTER_FAILED: "Registrace selhala",
  ONLINE_PAGE_TITLE: "Piškvorky | Online",
  USERNAME: "Uživatelské jméno",
  USERNAME_REQUIRED: "Uživatelské jméno je povinné.",
  USERNAME_TOO_LONG: "Uživatelské jméno musí mít maximálně 32 znaků.",
  PASSWORD_REQUIRED: "Heslo je povinné (Minimálně 8 znaků). ",
  INVALID_EMAIL: "Prosím zadej platnou emailovou adresu.",
  REGISTER_PAGE_TITLE: "Piškvorky | Registrace",
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
  WHO_ARE_WE:
    "Think Different Academy is a non-profit organization focused on developing thinking skills of students and the general public.\n\nCurrently, we are developing a Tic Tac Toe platform that aims to digitalize the game and provide users with an engaging gaming experience. The platform will offer space for playing classic Tic Tac Toe in local multiplayer format as well as Tic Tac Toe puzzles for training and improving gaming skills.\n\nIn the future, we plan to expand into other logic games.",
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
  ERROR_SEARCH: "Could not find any games according to the entered criteria",
  ERROR_START_NEW_GAME: "Game is already won!",
  ONLINE_PLAY: "Play online",
  PAGE_NOT_FOUND: "This page does not exist :(",
  BACK_HOME: "Back to home page",
  HOME_PAGE_TITLE: "Tic Tac Toe",
  PAGE_NOT_FOUND_TITLE: "Tic Tac Toe | 404",
  GAMES_PAGE_TITLE: "Tic Tac Toe | Puzzles",
  GAME_PAGE_TITLE: "Tic Tac Toe | Game",
  EDIT_PAGE_TITLE: "Tic Tac Toe | Edit Game",
  COPYRIGHT: "Copyright",
  CONTACT: "Contact",
  TERMS_OF_USE: "Terms of Use",
  PRIVACY_POLICY: "Privacy Policy",
  COPYRIGHT_TEXT:
    "© 2024 Think different Academy. All rights reserved. This Tic Tac Toe game is protected by copyright. Any copying or reproduction without prior written consent is prohibited.",
  CONTACT_TEXT:
    "For any inquiries, you can contact us at: tda@scg.cz\n\nAddress:\nThink different Academy\nKřenová 89/19\n612 00 Brno",
  TERMS_OF_USE_TEXT:
    "1. Agreement\n" +
    "By using this application, you agree to these terms.\n\n" +
    "2. Usage Rules\n" +
    "- Use the app only for playing Tic Tac Toe\n" +
    "- Do not breach application security\n" +
    "- Do not use automated systems\n\n" +
    "3. Copyright\n" +
    "Content is protected by Think different Academy copyright.\n\n" +
    "4. Liability\n" +
    "The application is provided without warranties.\n\n" +
    "5. Changes\n" +
    "We reserve the right to modify these terms.",
  PRIVACY_POLICY_TEXT:
    "Protecting your personal data is our priority. We only collect necessary data for the application to function. Your data is not shared with third parties and is processed in accordance with GDPR.",
  CREATE_ACCOUNT: "Create Account",
  PROFILE: "Profile",
  ACCOUNT_SETTINGS: "Account Settings",
  GAME_HISTORY: "Game History",
  LOG_OUT: "Log Out",
  LOG_IN: "Log In",
  WELCOME_ONLINE: "Welcome to Online Mode!",
  ELO_RATING: "Your ELO Rating",
  NEXT_RANK: "Next Rank",
  POINTS_NEEDED: "ELO points needed for next rank",
  CURRENT_RANK: "Current Rank",
  RANDOM_GAME: "Normal Game",
  RANKED_RANDOM_GAME: "Ranked Game",
  PRIVATE_GAME: "Private Game",
  PROFILE_PLAYER: "Profile of player: ",
  SETTINGS: "Settings",
  LOGOUT: "Logout",
  ELO: "Current ELO Rating",
  STATS: "Statistics",
  JOINED: "Account created",
  GAMES_PLAYED: "Games played",
  WINRATE: "Winrate",
  LOGIN: "Login",
  EMAIL: "Email",
  PASSWORD: "Password",
  NO_ACCOUNT: "Don't have an account?",
  REGISTER: "Register",
  LOGIN_FAILED: "Login failed",
  LOGIN_TITLE: "Login",
  REGISTER_TITLE: "Registration",
  GO_BACK: "Go back",
  REGISTER_FAILED: "Error registering",
  ONLINE_PAGE_TITLE: "Tic Tac Toe | Online",
  USERNAME: "Username",
  USERNAME_REQUIRED: "Username is required.",
  USERNAME_TOO_LONG: "Username must be less than 33 characters.",
  PASSWORD_REQUIRED: "Password is required (Min 8 characters).",
  INVALID_EMAIL: "Please enter a valid email address.",
  REGISTER_PAGE_TITLE: "Tic Tac Toe | Register",
};

export function ClearLoginCookie() {
  document.cookie =
    "logintoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function SetLoginCookie(token: string) {
  document.cookie = `logintoken=${token}; path=/;`;
}

export function GetLoginCookie(): string | null {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("logintoken="))
      ?.split("=")[1] || null
  );
}
