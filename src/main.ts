import "@fontsource/baloo-2/latin-600.css";
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/lexend/latin-400.css";
import "@fontsource/lexend/latin-500.css";
import "@fontsource/lexend/latin-600.css";
import "@fontsource/lexend/latin-700.css";
import "./styles.css";
import { getDailyPuzzle, getPuzzleById, getRandomPuzzle, validWords } from "./content";
import { getBrazilDateKey, formatBrazilDate } from "./domain/daily-date";
import { appendLetter, createGameState, removeLastLetter, submitGuess } from "./domain/game-session";
import { clearGame, loadGame, saveGame } from "./app/storage";
import type { GameMode, GameState, LetterStatus, Puzzle } from "./domain/types";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Elemento principal do jogo não foi encontrado.");

const modeLabels: Record<GameMode, string> = {
  daily: "Desafio diário",
  unlimited: "Modo ilimitado",
  practice: "Modo prática",
};

const statusLabels: Record<LetterStatus, string> = {
  correct: "posição correta",
  present: "aparece em outra posição",
  absent: "não aparece na palavra",
};

const alphabet = "QWERTYUIOPASDFGHJKLÇZXCVBNM";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function todayPuzzle(): Puzzle | undefined {
  return getDailyPuzzle(getBrazilDateKey());
}

function newState(mode: GameMode): GameState | null {
  const dateKey = getBrazilDateKey();
  const puzzle = mode === "daily" ? todayPuzzle() : getRandomPuzzle();
  return puzzle ? createGameState(mode, puzzle, dateKey) : null;
}

function restoredState(mode: GameMode): GameState | null {
  const saved = loadGame(mode);
  const today = getBrazilDateKey();
  const savedPuzzle = saved ? getPuzzleById(saved.puzzleId) : undefined;
  if (!saved || !savedPuzzle) return newState(mode);

  if (mode === "daily") {
    if (saved.status === "playing" || saved.dateKey === today) return saved;
    return newState(mode);
  }

  return saved.status === "playing" ? saved : newState(mode);
}

class PegaPalavrasApp {
  private mode: GameMode = "daily";
  private state: GameState | null = restoredState("daily");
  private puzzle: Puzzle | undefined = this.state ? getPuzzleById(this.state.puzzleId) : todayPuzzle();
  private message = this.messageForState(this.state, this.puzzle, this.mode);

  constructor(private readonly element: HTMLDivElement) {
    this.render();
    this.bindEvents();
  }

  private switchMode(mode: GameMode): void {
    if (mode === this.mode) return;
    const focusedMode = document.activeElement instanceof HTMLElement
      ? document.activeElement.dataset.mode
      : undefined;
    this.mode = mode;
    this.state = restoredState(mode);
    this.puzzle = this.state ? getPuzzleById(this.state.puzzleId) : undefined;
    this.message = this.messageForState(this.state, this.puzzle, mode);
    this.render();
    if (focusedMode) this.element.querySelector<HTMLButtonElement>(`[data-mode="${focusedMode}"]`)?.focus({ preventScroll: true });
  }

  private startNextGame(): void {
    if (this.mode === "daily") return;
    clearGame(this.mode);
    this.state = newState(this.mode);
    this.puzzle = this.state ? getPuzzleById(this.state.puzzleId) : undefined;
    this.message = this.mode === "practice" ? "Modo prática: tente sem pressa." : "Uma nova palavra está pronta.";
    if (this.state) saveGame(this.state);
    this.render();
    this.element.querySelector<HTMLButtonElement>(".key:not(.wide)")?.focus({ preventScroll: true });
  }

  private messageForState(state: GameState | null, puzzle: Puzzle | undefined, mode: GameMode): string {
    if (state?.status === "won") return "Você descobriu! Agora conheça a palavra.";
    if (state?.status === "lost" && puzzle) return `As tentativas acabaram. A resposta era ${puzzle.answer}.`;
    if (mode === "practice") return "Modo prática: tente sem pressa.";
    return "Uma palavra de 5 letras. Você tem até 6 tentativas.";
  }

  private enterLetter(letter: string): void {
    if (!this.state) return;
    this.state = appendLetter(this.state, letter);
    this.message = "Sua vez: complete o palpite.";
    this.persistAndRender();
  }

  private deleteLetter(): void {
    if (!this.state) return;
    this.state = removeLastLetter(this.state);
    this.message = "Última letra apagada.";
    this.persistAndRender();
  }

  private handleSubmit(): void {
    if (!this.state || !this.puzzle) return;
    const result = submitGuess(this.state, this.puzzle, validWords);
    if (!result.accepted) {
      this.message = result.reason === "length"
        ? "Complete as cinco letras antes de enviar."
        : result.reason === "word"
          ? "Essa palavra não está na lista. Tente outra."
          : "Esta partida já terminou.";
          this.persistAndRender();
      return;
    }

    this.state = result.state;
    if (this.state.status === "won") {
      this.message = "Você descobriu! Agora conheça a palavra.";
    } else if (this.state.status === "lost") {
      this.message = `As tentativas acabaram. A resposta era ${this.puzzle.answer}.`;
    } else {
      this.message = `Palpite enviado. Restam ${6 - this.state.guesses.length} tentativas.`;
    }
    this.persistAndRender();
  }

