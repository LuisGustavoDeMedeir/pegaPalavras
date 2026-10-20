import { normalizeWord, splitLetters } from "./normalize-word";
import type { LetterStatus } from "./types";

export function evaluateGuess(guess: string, answer: string): LetterStatus[] {
  const guessLetters = splitLetters(normalizeWord(guess));
  const remainingAnswer = splitLetters(normalizeWord(answer));
  const statuses: LetterStatus[] = guessLetters.map(() => "absent");

  guessLetters.forEach((letter, index) => {
    if (letter === remainingAnswer[index]) {
      statuses[index] = "correct";
      remainingAnswer[index] = "";
    }
  });

  guessLetters.forEach((letter, index) => {
    if (statuses[index] === "correct") return;
    const foundAt = remainingAnswer.indexOf(letter);
    if (foundAt !== -1) {
      statuses[index] = "present";
      remainingAnswer[foundAt] = "";
    }
  });

  return statuses;
}