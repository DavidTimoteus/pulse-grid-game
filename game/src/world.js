// Emberwatch game state and rules: heat drains, logs restore it, gusts hurt.
import { HEAT_MAX, BASE_DRAIN, LOG_SECONDS, LOG_VALUE, GUST_CHANCE } from './config.js';
export function makeRng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
export function createState(seed){
  const rng=makeRng(seed);
  return {heat:HEAT_MAX,warmth:0,night:1,elapsed:0,rng,over:false,flash:0,gust:0,logs:[{x:150,y:520},{x:560,y:520},{x:250,y:560},{x:470,y:560}]};
}
export function feed(state,idx){
  if(state.over)return false;
  const log=state.logs[idx];
  if(!log||log.used)return false;
  log.used=true;
  state.heat=Math.min(HEAT_MAX,state.heat+LOG_VALUE);
  state.warmth+=10*state.night;
  state.flash=1;
  return true;
}
export function tick(state,dt){
  if(state.over)return;
  state.elapsed+=dt;state.flash=Math.max(0,state.flash-dt*2.5);state.gust=Math.max(0,state.gust-dt);
  let drain=BASE_DRAIN+state.night*1.4;
  if(state.rng()<GUST_CHANCE*dt){state.gust=1.2;state.heat-=8;}
  state.heat-=drain*dt;
  if(state.heat<=0){state.heat=0;state.over=true;}
  if(state.elapsed>=LOG_SECONDS){state.elapsed=0;state.night+=1;state.logs.forEach(l=>l.used=false);}
}
export function resetLogs(state){state.logs.forEach(l=>l.used=false);}
