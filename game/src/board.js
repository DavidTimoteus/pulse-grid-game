// The Pulse Grid board: state, cascade matching, and level escalation.
import { GRID, COLORS, LEVEL_SECONDS } from './config.js';

export function makeRng(seed) {
  let s = seed >>> 0;
  return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function createState(seed) {
  const rng = makeRng(seed);
  const cells = [];
  for (let i = 0; i < GRID * GRID; i++) cells.push(Math.floor(rng() * COLORS.length));
  return { cells, score: 0, combo: 1, level: 1, timeLeft: LEVEL_SECONDS, over: false, flash: 0, rng };
}

// A pulse at (r,c) clears the connected same-colour group of size >=3.
// Returns {cleared, gained}. Cascades let new colours fall in from above.
export function pulse(state, r, c) {
  if (state.over) return { cleared: 0, gained: 0 };
  const idx = r * GRID + c;
  const colour = state.cells[idx];
  const seen = new Set();
  const stack = [idx];
  while (stack.length) {
    const cur = stack.pop();
    if (seen.has(cur) || state.cells[cur] !== colour) continue;
    seen.add(cur);
    const cr = Math.floor(cur / GRID), cc = cur % GRID;
    if (cr > 0) stack.push(cur - GRID);
    if (cr < GRID - 1) stack.push(cur + GRID);
    if (cc > 0) stack.push(cur - 1);
    if (cc < GRID - 1) stack.push(cur + 1);
  }
  if (seen.size < 3) { state.combo = 1; return { cleared: 0, gained: 0 }; }
  for (const k of seen) state.cells[k] = -1;
  //Collapse columns downward, then refill from the top with fresh colours.
  for (let c2 = 0; c2 < GRID; c2++) {
    let write = GRID - 1;
    for (let r2 = GRID - 1; r2 >= 0; r2--) {
      const v = state.cells[r2 * GRID + c2];
      if (v >= 0) { state.cells[write * GRID + c2] = v; write--; }
    }
    for (let r2 = write; r2 >= 0; r2--) state.cells[r2 * GRID + c2] = Math.floor(state.rng() * COLORS.length);
  }
  state.combo = Math.min(state.combo + 1, 9);
  const gained = Math.round(seen.size * 10 * state.combo);
  state.score += gained;
  state.flash = 1;
  return { cleared: seen.size, gained };
}

export function tick(state, dt) {
  if (state.over) return;
  state.flash = Math.max(0, state.flash - dt * 3);
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.level += 1;
    state.timeLeft = LEVEL_SECONDS;
    // Increase colour variety with level (more colours = harder matches).
    if (state.level % 3 === 0) {
      for (let i = 0; i < state.cells.length; i++)
        if (state.rng() < 0.25) state.cells[i] = Math.floor(state.rng() * COLORS.length);
    }
  }
}

export function endGame(state) { state.over = true; }
