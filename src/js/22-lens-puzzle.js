/* ============ LENS PUZZLE ============ */
function beam(){const g=LENSMAP;const M=s.mirrors;const pos={};
  for(let y=0;y<g.length;y++)for(let x=0;x<g[y].length;x++)if('ABCD'.includes(g[y][x]))pos[x+','+y]=g[y][x];
  let x=1,y=1,dx=1,dy=0;const path={};let out=false;
  for(let i=0;i<80;i++){x+=dx;y+=dy;const k=x+','+y;
    if(y<0||y>=g.length||x<0||x>=g[0].length)break;
    if(g[y][x]==='#'){if(y===0&&x===7&&dy===-1)out=true;break}
    const m=pos[k];if(m){if(M[m]==='/'){const t=dx;dx=-dy;dy=-t}else{const t=dx;dx=dy;dy=t}path[k]='m';continue}
    path[k]=dx?'-':'|'}
  return{path,out,pos}}

