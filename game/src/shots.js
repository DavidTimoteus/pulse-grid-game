// Deterministic screenshot scenes: stage a real game state for start/play/end.
// The autopilot searches the board for a same-colour connected group of size >=3
// and pulses it, so the play and end frames show real cascades, score and combos.
import { createState, pulse, tick, endGame } from './board.js';
import { GRID } from './config.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_OVER } from './render.js';

function findGroup(state) {
  const best = new Set();
  let bestCells = [];
  for (let i = 0; i < GRID * GRID; i++) {
    if (state.cells[i] < 0) continue;
    const colour = state.cells[i];
    const seen = new Set(), stack = [i];
    while (stack.length) {
      const cur = stack.pop();
      if (seen.has(cur) || state.cells[cur] !== colour) continue;
      seen.add(cur);
      const r = Math.floor(cur / GRID), c = cur % GRID;
      if (r > 0) stack.push(cur - GRID);
      if (r < GRID - 1) stack.push(cur + GRID);
      if (c > 0) stack.push(cur - 1);
      if (c < GRID - 1) stack.push(cur + 1);
    }
    if (seen.size > bestCells.length) bestCells = [...seen];
  }
  return bestCells.length >= 3 ? bestCells[0] : null;
}

function playScript(state, moves) {
  for (let i = 0; i < moves; i++) {
    const idx = findGroup(state);
    if (idx === null) break;
    pulse(state, Math.floor(idx / GRID), idx % GRID);
  }
}

export function stageShot(name) {
  const state = createState(1);
  if (name === 'start') return { state, screen: SCREEN_TITLE };
  if (name === 'end') {
    playScript(state, 14);
    tick(state, 31);
    endGame(state);
    return { state, screen: SCREEN_OVER };
  }
  playScript(state, 6);
  tick(state, 6);
  return { state, screen: SCREEN_PLAY };
}
