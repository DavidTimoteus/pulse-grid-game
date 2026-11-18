// Emberwatch renderer: night sky, stars, pines, snow, fire with embers, HUD visuals.
import { W,H,FIRE_X,FIRE_Y } from './config.js';
export function draw(c,state,snow,embers,time){
  // night sky gradient
  const g=c.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0b1030');g.addColorStop(.55,'#1a1638');g.addColorStop(1,'#2a1c28');
  c.fillStyle=g;c.fillRect(0,0,W,H);
  // stars
  c.fillStyle='#dfe8ff';
  for(let i=0;i<70;i++){const x=(i*97)%W,y=(i*53)%260;c.globalAlpha=.4+.6*((i%5)/5);c.fillRect(x,y,2,2);}
  c.globalAlpha=1;
  // moon
  c.fillStyle='#f4f0d0';c.beginPath();c.arc(620,90,34,0,7);c.fill();
  // pine silhouettes
  c.fillStyle='#080c1a';
  for(let i=0;i<9;i++){const x=i*85-20;pine(c,x,H-150,70+((i*17)%40));}
  // ground
  c.fillStyle='#0a0e1c';c.fillRect(0,H-120,W,120);
  // snow
  c.fillStyle='rgba(210,230,255,.55)';
  for(const s of snow){c.beginPath();c.arc(s.x,s.y,s.r,0,7);c.fill();}
  // fire glow
  const intensity=Math.max(.2,state.heat/100);
  const glow=c.createRadialGradient(FIRE_X,FIRE_Y,0,FIRE_X,FIRE_Y,150*intensity);
  glow.addColorStop(0,'rgba(255,170,60,.55)');glow.addColorStop(1,'rgba(255,120,40,0)');
  c.fillStyle=glow;c.fillRect(FIRE_X-170,FIRE_Y-170,340,340);
  // flames (layered)
  for(let i=0;i<5;i++){
    const h=(60+i*16)*intensity*(1+.08*Math.sin(time*6+i));
    c.fillStyle=['#ff4d2e','#ff7a2f','#ff9e42','#ffc25c','#ffe6a0'][i];
    c.beginPath();c.ellipse(FIRE_X,FIRE_Y-h/2,26-i*4,h,0,0,7);c.fill();
  }
  // logs / embers
  for(const e of embers){c.fillStyle='#ffb35c';c.globalAlpha=Math.max(0,e.life);c.fillRect(e.x,e.y,3,3);}
  c.globalAlpha=1;
  // clickable logs
  for(let i=0;i<state.logs.length;i++){const l=state.logs[i];if(l.used)continue;
    c.fillStyle='#8b5a2b';c.fillRect(l.x-28,l.y-9,56,18);
    c.fillStyle='#b5793f';c.fillRect(l.x-28,l.y-9,56,6);
    c.strokeStyle='#5c3a1a';c.strokeRect(l.x-28,l.y-9,56,18);
  }
  // heat bar
  c.fillStyle='#1a2244';c.fillRect(24,24,220,16);
  c.fillStyle=state.heat>35?'#ffb35c':'#ff5d5d';c.fillRect(24,24,220*state.heat/100,16);
  c.strokeStyle='#445899';c.strokeRect(24,24,220,16);
  if(state.gust>0){c.fillStyle='rgba(180,215,255,.18)';c.fillRect(0,0,W,H);}
  if(state.flash>0){c.fillStyle=`rgba(255,220,120,${state.flash*.25})`;c.fillRect(0,0,W,H);}
}
function pine(c,x,base,h){c.beginPath();c.moveTo(x,base-h);c.lineTo(x-30,base);c.lineTo(x+30,base);c.closePath();c.fill();}
