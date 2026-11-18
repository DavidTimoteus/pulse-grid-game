// Canvas renderer for Pulse Grid: board, HUD text overlay pieces, end screens.
import { GRID, CELL, GAP, OFFSET, COLORS } from './config.js';

export const SCREEN_TITLE = 'title', SCREEN_PLAY = 'play', SCREEN_OVER = 'over';

export function draw(ctx2d, state, screen) {
  ctx2d.clearRect(0, 0, 720, 720);
  ctx2d.fillStyle = '#0b1226'; ctx2d.fillRect(0, 0, 720, 720);
  // subtle grid glow
  ctx2d.strokeStyle = '#16224a'; ctx2d.lineWidth = 2;
  for (let i = 0; i <= GRID; i++) {
    const p = OFFSET + i * (CELL + GAP);
    ctx2d.beginPath(); ctx2d.moveTo(p, OFFSET); ctx2d.lineTo(p, OFFSET + GRID * (CELL + GAP) - GAP); ctx2d.stroke();
    ctx2d.beginPath(); ctx2d.moveTo(OFFSET, p); ctx2d.lineTo(OFFSET + GRID * (CELL + GAP) - GAP, p); ctx2d.stroke();
  }
  for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) {
    const v = state.cells[r * GRID + c]; if (v < 0) continue;
    const x = OFFSET + c * (CELL + GAP), y = OFFSET + r * (CELL + GAP);
    ctx2d.fillStyle = COLORS[v % COLORS.length];
    roundRect(ctx2d, x, y, CELL, CELL, 16); ctx2d.fill();
    ctx2d.fillStyle = 'rgba(255,255,255,.18)';
    roundRect(ctx2d, x + 10, y + 10, CELL - 20, 18, 9); ctx2d.fill();
  }
  if (state.flash > 0) { ctx2d.fillStyle = `rgba(255,255,255,${state.flash * 0.18})`; ctx2d.fillRect(0, 0, 720, 720); }
  // Title and game-over text are drawn by the HTML overlay (single, legible card),
  // so the canvas only renders the board itself.
}
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function banner(c, title, sub) {
  c.fillStyle = '#6ee7ff'; c.font = 'bold 64px Segoe UI, Arial'; c.textAlign = 'center'; c.fillText(title, 360, 320);
  c.fillStyle = '#ffd166'; c.font = '24px Segoe UI, Arial'; c.fillText(sub, 360, 370);
}
