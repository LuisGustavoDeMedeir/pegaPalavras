const graphemeSegmenter = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });

function normalizeCharacter(character: string): string {
  return character
    .normalize("NFD")
    .replace(/[\u0300-\u0326\u0328-\u036f]/g, "")
    .normalize("NFC")
    .toLocaleUpperCase("pt-BR");
}

export function splitLetters(word: string): string[] {
  const normalized = word.normalize("NFC");
  return Array.from(graphemeSegmenter.segment(normalized), ({ segment }) => segment);
}

export function normalizeWord(word: string): string {
  return splitLetters(word.trim()).map(normalizeCharacter).join("");
}

export function countLetters(word: string): number {
  return splitLetters(word.trim()).length;
}

export function isAlphabeticWord(word: string): boolean {
  return splitLetters(word).every((letter) => /^\p{L}$/u.test(letter));
}