  private persistAndRender(): void {
    if (this.state) saveGame(this.state);
    const focusedKey = document.activeElement instanceof HTMLElement
      ? document.activeElement.dataset.key
      : undefined;
    this.render();
    if (focusedKey) this.element.querySelector<HTMLButtonElement>(`[data-key="${focusedKey}"]`)?.focus({ preventScroll: true });
  }

  private renderBoard(): string {
    if (!this.state) return "";
    const guessRows = Array.from({ length: 6 }, (_, rowIndex) => {
      const guess = this.state!.guesses[rowIndex];
      const isCurrent = !guess && rowIndex === this.state!.guesses.length && this.state!.status === "playing";
      const letters = guess?.word ?? (isCurrent ? this.state!.currentDraft : "");
      const statuses: Array<LetterStatus | "current" | "empty"> = guess
        ? guess.letters
        : Array.from({ length: 5 }, (_, index) => index < letters.length ? "current" : "empty");
      const rowLabel = guess
        ? `Tentativa ${rowIndex + 1}: ${[...guess.word].map((letter, index) => `${letter}, ${statusLabels[guess.letters[index]]}`).join("; ")}`
        : isCurrent
          ? `Tentativa ${rowIndex + 1}, palpite atual`
          : `Tentativa ${rowIndex + 1}, ainda não preenchida`;
      const tiles = Array.from({ length: 5 }, (_, index) => {
        const letter = [...letters][index] ?? "";
        const status = statuses[index];
        const accessibleLabel = letter
          ? `${letter}, ${status === "current" ? "palpite atual" : statusLabels[status as LetterStatus]}`
          : "espaço vazio";
        return `<span class="tile ${status}" aria-label="${escapeHtml(accessibleLabel)}">${escapeHtml(letter)}</span>`;
      }).join("");
      return `<li class="guess-row" aria-label="${escapeHtml(rowLabel)}">${tiles}</li>`;
    }).join("");

    return `<ol class="guess-board" aria-label="Tabuleiro: seis tentativas, cinco letras">${guessRows}</ol>`;
  }

  private renderKeyboard(): string {
    const rows = ["QWERTYUIOP", "ASDFGHJKLÇ", "ZXCVBNM"];
    const bestStatus = new Map<string, LetterStatus>();
    const rank: Record<LetterStatus, number> = { absent: 0, present: 1, correct: 2 };
    for (const guess of this.state?.guesses ?? []) {
      [...guess.word].forEach((letter, index) => {
        const status = guess.letters[index];
        if (!bestStatus.has(letter) || rank[status] > rank[bestStatus.get(letter)!]) bestStatus.set(letter, status);
      });
    }

    return `<div class="keyboard" role="group" aria-label="Teclado virtual">
      ${rows.map((row, index) => `<div class="key-row">${index === 2 ? this.keyButton("ENTER", "Enviar", "wide") : ""}${[...row].map((letter) => this.keyButton(letter, letter, "", bestStatus.get(letter))).join("")}${index === 2 ? this.keyButton("BACKSPACE", "Apagar", "wide") : ""}</div>`).join("")}
    </div>`;
  }

  private keyButton(key: string, label: string, extraClass = "", status?: LetterStatus): string {
    const statusLabel = status ? statusLabels[status] : undefined;
    const accessibleLabel = key === "ENTER"
      ? "Enviar palpite"
      : key === "BACKSPACE"
        ? "Apagar última letra"
        : statusLabel ? `${key}, ${statusLabel}` : key;
    const disabled = this.state?.status !== "playing" ? " disabled" : "";
    return `<button class="key ${extraClass} ${status ?? ""}" type="button" data-key="${key}" aria-label="${escapeHtml(accessibleLabel)}"${disabled}>${escapeHtml(label)}${status ? `<span class="key-status" aria-hidden="true">${status === "correct" ? "✓" : status === "present" ? "↗" : "×"}</span>` : ""}</button>`;
  }

  private renderLearningCard(): string {
    if (!this.state || !this.puzzle || this.state.status === "playing") return "";
    const title = this.state.status === "won" ? "Você descobriu!" : "A palavra era...";
    return `<section class="learning-card" aria-labelledby="learning-title">
      <div class="learning-stamp" aria-hidden="true">${this.state.status === "won" ? "✓" : "✦"}</div>
      <div><p class="section-label">Uma palavra nova</p><h3 id="learning-title">${escapeHtml(title)} ${escapeHtml(this.puzzle.answer)}</h3>
      <p><strong>Significado:</strong> ${escapeHtml(this.puzzle.definition)}</p>
      <p><strong>Exemplo:</strong> ${escapeHtml(this.puzzle.example)}</p></div>
      ${this.mode === "daily" ? "" : `<button class="button button-secondary" type="button" data-action="next">Jogar outra palavra</button>`}
    </section>`;
  }

