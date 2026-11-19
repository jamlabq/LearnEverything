import {escapeHtml} from './simulators.js';

export function manualWave(samples,widths={}){
  const signals={};
  for(const name of Object.keys(samples[0]||{}))signals[name]=samples.map((sample,i)=>[i,String(sample[name])]).filter((point,i,all)=>i===0||point[1]!==all[i-1][1]);
  return {signals,widths,duration:Math.max(samples.length,4),unit:'操作序号'};
}
export function sliceWave(data,start,end){
  start=Math.max(0,start);end=Math.min(data.duration,end);
  const signals={};
  for(const [name,points] of Object.entries(data.signals)){
    const prior=points.filter(([t])=>t<=start).at(-1);
    signals[name]=[...(prior?[[0,prior[1]]]:[]),...points.filter(([t])=>t>start&&t<end).map(([t,v])=>[t-start,v])];
  }
  return {...data,signals,offset:start,duration:end-start};
}
export function renderWave(target,data,actual=false){
  const names=Object.keys(data.signals),width=900,left=112,right=32,top=30,row=39,height=top+names.length*row+30;
  const duration=Math.max(data.duration,1),x=t=>left+t/duration*(width-left-right);
  let body=`<title>${actual?'真实 XSim 行为仿真波形':'手动操作记录'}</title>`;
  const ticks=actual?Math.max(1,Math.min(8,Math.round(duration/10))):Math.min(8,duration);
  for(let i=0;i<=ticks;i++){
    const time=duration*i/ticks,px=x(time);
    body+=`<path d="M${px} 22V${height-25}" stroke="#e4eadf" stroke-width="1"/><text x="${px}" y="${height-8}" text-anchor="middle" fill="#62755b">${Number((time+(data.offset||0)).toFixed(1))}${actual?' ns':''}</text>`;
  }
  names.forEach((name,index)=>{
    const base=top+index*row,bus=(data.widths?.[name]||1)>1;
    body+=`<text x="4" y="${base+17}" fill="#556c4b" font-size="${name.length>8?8:10}">${escapeHtml(name.toUpperCase())}${bus?` [${data.widths[name]-1}:0]`:''}</text>`;
    const points=data.signals[name];let path='',lastLevel=null;
    points.forEach(([time,value],i)=>{
      const next=i+1<points.length?points[i+1][0]:duration;
      if(next<=time)return;
      const unknown=/[xz]/i.test(value);
      if(bus||unknown){
        const px=x(time),end=x(next),gap=Math.min(4,(end-px)/3);
        body+=`<path d="M${px} ${base+10}L${px+gap} ${base}H${end-gap}L${end} ${base+10}L${end-gap} ${base+20}H${px+gap}Z" fill="${unknown?'#f3e6cd':'#edf4e4'}" stroke="${unknown?'#a7814e':'#5e8e50'}" stroke-width="1"/>`;
        if(next-time>duration/45)body+=`<text x="${(px+end)/2}" y="${base+14}" text-anchor="middle" fill="${unknown?'#8f6537':'#365c29'}" font-size="9">${escapeHtml(value.toUpperCase())}</text>`;
        lastLevel=null;return;
      }
      const level=value==='1'?base:base+20;
      if(lastLevel===null)path+=` M${x(time)} ${level}`;else path+=` V${level}`;
      path+=` H${x(next)}`;lastLevel=level;
      if(next-time>duration/22)body+=`<text x="${(x(time)+x(next))/2}" y="${base+14}" text-anchor="middle" fill="#6e8066" font-size="8">${value}</text>`;
    });
    body+=`<path d="${path}" fill="none" stroke="${index<2?'#619552':'#176d54'}" stroke-width="2" stroke-linejoin="round"/>`;
  });
  target.innerHTML=`<svg class="wave-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${actual?'XSim 实际仿真波形，横轴单位纳秒':'手动操作的信号变化记录，横轴为操作序号'}；总线数值以十进制显示">${body}</svg>`;
}
