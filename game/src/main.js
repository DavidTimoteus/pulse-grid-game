// Emberwatch entry point: input, animation loop, particles, and screenshot staging.
import { W,H } from './config.js';
import { createState, feed, tick } from './world.js';
import { draw } from './render.js';
import { stageShot } from './shots.js';
const cv=document.getElementById('stage'),c=cv.getContext('2d');
const ov=document.getElementById('overlay');
const ui={score:document.getElementById('score'),night:document.getElementById('night'),heat:document.getElementById('heat')};
let state=createState(1),screen='title',last=performance.now(),time=0;
const snow=Array.from({length:60},(_,i)=>({x:(i*131)%W,y:(i*67)%H,r:1+(i%3)*.6,sp:20+(i%5)*8}));
let embers=[];
const q=new URLSearchParams(location.search),shot=q.get('shot');
if(shot){const s=stageShot(shot);state=s.state;screen=s.screen;draw(c,state,snow,embers,0);hud();}
function hud(){ui.score.textContent='Warmth '+state.warmth;ui.night.textContent='Night '+state.night;ui.heat.textContent='Fire '+Math.round(state.heat)+'%';
 if(screen==='title')ov.innerHTML='<div class="card"><h1>EMBERWATCH</h1><p>Keep the fire alive through the long cold night.</p><p>Click a log to feed the flames. Gusts steal warmth.</p><p class="big">Click or SPACE to begin</p></div>';
 else if(screen==='over')ov.innerHTML='<div class="card"><h1>THE FIRE WENT OUT</h1><p class="big">Warmth '+state.warmth+'</p><p>Night '+state.night+'</p><p>Press R to try again</p></div>';
 else ov.innerHTML='';}
function start(){state=createState(Date.now()&0xffffffff);screen='play';embers=[];hud();}
cv.addEventListener('click',e=>{if(screen!=='play'){start();return;}const r=cv.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;
 for(let i=0;i<state.logs.length;i++){const l=state.logs[i];if(!l.used&&Math.abs(x-l.x)<34&&Math.abs(y-l.y)<16){feed(state,i);for(let k=0;k<12;k++)embers.push({x:360+(Math.random()-.5)*60,y:470,life:1,sp:1+Math.random()*2});break;}}});
window.addEventListener('keydown',e=>{if(e.key===' '&&screen!=='play')start();if(e.key.toLowerCase()==='r')start();});
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;
 if(screen==='play'){tick(state,dt);if(state.over){screen='over';hud();}}
 for(const s of snow){s.y+=s.sp*dt;if(s.y>H){s.y=0;s.x=(s.x+77)%W;}}
 embers=embers.filter(e=>{e.y-=e.sp*30*dt;e.life-=dt*.9;return e.life>0;});
 draw(c,state,snow,embers,time);hud();requestAnimationFrame(loop);}
if(!shot)requestAnimationFrame(loop);hud();
