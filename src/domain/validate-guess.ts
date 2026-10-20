import { countLetters, isAlphabeticWord, normalizeWord } from "./normalize-word";
import type { GuessValidation } from "./types";

export function validateGuess(guess: string, validWords: ReadonlySet<string>): GuessValidation {
  const cleaned = guess.trim();
  if (countLetters(cleaned) !== 5 || !isAlphabeticWord(cleaned)) {
    return { valid: false, reason: "length" };
  }
  if (!validWords.has(normalizeWord(cleaned))) {
    return { valid: false, reason: "word" };
  }
  return { valid: true };
}