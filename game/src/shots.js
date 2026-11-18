// Deterministic screenshot scenes: start / play / end from a real game state.
import { createState, feed, tick } from './world.js';
export function stageShot(name){
  const st=createState(1);
  if(name==='start')return {state:st,screen:'title'};
  if(name==='end'){
    for(let i=0;i<9;i++){feed(st,i%4);for(let k=0;k<20;k++)tick(st,0.05);}
    st.heat=0;st.over=true;
    return {state:st,screen:'over'};
  }
  feed(st,0);feed(st,1);for(let k=0;k<40;k++)tick(st,0.05);
  st.warmth=120;st.night=2;
  return {state:st,screen:'play'};
}
