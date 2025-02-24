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
  RANKED: "HODNOCENÁ",
  UNRANKED: "NEHODNOCENÁ",
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
  LOGIN_PAGE_TITLE: "Piškvorky | Přihlášení",
  REGISTER_SUCCESS: "Registrace proběhla úspěšně! Nyní se můžeš přihlásit.",
  CHOOSE_COLOR: "Vybrat barvu",
  PROFILE_SETTINGS: "Nastavení profilu",
  USERNAME_MIN_LENGTH: "Uživatelské jméno musí mít alespoň 3 znaky",
  USERNAME_MAX_LENGTH: "Uživatelské jméno nesmí být delší než 20 znaků",
  CURRENT_PASSWORD: "Současné heslo (Povinné pro aktualizaci nastavení)",
  PASSWORDS_DO_NOT_MATCH: "Hesla se neshodují",
  INVALID_COLOR: "Prosím zadejte platný kód barvy",
  NAME_COLOR: "Barva jména",
  SAVE_CHANGES: "Uložit změny",
  NEW_PASSWORD: "Nové heslo (volitelné)",
  EMAIL_OPTIONAL: "Email (volitelné)",
  PROFILE_PICTURE: "Profilový obrázek",
  CHOOSE_PICTURE: "Změnit obrázek",
  REMOVE_PICTURE: "Odstranit obrázek",
  PROFILE_PAGE_TITLE: "Piškvorky | Profil",
  SEARCHING_GAME: "Hledání hry...",
  MATCHMAKING_CANCELLED: "Hledání hry zrušeno",
  MATCHMAKING_REQUEST_SENT: "Začal si hledat hru!",
  MATCHMAKING_REQUEST_ERROR: "Chyba při hledání hry",
  USER_NOT_LOGGED_IN: "Pro hraní musíte být přihlášeni",
  GAME_FOUND_TITLE: "Hra nalezena!",
  GAME_FOUND_DESCRIPTION: "Hru můžete příjmout či odmítnout",
  ACCEPT: "Přijmout",
  DECLINE: "Odmítnout",
  MATCHMAKING_TIMEOUT: "Čas na přijetí hry vypršel",
  ONLINE_GAME_PAGE_TITLE: "Piškvorky | Online hra",
  YOUR_SYMBOL: "Váš symbol",
  TIME_REMAINING: "Zbývající čas",
  OPPONENT: "Soupeř",
  WINS: "Výhry",
  DRAWS: "Remízy",
  LOSSES: "Prohry",
  SURRENDER: "Vzdát se",
  PLAYERS_TURN: "Na tahu je hráč",
  GAME_STATE: "Stav hry",
  GAME_OVER: "Hra skončila",
  GAME_DRAW: "Remíza",
  MOVE_COUNT: "Počet tahů",
  WINS_PLURAL: "výher",
  DRAWS_PLURAL: "remíz",
  LOSSES_PLURAL: "proher",
  ELO_RATING_OPPONENT: "Soupeřovo ELO hodnocení",
  ROUNDS_PLAYED: "Odehraná kola",
  CURRENT_COLOR: "Aktuálně vybraná barva",
  ON_TURN: "Na tahu",
  JOIN_PRIVATE_GAME: "Připojit se k soukromé hře",
  ENTER_PRIVATE_GAME_ID: "Zadejte ID soukromé hry",
  PASSWORD_MIN_LENGTH: "Heslo musí mít alespoň 8 znaků",
  PASSWORD_SPECIAL_CHAR: "Heslo musí obsahovat alespoň jeden speciální znak",
  PASSWORD_NUMBER: "Heslo musí obsahovat alespoň jedno číslo",
  PASSWORD_LOWERCASE: "Heslo musí obsahovat alespoň jedno malé písmeno",
  PASSWORD_UPPERCASE: "Heslo musí obsahovat alespoň jedno velké písmeno",
  LEADERBOARD: "Žebříček nejlepších",
  CREATE_PRIVATE_GAME: "Vytvořit soukromou hru",
  PRIVATE_GAME_DESCRIPTION:
    "Vytvořte soukromou hru a sdílejte odkaz s přítelem",
  CHOOSE_SYMBOL: "Vyberte si symbol",
  CHOOSE_TIME_LIMIT: "Vyberte časový limit",
  MINUTES: "minut",
  GENERATE_LINK: "Vygenerovat odkaz",
  GAME_LINK: "Odkaz na hru",
  COPY: "Kopírovat",
  SOMETHING_WENT_WRONG: "Něco se pokazilo, zkuste to prosím znovu",
  CLOSE: "Zavřít",
  NO_TIME_LIMIT: "Bez časového limitu",
  ELO_OPPONENT_DURING_GAME: "Soupeřovo ELO během hry",
  CLICK_TO_VIEW_GAME: "Klikněte pro zobrazení hry",
  ADMIN_PANEL: "Administrátorský Panel",
  SEARCH_USERS: "Vyhledat uživatele",
  CLEAR: "Vymazat",
  NO_USERS_FOUND: "Žádní uživatelé nenalezeni",
  FAILED_TO_FETCH_USERS: "Nepodařilo se načíst uživatele",
  USER_BANNED_SUCCESS: "Uživatel byl úspěšně zabanován",
  USER_UNBANNED_SUCCESS: "Uživatel byl úspěšně odbanován",
  USER_ACTION_FAILED: "Akce se nezdařila",
  YOUR_PROFILE: "Váš profil",
  USER_NOT_FOUND: "Uživatel nenalezen",
  EMAIL_OR_USERNAME: "Email nebo uživatelské jméno",
  EMAIL_OR_USERNAME_REQUIRED: "Email nebo uživatelské jméno je povinné",
  EMAIL_OR_USERNAME_PLACEHOLDER: "pepa@priklad.cz nebo pepanovak1",
  INVALID_CREDENTIALS: "Neplatné přihlašovací údaje",
  USER_ALREADY_EXISTS: "Uživatel již existuje",
  PASSWORD_INVALID_REGISTER: "Heslo není ve správném formátu.",
  ADMIN: "Tento uživatel je administrátor!",
  BANNED_USER: "Tento uživatel je zabanován!",
  USERNAME_EXISTS: "Uživatelské jméno již existuje",
  EMAIL_EXISTS: "Email již existuje",
  PASSWORD_NO_MATCH: "Hesla se neshodují",
  PASSWORD_NOT_STRONG_ENOUGH: "Heslo není dostatečně silné",
  INVALID_NAME_COLOR: "Neplatná barva jména",
  FAILED_SETTINGS_UPDATE: "Nastavení se nepodařilo aktualizovat",
  YOU_BAN: "Jsi zabanován!",
  OFFER_DRAW: "Nabídnout remízu",
  YOU_WON: "Vyhrál jsi!",
  YOU_LOST: "Prohrál jsi!",
  BACK_TO_ONLINE: "Zpět do online menu",
  SURRENDER_ERROR: "Chyba při vzdávání se",
  DRAW_REQUEST: "Žádost o remízu",
  IS_REQUESTING_DRAW: "žádá o remízu",
  GAME_TYPE: "Typ hry",
  ACTIVE_SESSIONS: "Aktivní přihlášení",
  SESSION_TERMINATED: "Zařízení bylo úspěšně odhlášeno",
  SESSION_TERMINATION_FAILED: "Nepodařilo se ukončit přihlášení",
  TERMINATE: "Odhlásit",
  CONFIRM_PASSWORD: "Potvrďte heslo (pouze při změně hesla)",
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
  RANKED: "RANKED",
  UNRANKED: "UNRANKED",
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
  REGISTER_FAILED: "Registration failed",
  ONLINE_PAGE_TITLE: "Tic Tac Toe | Online",
  USERNAME: "Username",
  USERNAME_REQUIRED: "Username is required.",
  USERNAME_TOO_LONG: "Username must be less than 33 characters.",
  PASSWORD_REQUIRED: "Password is required (Min 8 characters).",
  INVALID_EMAIL: "Please enter a valid email address.",
  REGISTER_PAGE_TITLE: "Tic Tac Toe | Register",
  LOGIN_PAGE_TITLE: "Tic Tac Toe | Login",
  REGISTER_SUCCESS: "Registration successful! You can now log in.",
  CHOOSE_COLOR: "Choose Color",
  PROFILE_SETTINGS: "Profile Settings",
  USERNAME_MIN_LENGTH: "Username must be at least 3 characters",
  USERNAME_MAX_LENGTH: "Username must not exceed 20 characters",
  CURRENT_PASSWORD: "Current Password (Required to make changes)",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
  INVALID_COLOR: "Please enter a valid color code",
  NAME_COLOR: "Name Color",
  SAVE_CHANGES: "Save Changes",
  NEW_PASSWORD: "New Password (optional)",
  EMAIL_OPTIONAL: "Email (optional)",
  PROFILE_PICTURE: "Profile Picture",
  CHOOSE_PICTURE: "Choose Picture",
  REMOVE_PICTURE: "Remove Picture",
  PROFILE_PAGE_TITLE: "Tic Tac Toe | Profile",
  SEARCHING_GAME: "Searching for game...",
  MATCHMAKING_CANCELLED: "Matchmaking cancelled",
  MATCHMAKING_REQUEST_SENT: "Started searching for a game!",
  MATCHMAKING_REQUEST_ERROR: "Error finding game",
  USER_NOT_LOGGED_IN: "You must be logged in to play",
  GAME_FOUND_TITLE: "Game found!",
  GAME_FOUND_DESCRIPTION: "You can accept or decline the game",
  ACCEPT: "Accept",
  DECLINE: "Decline",
  MATCHMAKING_TIMEOUT: "Time to accept the game has expired",
  ONLINE_GAME_PAGE_TITLE: "Tic Tac Toe | Online Game",
  YOUR_SYMBOL: "Your Symbol",
  TIME_REMAINING: "Time Remaining",
  OPPONENT: "Opponent",
  WINS: "Wins",
  DRAWS: "Draws",
  LOSSES: "Losses",
  SURRENDER: "Surrender",
  PLAYERS_TURN: "Player's turn",
  GAME_STATE: "Game State",
  GAME_OVER: "Game Over",
  GAME_DRAW: "Draw",
  MOVE_COUNT: "Move count",
  WINS_PLURAL: "wins",
  DRAWS_PLURAL: "draws",
  LOSSES_PLURAL: "losses",
  ELO_RATING_OPPONENT: "Opponent's ELO Rating",
  ROUNDS_PLAYED: "Rounds played",
  CURRENT_COLOR: "Currently selected color",
  ON_TURN: "On turn",
  JOIN_PRIVATE_GAME: "Join private game",
  ENTER_PRIVATE_GAME_ID: "Enter private game ID",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",
  PASSWORD_SPECIAL_CHAR: "Password must contain at least one special character",
  PASSWORD_NUMBER: "Password must contain at least one number",
  PASSWORD_LOWERCASE: "Password must contain at least one lowercase letter",
  PASSWORD_UPPERCASE: "Password must contain at least one uppercase letter",
  LEADERBOARD: "Leaderboard",
  CREATE_PRIVATE_GAME: "Create Private Game",
  PRIVATE_GAME_DESCRIPTION:
    "Create a private game and share the link with your friend",
  CHOOSE_SYMBOL: "Choose your symbol",
  CHOOSE_TIME_LIMIT: "Choose time limit",
  MINUTES: "minutes",
  GENERATE_LINK: "Generate game link",
  GAME_LINK: "Game link",
  COPY: "Copy",
  SOMETHING_WENT_WRONG: "Something went wrong, please try again",
  CLOSE: "Close",
  NO_TIME_LIMIT: "No time limit",
  ELO_OPPONENT_DURING_GAME: "Opponent's ELO during the game",
  CLICK_TO_VIEW_GAME: "Click to view game",
  ADMIN_PANEL: "Admin Panel",
  SEARCH_USERS: "Search users",
  CLEAR: "Clear",
  NO_USERS_FOUND: "No users found",
  FAILED_TO_FETCH_USERS: "Failed to fetch users",
  USER_BANNED_SUCCESS: "User has been successfully banned",
  USER_UNBANNED_SUCCESS: "User has been successfully unbanned",
  USER_ACTION_FAILED: "Action failed",
  YOUR_PROFILE: "Your profile",
  USER_NOT_FOUND: "User not found",
  EMAIL_OR_USERNAME: "Email or Username",
  EMAIL_OR_USERNAME_REQUIRED: "Email or username is required",
  EMAIL_OR_USERNAME_PLACEHOLDER: "john@example.com or johndoe",
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_ALREADY_EXISTS: "User already exists",
  PASSWORD_INVALID_REGISTER: "Password is not in the correct format.",
  ADMIN: "This user is an administrator!",
  BANNED_USER: "This user is banned!",
  USERNAME_EXISTS: "Username already exists",
  EMAIL_EXISTS: "Email already exists",
  PASSWORD_NO_MATCH: "Passwords do not match",
  PASSWORD_NOT_STRONG_ENOUGH: "Password is not strong enough",
  INVALID_NAME_COLOR: "Invalid name color",
  FAILED_SETTINGS_UPDATE: "Failed to update settings",
  YOU_BANNED: "You are banned!",
  OFFER_DRAW: "Offer draw",
  YOU_WON: "You won!",
  YOU_LOST: "You lost",
  BACK_TO_ONLINE: "Back to online menu",
  SURRENDER_ERROR: "Failed to surrender",
  DRAW_REQUEST: "Draw request",
  IS_REQUESTING_DRAW: "is requesting a draw",
  GAME_TYPE: "Game type",
  ACTIVE_SESSIONS: "Login Sessions",
  SESSION_TERMINATED: "Session logged out successfully",
  SESSION_TERMINATION_FAILED: "Failed to logout session",
  TERMINATE: "Log out",
  CONFIRM_PASSWORD: "Confirm password (only when changing password)",
};

