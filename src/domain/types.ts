export type GameMode = "daily" | "unlimited" | "practice";
export type GameStatus = "playing" | "won" | "lost";
export type LetterStatus = "correct" | "present" | "absent";

export interface Puzzle {
  id: string;
  date?: string;
  answer: string;
  definition: string;
  example: string;
  difficulty: "easy" | "medium";
}

export interface GuessResult {
  word: string;
  letters: LetterStatus[];
}

export interface GameState {
  schemaVersion: 1;
  mode: GameMode;
  puzzleId: string;
  dateKey: string;
  guesses: GuessResult[];
  currentDraft: string;
  status: GameStatus;
  updatedAt: string;
}

export interface GuessValidation {
  valid: boolean;
  reason?: "length" | "word";
}