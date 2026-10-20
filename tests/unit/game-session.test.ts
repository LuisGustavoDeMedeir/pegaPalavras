import { describe, expect, it } from "vitest";
import { createGameState, submitGuess, updateDraft } from "../../src/domain/game-session";
import { getPuzzleById, validWords } from "../../src/content";

const panda = getPuzzleById("2026-10-20")!;

describe("game session", () => {
  it("submits a valid guess and evaluates repeated letters", () => {
    const state = updateDraft(createGameState("daily", panda, "2026-10-20"), "MANGA");
    const result = submitGuess(state, panda, validWords);

    expect(result.accepted).toBe(true);
    if (result.accepted) {
      expect(result.result.letters).toEqual(["absent", "correct", "correct", "absent", "correct"]);
      expect(result.state.guesses).toHaveLength(1);
    }
  });

  it("does not consume an attempt for invalid input", () => {
    const state = updateDraft(createGameState("daily", panda, "2026-10-20"), "XYZAB");
    const result = submitGuess(state, panda, validWords);

    expect(result.accepted).toBe(false);
    if (!result.accepted) {
      expect(result.reason).toBe("word");
      expect(result.state.guesses).toHaveLength(0);
    }
  });

  it("ends after six valid guesses", () => {
    let state = createGameState("daily", panda, "2026-10-20");
    for (const word of ["LIVRO", "TIGRE", "NINHO", "BRISA", "FOLHA", "POMBO"]) {
      state = updateDraft(state, word);
      const result = submitGuess(state, panda, validWords);
      expect(result.accepted).toBe(true);
      if (result.accepted) state = result.state;
    }

    expect(state.status).toBe("lost");
    expect(state.guesses).toHaveLength(6);
  });
});