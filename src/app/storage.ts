import type { GameMode, GameState, GameStatus, LetterStatus } from "../domain/types";

const STORAGE_PREFIX = "pegapalavras:game:v1:";
const modes = new Set<GameMode>(["daily", "unlimited", "practice"]);
const statuses = new Set<GameStatus>(["playing", "won", "lost"]);
const letterStatuses = new Set<LetterStatus>(["correct", "present", "absent"]);

function isStoredGame(value: unknown, mode: GameMode): value is GameState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GameState>;
  return candidate.schemaVersion === 1
    && candidate.mode === mode
    && modes.has(candidate.mode)
    && typeof candidate.puzzleId === "string"
    && typeof candidate.dateKey === "string"
    && typeof candidate.currentDraft === "string"
    && statuses.has(candidate.status as GameStatus)
    && Array.isArray(candidate.guesses)
    && candidate.guesses.length <= 6
    && candidate.guesses.every((guess) => typeof guess.word === "string"
      && Array.isArray(guess.letters)
      && guess.letters.length === 5
      && guess.letters.every((status) => letterStatuses.has(status)))
    && typeof candidate.updatedAt === "string";
}

export function loadGame(mode: GameMode): GameState | null {
  try {
    const serialized = localStorage.getItem(`${STORAGE_PREFIX}${mode}`);
    if (!serialized) return null;
    const parsed: unknown = JSON.parse(serialized);
    return isStoredGame(parsed, mode) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState): boolean {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${state.mode}`, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearGame(mode: GameMode): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${mode}`);
  } catch {
    // Storage can be unavailable in private browsing; the game remains playable in memory.
  }
}