import answers from "./content/answers.json";
import guesses from "./content/guesses.json";
import { normalizeWord } from "./domain/normalize-word";
import type { Puzzle } from "./domain/types";

export const puzzles = answers as Puzzle[];
export const validWords = new Set([...guesses, ...puzzles.map(({ answer }) => answer)].map(normalizeWord));

export function getDailyPuzzle(dateKey: string): Puzzle | undefined {
  const scheduled = puzzles.find((puzzle) => puzzle.date === dateKey);
  if (scheduled) return scheduled;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return undefined;

  const [year, month, day] = dateKey.split("-").map(Number);
  const requestedDay = Date.UTC(year, month - 1, day);
  const anchorDay = Date.UTC(2026, 9, 20);
  const dayOffset = Math.floor((requestedDay - anchorDay) / 86_400_000);
  const puzzleIndex = ((dayOffset % puzzles.length) + puzzles.length) % puzzles.length;
  const selected = puzzles[puzzleIndex];
  return { ...selected, id: dateKey, date: dateKey };
}

export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find((puzzle) => puzzle.id === id) ?? getDailyPuzzle(id);
}

export function getRandomPuzzle(excludedId?: string): Puzzle {
  const options = puzzles.filter((puzzle) => puzzle.id !== excludedId);
  const pool = options.length ? options : puzzles;
  return pool[Math.floor(Math.random() * pool.length)];
}