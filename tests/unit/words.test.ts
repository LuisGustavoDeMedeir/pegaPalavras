import { describe, expect, it } from "vitest";
import answers from "../../src/content/answers.json";
import guesses from "../../src/content/guesses.json";
import { countLetters, normalizeWord } from "../../src/domain/normalize-word";
import { evaluateGuess } from "../../src/domain/evaluate-guess";
import { getBrazilDateKey } from "../../src/domain/daily-date";

describe("word rules", () => {
  it("counts graphemes and compares accented vowels without collapsing cedilla", () => {
    expect(countLetters("LÁPIS")).toBe(5);
    expect(countLetters("a\u0303rvore")).toBe(6);
    expect(normalizeWord("LÁPIS")).toBe("LAPIS");
    expect(normalizeWord("CORAÇÃO")).toBe("CORAÇAO");
  });

  it("does not mark more repeated letters than the answer contains", () => {
    expect(evaluateGuess("PALMA", "PAPEL")).toEqual([
      "correct", "correct", "present", "absent", "absent",
    ]);
  });

  it("uses the Sao Paulo calendar day around midnight", () => {
    expect(getBrazilDateKey(new Date("2026-10-20T02:59:59.000Z"))).toBe("2026-10-19");
    expect(getBrazilDateKey(new Date("2026-10-20T03:00:00.000Z"))).toBe("2026-10-20");
  });

  it("keeps curated answers and guesses to five alphabetic letters", () => {
    const dictionary = new Set(guesses.map(normalizeWord));
    expect(answers.length).toBeGreaterThan(10);
    for (const puzzle of answers) {
      expect(countLetters(puzzle.answer)).toBe(5);
      expect(dictionary.has(normalizeWord(puzzle.answer))).toBe(true);
      expect(puzzle.definition.length).toBeGreaterThan(10);
      expect(puzzle.example.length).toBeGreaterThan(10);
    }
    for (const guess of guesses) {
      expect(countLetters(guess)).toBe(5);
      expect(/^\p{L}+$/u.test(guess)).toBe(true);
    }
  });
});