import Cookies from "js-cookie";

export function ClearLoginCookie(): void {
  Cookies.remove("logintoken", { path: "/" });
}

export function SetLoginCookie(token: string): void {
  Cookies.set("logintoken", token, {
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function GetLoginCookie(): string | null {
  return Cookies.get("logintoken") || null;
}

export function byteArrayToImageUrl(byteArray: string | null | undefined) {
  if (!byteArray) return "/images/placeholder-avatar.png";
  return `data:image/jpeg;base64,${byteArray}`;
}

export function checkWinner(board: string[][]): {
  winner: boolean;
  winningLine: number[][];
} {
  const lines = [
    // Horizontal lines
    ...board.map((row, rowIndex) =>
      row.map((_, colIndex) => [rowIndex, colIndex])
    ),
    // Vertical lines
    ...board[0].map((_, colIndex) =>
      board.map((_, rowIndex) => [rowIndex, colIndex])
    ),
    // Diagonal lines
    ...Array.from({ length: board.length * 2 - 1 }, (_, i) => {
      const diagonal1 = [];
      const diagonal2 = [];
      for (let j = 0; j <= i; j++) {
        const x1 = i - j;
        const y1 = j;
        const x2 = board.length - 1 - (i - j);
        const y2 = j;
        if (x1 < board.length && y1 < board.length) {
          diagonal1.push([x1, y1]);
        }
        if (x2 >= 0 && y2 < board.length) {
          diagonal2.push([x2, y2]);
        }
      }
      return [diagonal1, diagonal2];
    }).flat(),
  ];

  for (const line of lines) {
    for (let i = 0; i <= line.length - 5; i++) {
      const segment = line.slice(i, i + 5);
      const cells = segment.map(
        ([rowIndex, colIndex]) => board[rowIndex][colIndex]
      );
      if (
        cells.every((cell) => cell.toUpperCase() === "X") ||
        cells.every((cell) => cell.toUpperCase() === "O")
      ) {
        return { winner: true, winningLine: segment };
      }
    }
  }
  return { winner: false, winningLine: [] };
}