  private render(): void {
    const dateLabel = formatBrazilDate();
    const guessCount = this.state?.guesses.length ?? 0;
    const remaining = Math.max(0, 6 - guessCount);
    const terminal = this.state?.status !== "playing";
    const available = Boolean(this.state && this.puzzle);
    const disabledKeyboard = !available || terminal;
    const currentMode = this.mode;

    this.element.innerHTML = `<div class="app-shell">
      <header class="site-header">
        <a class="brand" href="./" aria-label="PegaPalavras, início"><span class="brand-mark" aria-hidden="true">P</span><span>PegaPalavras</span></a>
        <div class="daily-date"><span class="date-dot" aria-hidden="true"></span><span><strong>Desafio de hoje</strong><time>${escapeHtml(dateLabel)}</time></span></div>
      </header>
      <main class="game-layout">
        <section class="game-column" aria-labelledby="game-title">
          <div class="game-heading">
            <div><p class="section-label">${escapeHtml(modeLabels[currentMode])}</p><h1 id="game-title">Descubra a palavra!</h1><p class="game-subtitle">Uma palavra de 5 letras. Você tem até 6 tentativas.</p></div>
            <span class="attempt-badge" aria-label="${guessCount} ${guessCount === 1 ? "tentativa usada" : "tentativas usadas"}, ${remaining} restantes"><strong>${remaining}</strong><span>tentativas<br>restantes</span></span>
          </div>
          <nav class="mode-tabs" aria-label="Modo de jogo">
            ${(["daily", "unlimited", "practice"] as GameMode[]).map((mode) => `<button type="button" class="mode-tab ${mode === currentMode ? "active" : ""}" data-mode="${mode}" aria-pressed="${mode === currentMode}">${modeLabels[mode]}</button>`).join("")}
          </nav>
          ${available ? this.renderBoard() : `<div class="empty-state" role="status"><h2>O desafio de hoje ainda não está pronto.</h2><p>Volte mais tarde para descobrir uma nova palavra.</p></div>`}
          <p class="game-message" id="game-message" aria-live="polite" aria-atomic="true">${escapeHtml(this.message)}</p>
          ${available ? this.renderKeyboard() : ""}
          ${this.renderLearningCard()}
          <p class="privacy-note">Seu progresso fica guardado somente neste navegador.</p>
        </section>
        <aside class="help-column" aria-label="Ajuda do jogo">
          <section class="info-panel rules-panel">
            <div class="panel-icon" aria-hidden="true">?</div><div><h2>Como jogar</h2><p>Digite uma palavra com 5 letras. As marcas mostram quais letras ajudam a encontrar a resposta.</p></div>
            <ul class="feedback-legend">
              <li><span class="legend-symbol correct" aria-hidden="true">✓</span><span><strong>No lugar certo</strong><small>A letra e a posição estão corretas.</small></span></li>
              <li><span class="legend-symbol present" aria-hidden="true">↗</span><span><strong>Em outro lugar</strong><small>A letra aparece em outra posição.</small></span></li>
              <li><span class="legend-symbol absent" aria-hidden="true">×</span><span><strong>Não aparece</strong><small>Essa letra não está na palavra.</small></span></li>
            </ul>
          </section>
          <section class="info-panel hint-panel">
            <div class="hint-heading"><span class="hint-spark" aria-hidden="true">✦</span><h2>Uma pista?</h2></div>
            <p>As pistas estão sendo preparadas.</p>
            <button type="button" class="button button-hint" disabled aria-describedby="hint-status">Ver dica</button>
            <small id="hint-status">As dicas serão ativadas quando a regra de tentativas estiver definida.</small>
          </section>
        </aside>
      </main>
    </div>`;

    this.element.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => this.switchMode(button.dataset.mode as GameMode));
    });
    this.element.querySelectorAll<HTMLButtonElement>("[data-key]").forEach((button) => {
      button.addEventListener("click", () => this.handleVirtualKey(button.dataset.key ?? ""));
    });
    this.element.querySelector<HTMLButtonElement>("[data-action='next']")?.addEventListener("click", () => this.startNextGame());
    this.element.dataset.theme = "workshop";

    if (disabledKeyboard) this.element.querySelectorAll<HTMLButtonElement>(".key").forEach((button) => button.setAttribute("disabled", ""));
  }

  private handleVirtualKey(key: string): void {
    if (key === "ENTER") this.handleSubmit();
    else if (key === "BACKSPACE") this.deleteLetter();
    else if (alphabet.includes(key)) this.enterLetter(key);
  }

  private bindEvents(): void {
    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select")) return;
      if (target instanceof HTMLElement && target.closest("button, a, summary")) {
        if (event.key === "Enter" || event.key === " ") return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleSubmit();
      } else if (event.key === "Backspace") {
        event.preventDefault();
        this.deleteLetter();
      } else if (/^[a-zA-ZçÇ]$/u.test(event.key)) {
        event.preventDefault();
        this.enterLetter(event.key.toLocaleUpperCase("pt-BR"));
      }
    });
  }
}

new PegaPalavrasApp(root);