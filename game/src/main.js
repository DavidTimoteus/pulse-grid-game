// Pulse Grid entry point: input, loop, and screenshot staging.
import { createState, pulse, tick, endGame } from './board.js';
import { draw, SCREEN_TITLE, SCREEN_PLAY, SCREEN_OVER } from './render.js';
import { cascadeSound, failSound } from './audio.js';
import { stageShot } from './shots.js';
import { GRID, CELL, GAP, OFFSET } from './config.js';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const hud = { score: document.getElementById('score'), level: document.getElementById('level'), combo: document.getElementById('combo'), time: document.getElementById('time') };

let state = createState(1);
let screen = SCREEN_TITLE;
let last = performance.now();

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) {
  const staged = stageShot(shot);
  state = staged.state; screen = staged.screen;
  draw(ctx, state, screen);
  updateHud();
}

function updateHud() {
  hud.score.textContent = 'Score ' + state.score;
  hud.level.textContent = 'Level ' + state.level;
  hud.combo.textContent = 'Combo x' + state.combo;
  hud.time.textContent = Math.max(0, Math.ceil(state.timeLeft)) + 's';
  if (screen === SCREEN_TITLE) overlay.innerHTML = '<div class="card"><h1>PULSE GRID</h1><p>Connect 3+ gems to pulse them.</p><p>Chain cascades for combos. Beat the clock.</p><p class="big">Click or press SPACE to start</p></div>';
  else if (screen === SCREEN_OVER) overlay.innerHTML = '<div class="card"><h1>TIME UP</h1><p class="big">Score ' + state.score + '</p><p>Level ' + state.level + '</p><p>Press R to restart</p></div>';
  else overlay.innerHTML = '';
}

function start() { state = createState(Date.now() & 0xffffffff); screen = SCREEN_PLAY; updateHud(); }
function restart() { start(); }

canvas.addEventListener('click', (e) => {
  if (screen !== SCREEN_PLAY) { start(); return; }
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) - OFFSET, y = (e.clientY - rect.top) - OFFSET;
  const c = Math.floor(x / (CELL + GAP)), r = Math.floor(y / (CELL + GAP));
  if (r >= 0 && r < GRID && c >= 0 && c < GRID) { const res = pulse(state, r, c); if (res.cleared) cascadeSound(state.combo); else failSound(); }
});
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && screen !== SCREEN_PLAY) start();
  if (e.key.toLowerCase() === 'r') restart();
});

function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (screen === SCREEN_PLAY) { tick(state, dt); if (state.level > 1 && state.timeLeft > 29.4) { /* level up pulse */ cascadeSound(3); } }
  draw(ctx, state, screen); updateHud();
  requestAnimationFrame(loop);
}
if (!shot) requestAnimationFrame(loop);
updateHud();
