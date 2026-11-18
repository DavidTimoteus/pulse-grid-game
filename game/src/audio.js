// Tiny WebAudio blips, all generated at runtime; no external sound files.
let ctx = null;
function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } }
  return ctx;
}
export function blip(freq, dur, type) {
  const a = ac(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type || 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.14, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
  o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + dur);
}
export function cascadeSound(combo) { blip(420 + combo * 90, 0.18, 'triangle'); }
export function failSound() { blip(160, 0.25, 'sawtooth'); }
