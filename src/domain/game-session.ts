import { evaluateGuess } from "./evaluate-guess";
import { countLetters, isAlphabeticWord, normalizeWord } from "./normalize-word";
import { validateGuess } from "./validate-guess";
import type { GameMode, GameState, GuessResult, Puzzle } from "./types";

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;

export function createGameState(mode: GameMode, puzzle: Puzzle, dateKey: string): GameState {
  return {
    schemaVersion: 1,
    mode,
    puzzleId: puzzle.id,
    dateKey,
    guesses: [],
    currentDraft: "",
    status: "playing",
    updatedAt: new Date().toISOString(),
  };
}

export function updateDraft(state: GameState, draft: string): GameState {
  if (state.status !== "playing") return state;
  const cleaned = splitDraft(draft).slice(0, WORD_LENGTH).join("");
  return { ...state, currentDraft: cleaned.toLocaleUpperCase("pt-BR"), updatedAt: new Date().toISOString() };
}

export function appendLetter(state: GameState, letter: string): GameState {
  if (!isAlphabeticWord(letter) || countLetters(letter) !== 1) return state;
  return updateDraft(state, state.currentDraft + letter);
}

export function removeLastLetter(state: GameState): GameState {
  if (state.status !== "playing") return state;
  const letters = splitDraft(state.currentDraft);
  return updateDraft(state, letters.slice(0, -1).join(""));
}

function splitDraft(draft: string): string[] {
  const normalized = draft.normalize("NFC");
  const segmenter = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });
  return Array.from(segmenter.segment(normalized), ({ segment }) => segment).filter((letter) => /^\p{L}$/u.test(letter));
}

export type SubmitResult =
  | { accepted: true; state: GameState; result: GuessResult }
  | { accepted: false; state: GameState; reason: "length" | "word" | "finished" };

export function submitGuess(state: GameState, puzzle: Puzzle, dictionary: ReadonlySet<string>): SubmitResult {
  if (state.status !== "playing") return { accepted: false, state, reason: "finished" };
  const validation = validateGuess(state.currentDraft, dictionary);
  if (!validation.valid) {
    return { accepted: false, state, reason: validation.reason ?? "word" };
  }

  const word = state.currentDraft.trim().normalize("NFC").toLocaleUpperCase("pt-BR");
  const result: GuessResult = { word, letters: evaluateGuess(word, puzzle.answer) };
  const guesses = [...state.guesses, result];
  const didWin = normalizeWord(word) === normalizeWord(puzzle.answer);
  const status = didWin ? "won" : guesses.length >= MAX_GUESSES ? "lost" : "playing";

  return {
    accepted: true,
    result,
    state: { ...state, guesses, currentDraft: "", status, updatedAt: new Date().toISOString() },
  };
}